---
title: 用 Python 打造可靠的資料管道：架構與實作清單
date: 2025-01-18
tags: [Python, ETL, Data Engineering]
category: 資料工程
---

每個資料工程師都寫過「能跑」的 ETL 腳本。但從「能跑」到「可維運」之間，差的不是幾行程式碼，而是一整套工程實踐：模組化架構、排程、重試、驗證、監控、告警、測試、部署。本文提供一份完整的架構設計與實作清單，幫你把 ETL 腳本升級成資料產品。

> 本文的程式碼範例以 Python 3.11+ 為基礎，部分為簡化的示意碼。

## ETL 腳本 vs 資料產品

先問自己一個問題：如果你的 ETL 明天凌晨 3 點失敗了，會發生什麼？

| 特性 | ETL 腳本 | 資料產品 |
|------|---------|---------|
| 失敗處理 | 整個中斷，隔天才發現 | 自動重試 + 即時告警 |
| 排程 | crontab 一行搞定 | DAG 管理、依賴追蹤 |
| 資料品質 | 跑完才知道有沒有問題 | 每步都有 schema 驗證 |
| 可觀測性 | print() 大法 | Structured logging + metrics |
| 部署 | ssh 上去手動跑 | CI/CD + Docker + 藍綠部署 |
| 測試 | 「我在本機測過了」 | Unit + Integration + Data quality tests |

如果你的 ETL 落在左邊那一欄，這篇文章就是你的升級路線圖。

## 模組化架構

### 目錄結構

一個可維護的資料管道專案長這樣：

```
data-pipeline/
├── src/
│   ├── extractors/        # Extract：資料來源
│   │   ├── api_client.py
│   │   ├── db_reader.py
│   │   └── file_loader.py
│   ├── transformers/      # Transform：清洗與轉換
│   │   ├── cleaner.py
│   │   ├── enricher.py
│   │   └── aggregator.py
│   ├── loaders/           # Load：目的地
│   │   ├── warehouse.py
│   │   └── lake_writer.py
│   ├── models/            # Pydantic / dataclass 定義
│   │   ├── raw.py
│   │   └── cleaned.py
│   ├── validators/        # 資料驗證邏輯
│   │   └── schemas.py
│   └── utils/             # 共用工具
│       ├── logging.py
│       ├── retry.py
│       └── config.py
├── dags/                  # Airflow DAG 定義
├── tests/
│   ├── unit/
│   ├── integration/
│   └── data_quality/
├── Dockerfile
├── pyproject.toml
└── .env.example
```

### 設計原則

1. **單一職責**：每個模組只做一件事。`api_client.py` 只管 API 呼叫，不做資料轉換
2. **介面一致**：所有 Extractor 都實作 `extract() -> list[RawRecord]`，所有 Loader 都實作 `load(records: list[CleanedRecord]) -> None`
3. **純函數優先**：Transform 邏輯盡量寫成純函數，不依賴外部狀態，方便測試
4. **Config 外部化**：所有可變參數（URL、table name、batch size）從環境變數或 config 檔讀取

```python
# src/models/raw.py
from pydantic import BaseModel
from datetime import datetime

class RawTransaction(BaseModel):
    transaction_id: str
    amount: float
    currency: str
    timestamp: datetime
    source: str

# src/extractors/api_client.py
from src.models.raw import RawTransaction

def extract_transactions(api_url: str, since: datetime) -> list[RawTransaction]:
    response = httpx.get(f"{api_url}/transactions", params={"since": since.isoformat()})
    response.raise_for_status()
    return [RawTransaction(**item) for item in response.json()]
```

Pydantic 在 Extract 階段就擋住不合格的資料，不讓髒資料進到 Transform。

## 排程

### 工具比較

| 工具 | 類型 | 優點 | 缺點 | 適用規模 |
|------|------|------|------|---------|
| Cron | 系統內建 | 零依賴、簡單 | 無依賴管理、無 UI | 單一腳本 |
| Airflow | 開源平台 | DAG 視覺化、社群大、外掛豐富 | 設定重、學習曲線高 | 中大型團隊 |
| Prefect | 開源/雲端 | Pythonic API、輕量 | 生態圈較小 | 小中型團隊 |
| Dagster | 開源/雲端 | Asset-centric、型別安全 | 概念較多 | 中大型團隊 |
| dbt | SQL-first | SQL 專家友善、lineage | 僅限 Transform | SQL 為主的團隊 |

### Airflow DAG 範例

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    "owner": "data-team",
    "retries": 3,
    "retry_delay": timedelta(minutes=5),
    "retry_exponential_backoff": True,
    "execution_timeout": timedelta(hours=1),
}

