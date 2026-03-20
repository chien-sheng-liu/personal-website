---
title: "Reliable Data Pipelines in Python: Architecture and Checklist"
date: 2025-01-18
tags: [Python, ETL, Data Engineering]
category: Data Engineering
---

Every data engineer has written an ETL script that "works." But from "works" to "operable" is not a few extra lines of code — it's a full set of engineering practices: modular architecture, scheduling, retries, validation, monitoring, alerting, testing, and deployment. This article provides a complete architecture design and implementation checklist to help you level up your ETL scripts into data products.

> Code examples are based on Python 3.11+ and are simplified for illustration.

## ETL Scripts vs. Data Products

Ask yourself: if your ETL fails at 3 AM tomorrow, what happens?

| Trait | ETL Script | Data Product |
|-------|-----------|-------------|
| Failure handling | Crashes silently, discovered next day | Auto-retry + instant alerting |
| Scheduling | One-line crontab | DAG management, dependency tracking |
| Data quality | Hope for the best | Schema validation at every step |
| Observability | print() debugging | Structured logging + metrics |
| Deployment | SSH in and run manually | CI/CD + Docker + blue-green deploy |
| Testing | "I tested it on my laptop" | Unit + Integration + Data quality tests |

If your ETL lives in the left column, this article is your upgrade roadmap.

## Modular Architecture

### Directory Structure

A maintainable data pipeline project looks like this:

```
data-pipeline/
├── src/
│   ├── extractors/        # Extract: data sources
│   │   ├── api_client.py
│   │   ├── db_reader.py
│   │   └── file_loader.py
│   ├── transformers/      # Transform: cleaning & transformation
│   │   ├── cleaner.py
│   │   ├── enricher.py
│   │   └── aggregator.py
│   ├── loaders/           # Load: destinations
│   │   ├── warehouse.py
│   │   └── lake_writer.py
│   ├── models/            # Pydantic / dataclass definitions
│   │   ├── raw.py
│   │   └── cleaned.py
│   ├── validators/        # Data validation logic
│   │   └── schemas.py
│   └── utils/             # Shared utilities
│       ├── logging.py
│       ├── retry.py
│       └── config.py
├── dags/                  # Airflow DAG definitions
├── tests/
│   ├── unit/
│   ├── integration/
│   └── data_quality/
├── Dockerfile
├── pyproject.toml
└── .env.example
```

### Design Principles

1. **Single responsibility**: Each module does one thing. `api_client.py` handles API calls only — no data transformation
2. **Consistent interfaces**: All Extractors implement `extract() -> list[RawRecord]`; all Loaders implement `load(records: list[CleanedRecord]) -> None`
3. **Pure functions first**: Transform logic should be pure functions with no external state, making them easy to test
4. **Externalized config**: All mutable parameters (URLs, table names, batch sizes) read from environment variables or config files

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

Pydantic catches malformed data at the Extract stage — dirty data never reaches Transform.

## Scheduling

### Tool Comparison

| Tool | Type | Pros | Cons | Scale |
|------|------|------|------|-------|
| Cron | Built-in | Zero dependencies, simple | No dependency management, no UI | Single scripts |
| Airflow | Open source | DAG visualization, large community, rich plugins | Heavy setup, steep learning curve | Medium–large teams |
| Prefect | Open source / cloud | Pythonic API, lightweight | Smaller ecosystem | Small–medium teams |
| Dagster | Open source / cloud | Asset-centric, type-safe | Many concepts to learn | Medium–large teams |
| dbt | SQL-first | SQL-expert friendly, lineage | Transform only | SQL-heavy teams |

### Airflow DAG Example

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
    schedule="0 2 * * *",        # Daily at 2 AM
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

### DAG Design Principles

- **Idempotency**: Running the same DAG twice must produce the same result. Use `UPSERT`, not `INSERT`
- **Backfill support**: Support re-running for specific dates — never hardcode "today"
- **Atomicity**: Each task either fully succeeds or fully fails. Avoid "half-written" states
- **Small tasks**: One task, one job — makes it easier to pinpoint failures and partial re-runs

## Error Handling and Retries

### Retry Decorator

```python
import time
import logging
from functools import wraps

logger = logging.getLogger(__name__)

def retry(max_retries: int = 3, base_delay: float = 1.0, backoff_factor: float = 2.0):
    """Exponential backoff retry decorator"""
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

# Usage
@retry(max_retries=3, base_delay=2.0)
def fetch_from_api(url: str) -> dict:
    response = httpx.get(url, timeout=30)
    response.raise_for_status()
    return response.json()
```

### Retry vs. Don't Retry

| Situation | Retry? | Reason |
|-----------|--------|--------|
| HTTP 429 (Rate Limit) | Yes | Transient — just wait |
| HTTP 500 (Server Error) | Yes | Remote server may be temporarily down |
| HTTP 400 (Bad Request) | No | Our request is wrong — retrying won't help |
| Connection timeout | Yes | Network may be briefly unstable |
| Data validation failure | No | The data itself is wrong — needs human intervention |
| Disk full | No | Infrastructure issue — retries won't resolve it |

### Idempotency Design

Retries require idempotency. If your Load step uses `INSERT`, retries create duplicates. Solution:

```python
# Bad: INSERT may cause duplicates
cursor.execute("INSERT INTO transactions VALUES (%s, %s, %s)", ...)

# Good: UPSERT ensures idempotency
cursor.execute("""
    INSERT INTO transactions (id, amount, currency)
    VALUES (%s, %s, %s)
    ON CONFLICT (id) DO UPDATE SET
        amount = EXCLUDED.amount,
        currency = EXCLUDED.currency,
        updated_at = NOW()
""", ...)
```

## Data Validation and Typing

Most data pipeline bugs aren't logic errors — they're **data looking different than you expected**.

### Validation Framework Comparison

| Framework | Focus | Strengths | Best For |
|-----------|-------|-----------|---------|
| Pydantic | Per-record validation | Type enforcement, JSON schema generation | API responses, row-level checks |
| Pandera | DataFrame validation | Pandas-native, statistical checks | Batch data, table-level |
| Great Expectations | Data quality platform | Rich expectations, documentation | Enterprise, reporting needs |

### Pydantic Validation Example

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

### Pandera DataFrame Validation

```python
import pandera as pa

schema = pa.DataFrameSchema({
    "transaction_id": pa.Column(str, unique=True),
    "amount_usd": pa.Column(float, pa.Check.ge(0)),
    "category": pa.Column(str, pa.Check.isin(["food", "transport", "entertainment", "utilities", "other"])),
    "timestamp": pa.Column("datetime64[ns]"),
    "row_count": pa.Check(lambda df: len(df) > 0, error="DataFrame is empty"),
})

# Validate after Transform
validated_df = schema.validate(output_df)
```

### Validation Strategy

- **After Extract**: Pydantic validates per-record structure and types
- **After Transform**: Pandera validates table-level statistics (non-null, ranges, uniqueness)
- **Before Load**: Final safety gate — confirm row count and schema compatibility
- **After Load**: SQL checks on the target table for row count, null ratios, and time ranges

## Monitoring and Alerting

### Structured Logging

Stop using `print()`. Use structured logging so logs are machine-parseable:

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

# Setup
handler = logging.StreamHandler()
handler.setFormatter(JsonFormatter())
logger = logging.getLogger("pipeline")
logger.addHandler(handler)
logger.setLevel(logging.INFO)

# Usage
logger.info(
    "Extract completed",
    extra={"pipeline": "daily_transactions", "row_count": 15420},
)
```

### What to Monitor

| Metric | Type | Alert When |
|--------|------|-----------|
| Pipeline duration | Performance | >2x historical average |
| Row count | Business | >50% drop vs. yesterday |
| Failure rate | Reliability | Any unexpected failure |
| Data freshness | Timeliness | Latest data exceeds SLA |
| Resource usage | Infrastructure | Memory / CPU above threshold |

### Alerting Design Principles

- **Tiered severity**: P0 (act now), P1 (handle during business hours), P2 (next iteration)
- **Actionable**: Each alert should include "what happened" + "where to look" + "suggested fix"
- **No fatigue**: Too many alerts and nobody reads them. Deduplicate, set quiet windows
- **Dual-channel**: P0 via PagerDuty / phone; P1 via Slack / email

## Testing Strategy

### Three-Layer Test Pyramid

```
        △ Data Quality Tests (few, critical)
       ╱ ╲   — row count, schema, distributions
      ╱───╲
     ╱     ╲ Integration Tests (moderate)
    ╱       ╲   — real DB / API end-to-end
   ╱─────────╲
  ╱           ╲ Unit Tests (many, fast)
 ╱             ╲   — pure function logic, mock externals
╱───────────────╲
```

### Unit Test Example

```python
import pytest
from src.transformers.cleaner import normalize_currency

def test_normalize_currency_usd():
    assert normalize_currency(100.0, "USD") == 100.0

def test_normalize_currency_eur():
    result = normalize_currency(100.0, "EUR")
    assert 100.0 < result < 120.0  # reasonable exchange rate range