with DAG(
    dag_id="daily_transactions_etl",
    schedule="0 2 * * *",        # 每天凌晨 2 點
    start_date=datetime(2025, 1, 1),
    catchup=False,
    default_args=default_args,
    tags=["etl", "transactions"],
) as dag:

    extract = PythonOperator(
        task_id="extract",
        python_callable=extract_transactions,
    )
    transform = PythonOperator(
        task_id="transform",
        python_callable=transform_transactions,
    )
    validate = PythonOperator(
        task_id="validate",
        python_callable=validate_output,
    )
    load = PythonOperator(
        task_id="load",
        python_callable=load_to_warehouse,
    )

    extract >> transform >> validate >> load
```

### DAG 設計原則

- **冪等性（Idempotency）**：同一份 DAG 跑兩次，結果要一樣。用 `UPSERT` 而非 `INSERT`
- **可回填（Backfill）**：支援指定日期重跑，不要 hardcode 「今天」
- **原子性（Atomicity）**：每個 task 要嘛全部成功、要嘛全部失敗。避免「寫了一半」的狀態
- **小步驟**：一個 task 只做一件事，方便定位失敗原因和部分重跑

## 錯誤處理與重試

### Retry 裝飾器

```python
import time
import logging
from functools import wraps

logger = logging.getLogger(__name__)

def retry(max_retries: int = 3, base_delay: float = 1.0, backoff_factor: float = 2.0):
    """指數退避重試裝飾器"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < max_retries:
                        delay = base_delay * (backoff_factor ** attempt)
                        logger.warning(
                            "Attempt %d/%d failed for %s: %s. Retrying in %.1fs",
                            attempt + 1, max_retries, func.__name__, e, delay,
                        )
                        time.sleep(delay)
            raise last_exception
        return wrapper
    return decorator

# 使用
@retry(max_retries=3, base_delay=2.0)
def fetch_from_api(url: str) -> dict:
    response = httpx.get(url, timeout=30)
    response.raise_for_status()
    return response.json()
```

### 該重試 vs 不該重試

| 狀況 | 該重試？ | 原因 |
|------|---------|------|
| HTTP 429 (Rate Limit) | 是 | 暫時性，等一下就好 |
| HTTP 500 (Server Error) | 是 | 對方可能暫時有問題 |
| HTTP 400 (Bad Request) | 否 | 我們的請求有誤，重試沒用 |
| 連線逾時 | 是 | 網路可能短暫不穩 |
| 資料驗證失敗 | 否 | 資料本身有問題，需要人介入 |
| 磁碟空間不足 | 否 | 基礎設施問題，重試不會解決 |

### 冪等性設計

重試的前提是冪等。如果你的 Load 步驟用 `INSERT`，重試就會產生重複資料。解法：

```python
# 不好：INSERT 可能造成重複
cursor.execute("INSERT INTO transactions VALUES (%s, %s, %s)", ...)

# 好：UPSERT 確保冪等
cursor.execute("""
    INSERT INTO transactions (id, amount, currency)
    VALUES (%s, %s, %s)
    ON CONFLICT (id) DO UPDATE SET
        amount = EXCLUDED.amount,
        currency = EXCLUDED.currency,
        updated_at = NOW()