def test_normalize_currency_unknown_raises():
    with pytest.raises(ValueError, match="Unsupported currency"):
        normalize_currency(100.0, "XYZ")
```

### Integration Test (with testcontainers)

```python
import pytest
from testcontainers.postgres import PostgresContainer

@pytest.fixture(scope="module")
def pg():
    with PostgresContainer("postgres:16") as postgres:
        yield postgres.get_connection_url()

def test_load_to_warehouse(pg):
    loader = WarehouseLoader(connection_url=pg)
    records = [CleanedTransaction(...), CleanedTransaction(...)]
    loader.load(records)

    result = loader.query("SELECT COUNT(*) FROM transactions")
    assert result[0][0] == 2
```

### Data Quality Test

```python
def test_no_future_timestamps(warehouse_connection):
    """Ensure no transactions have future timestamps"""
    result = warehouse_connection.execute(
        "SELECT COUNT(*) FROM transactions WHERE timestamp > NOW()"
    )
    assert result[0][0] == 0, "Found transactions with future timestamps"

def test_amount_distribution(warehouse_connection):
    """Ensure amount distribution is reasonable"""
    result = warehouse_connection.execute(
        "SELECT AVG(amount_usd), MAX(amount_usd) FROM transactions WHERE date = CURRENT_DATE"
    )
    avg, max_val = result[0]
    assert avg > 0, "Average amount should be positive"
    assert max_val < 1_000_000, f"Suspiciously large transaction: {max_val}"
```

## Secret Management and Security

### What Never to Do

```python
# Absolutely not
DB_PASSWORD = "super_secret_123"
API_KEY = "sk-1234567890abcdef"
```

### The Right Way

**Development**: `.env` file + `python-dotenv`

```python
# .env (add to .gitignore!)
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

**Production**: Secret Manager

| Service | Best For |
|---------|---------|
| AWS Secrets Manager | AWS ecosystem |
| GCP Secret Manager | GCP ecosystem |
| HashiCorp Vault | Multi-cloud / self-hosted |
| Doppler | Lightweight, cross-platform |

### Security Checklist

- [ ] `.env` is in `.gitignore`
- [ ] Zero hardcoded secrets in source code
- [ ] CI/CD secrets injected via GitHub Secrets / Vault
- [ ] Database connections use least-privilege accounts
- [ ] API keys have expiration and scoped permissions

## Deployment and CI/CD

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY pyproject.toml .
RUN pip install --no-cache-dir .

COPY src/ src/
COPY dags/ dags/

# Non-root user
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

### Deployment Strategies

- **Blue-green**: Old and new versions coexist; switch traffic after verification
- **Canary**: New version processes 10% of data first; go full after confirmation
- **Rollback plan**: Before every deploy, confirm "if something goes wrong, how do we revert?"

## Implementation Checklist

Everything above condensed into a ready-to-use checklist:

### Architecture

- [ ] Extract / Transform / Load separated into independent modules
- [ ] All mutable parameters externalized (config / env vars)
- [ ] Pydantic models define input/output schemas

### Reliability

- [ ] External calls have retry + exponential backoff
- [ ] Load step supports idempotency (UPSERT)
- [ ] Each pipeline step can be re-run independently

### Data Quality

- [ ] Post-Extract: Pydantic validates per-record structure
- [ ] Post-Transform: Pandera validates DataFrames
- [ ] Post-Load: SQL checks row count and null ratios

### Observability

- [ ] Structured logging (JSON format)
- [ ] Key metrics monitored (duration, row count, failure rate)
- [ ] Tiered alerting (P0 phone / P1 Slack)

### Testing

- [ ] Unit test coverage > 80%
- [ ] Integration tests with testcontainers
- [ ] Data quality tests verify statistical distributions

### Security

- [ ] Zero hardcoded secrets
- [ ] `.env` in `.gitignore`
- [ ] Least-privilege database accounts

### Deployment

- [ ] Dockerfile uses non-root user
- [ ] CI/CD runs tests + deploys automatically
- [ ] Rollback plan documented

## Conclusion

Upgrading ETL scripts to data products doesn't have to happen all at once. Recommended priority:

1. **Add type validation first** (Pydantic) — lowest cost, highest impact; immediately blocks 80% of data issues
2. **Then add retries + alerting** — let the pipeline self-heal while you sleep, or wake you up when it can't
3. **Then add tests** — confidence enables refactoring and extension
4. **Finally, add scheduling and CI/CD** — make deployment a one-button affair

Remember: **reliable data pipelines aren't written — they're iterated into existence**. Start with your most painful problem, fix one piece per iteration, and six months later you'll find the entire system transformed.