""", ...)
```

## 資料驗證與型別管理

資料管道的大部分 bug 不是程式邏輯錯誤，而是**資料長得跟你想的不一樣**。

### 驗證框架比較

| 框架 | 定位 | 特色 | 適用場景 |
|------|------|------|---------|
| Pydantic | 單筆記錄驗證 | 型別強制、JSON schema 生成 | API 回傳、逐筆檢查 |
| Pandera | DataFrame 驗證 | Pandas 原生、統計檢查 | 批次資料、表格層級 |
| Great Expectations | 資料品質平台 | 豐富的 Expectation、文件產生 | 企業級、需要報表 |

### Pydantic 驗證範例

```python
from pydantic import BaseModel, field_validator
from datetime import datetime

class CleanedTransaction(BaseModel):
    transaction_id: str
    amount_usd: float
    category: str
    timestamp: datetime
    is_valid: bool

    @field_validator("amount_usd")
    @classmethod
    def amount_must_be_positive(cls, v):
        if v < 0:
            raise ValueError(f"Amount must be non-negative, got {v}")
        return round(v, 2)

    @field_validator("category")
    @classmethod
    def category_must_be_known(cls, v):
        allowed = {"food", "transport", "entertainment", "utilities", "other"}
        if v not in allowed:
            raise ValueError(f"Unknown category: {v}")
        return v
```

### Pandera DataFrame 驗證

```python
import pandera as pa

schema = pa.DataFrameSchema({
    "transaction_id": pa.Column(str, unique=True),
    "amount_usd": pa.Column(float, pa.Check.ge(0)),
    "category": pa.Column(str, pa.Check.isin(["food", "transport", "entertainment", "utilities", "other"])),
    "timestamp": pa.Column("datetime64[ns]"),
    "row_count": pa.Check(lambda df: len(df) > 0, error="DataFrame is empty"),
})

# 在 Transform 結束後驗證
validated_df = schema.validate(output_df)
```

### 驗證策略

- **Extract 後**：用 Pydantic 驗證單筆記錄的結構和型別
- **Transform 後**：用 Pandera 驗證整張表的統計特性（非空、範圍、唯一性）
- **Load 前**：最後一道防線，確認 row count、schema 相容性
- **Load 後**：用 SQL 檢查目標表的 row count、null 比例、時間範圍

## 監控與告警

### Structured Logging

別再用 `print()` 了。用 structured logging 讓日誌可被機器解析：

```python
import logging
import json
from datetime import datetime

class JsonFormatter(logging.Formatter):
    def format(self, record):
        log = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if hasattr(record, "pipeline"):
            log["pipeline"] = record.pipeline
        if hasattr(record, "row_count"):
            log["row_count"] = record.row_count
        if record.exc_info:
            log["exception"] = self.formatException(record.exc_info)
        return json.dumps(log)

# 設定
handler = logging.StreamHandler()
handler.setFormatter(JsonFormatter())
logger = logging.getLogger("pipeline")
logger.addHandler(handler)
logger.setLevel(logging.INFO)

# 使用
logger.info(
    "Extract completed",
    extra={"pipeline": "daily_transactions", "row_count": 15420},
)
```

輸出：
```json
{"timestamp": "2025-01-18T02:15:30", "level": "INFO", "logger": "pipeline", "message": "Extract completed", "pipeline": "daily_transactions", "row_count": 15420}
```

### 該監控什麼

| 指標 | 類型 | 告警條件 |
|------|------|---------|
| Pipeline 執行時間 | 效能 | 超過歷史平均 2 倍 |
| 處理筆數 | 業務 | 比昨天少 50% 以上 |
| 失敗率 | 可靠性 | 任何非預期失敗 |
| 資料延遲 | 時效性 | 最新資料超過 SLA |
| 資源使用 | 基礎設施 | 記憶體 / CPU 超過閾值 |

### 告警設計原則

- **分級**：P0（立即處理）、P1（工作時間處理）、P2（下次迭代修）
- **可行動**：告警訊息要包含「發生什麼」+「去哪裡看」+「建議怎麼處理」
- **不疲勞**：告警太多就沒人看了。合併同類型告警、設定靜音窗口
- **雙通道**：P0 走 PagerDuty / 電話，P1 走 Slack / Email

## 測試策略

### 三層測試金字塔

```
        △ Data Quality Tests（少量、關鍵）
       ╱ ╲   — row count、schema、統計分佈
      ╱───╲
     ╱     ╲ Integration Tests（中量）
    ╱       ╲   — 連真實 DB / API 測試端到端
   ╱─────────╲
  ╱           ╲ Unit Tests（大量、快速）
 ╱             ╲   — 純函數邏輯、mock 外部依賴
╱───────────────╲
```

### Unit Test 範例

```python
import pytest
from src.transformers.cleaner import normalize_currency

def test_normalize_currency_usd():
    assert normalize_currency(100.0, "USD") == 100.0

def test_normalize_currency_eur():
    result = normalize_currency(100.0, "EUR")
    assert 100.0 < result < 120.0  # 合理匯率範圍

def test_normalize_currency_unknown_raises():
    with pytest.raises(ValueError, match="Unsupported currency"):
        normalize_currency(100.0, "XYZ")
```

### Integration Test（用 testcontainers）

```python
import pytest
from testcontainers.postgres import PostgresContainer

@pytest.fixture(scope="module")
def pg():
    with PostgresContainer("postgres:16") as postgres:
        yield postgres.get_connection_url()

def test_load_to_warehouse(pg):
    # 用真實的 PostgreSQL 測試 Load 邏輯
    loader = WarehouseLoader(connection_url=pg)
    records = [CleanedTransaction(...), CleanedTransaction(...)]
    loader.load(records)

    # 驗證
    result = loader.query("SELECT COUNT(*) FROM transactions")
    assert result[0][0] == 2
```

### Data Quality Test

```python
def test_no_future_timestamps(warehouse_connection):
    """確保沒有未來時間的交易"""
    result = warehouse_connection.execute(
        "SELECT COUNT(*) FROM transactions WHERE timestamp > NOW()"
    )
    assert result[0][0] == 0, "Found transactions with future timestamps"

def test_amount_distribution(warehouse_connection):
    """確保金額分佈合理"""
    result = warehouse_connection.execute(
        "SELECT AVG(amount_usd), MAX(amount_usd) FROM transactions WHERE date = CURRENT_DATE"
    )
    avg, max_val = result[0]
    assert avg > 0, "Average amount should be positive"
    assert max_val < 1_000_000, f"Suspiciously large transaction: {max_val}"
```

## Secret 管理與安全

### 千萬不要做的事

```python
# 絕對不要
DB_PASSWORD = "super_secret_123"
API_KEY = "sk-1234567890abcdef"
```

### 正確做法

**開發環境**：`.env` 檔 + `python-dotenv`

```python
# .env (加入 .gitignore！)
DB_HOST=localhost
DB_PASSWORD=local_dev_password
API_KEY=sk-test-key

# config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    db_host: str
    db_password: str
    api_key: str

    class Config:
        env_file = ".env"

settings = Settings()
```

**生產環境**：Secret Manager

| 服務 | 適用場景 |
|------|---------|
| AWS Secrets Manager | AWS 生態系 |
| GCP Secret Manager | GCP 生態系 |
| HashiCorp Vault | 多雲 / 自架 |
| Doppler | 輕量、跨平台 |

### 安全清單

- [ ] `.env` 已加入 `.gitignore`
- [ ] 沒有任何 secret hardcode 在程式碼中
- [ ] CI/CD 的 secret 透過 GitHub Secrets / Vault 注入
- [ ] 資料庫連線使用最小權限原則
- [ ] API key 有設定過期時間和 scope

## 部署與 CI/CD

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY pyproject.toml .
RUN pip install --no-cache-dir .

COPY src/ src/
COPY dags/ dags/

# 非 root 用戶
RUN useradd -m pipeline
USER pipeline

CMD ["python", "-m", "src.main"]
```

### GitHub Actions CI/CD

```yaml
name: Pipeline CI/CD

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        ports: ["5432:5432"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install -e ".[test]"
      - run: pytest tests/ --cov=src --cov-report=xml
      - uses: codecov/codecov-action@v4

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t pipeline:${{ github.sha }} .
      - run: docker push $REGISTRY/pipeline:${{ github.sha }}
```

### 部署策略

- **藍綠部署**：新舊版本同時存在，驗證無誤後切換流量
- **Canary**：新版本先處理 10% 的資料，確認無誤再全量
- **回滾計畫**：每次部署前確認「如果出問題，怎麼回到上一版？」

## 實作清單

把以上內容濃縮成一張可直接使用的檢核表：

### 架構

- [ ] Extract / Transform / Load 分離為獨立模組
- [ ] 所有可變參數外部化（config / 環境變數）
- [ ] Pydantic model 定義輸入輸出的 schema

### 可靠性

- [ ] 外部呼叫加上 retry + 指數退避
- [ ] Load 步驟支援冪等（UPSERT）
- [ ] 每個 pipeline 步驟可獨立重跑

### 資料品質

- [ ] Extract 後用 Pydantic 驗證單筆結構
- [ ] Transform 後用 Pandera 驗證 DataFrame
- [ ] Load 後用 SQL 檢查 row count 和 null 比例

### 可觀測性

- [ ] Structured logging（JSON 格式）
- [ ] 關鍵指標監控（執行時間、筆數、失敗率）
- [ ] 分級告警（P0 電話 / P1 Slack）

### 測試

- [ ] Unit test 覆蓋率 > 80%
- [ ] Integration test 用 testcontainers
- [ ] Data quality test 確保統計分佈合理

### 安全

- [ ] 零 hardcoded secrets
- [ ] `.env` 在 `.gitignore` 中
- [ ] 最小權限資料庫帳號

### 部署

- [ ] Dockerfile 使用非 root 用戶
- [ ] CI/CD 自動跑測試 + 部署
- [ ] 有回滾計畫

## 結語

把 ETL 腳本升級成資料產品，不需要一次做完。建議的優先順序：

1. **先加型別驗證**（Pydantic）— 成本最低、效果最大，立刻擋住 80% 的資料問題
2. **再加重試 + 告警** — 讓管道在你睡覺時也能自我修復或叫你起床
3. **然後加測試** — 有信心才敢重構和擴展
4. **最後上排程和 CI/CD** — 讓部署變成一個按鈕的事

記住：**可靠的資料管道不是寫出來的，是迭代出來的**。先從最痛的問題開始解決，每次迭代補齊一塊，半年後你會發現整個系統已經脫胎換骨。
