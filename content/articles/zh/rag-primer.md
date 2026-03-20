---
title: 深入理解 RAG 系統：原理、最佳實踐與常見陷阱
date: 2025-02-20
tags: [LLM, RAG, 向量資料庫]
category: AI
---

RAG（Retrieval-Augmented Generation）是目前讓大型語言模型（LLM）接上外部知識最主流的方法。它不需要重新訓練模型，只要在推論時把相關資料「餵」給模型，就能回答特定領域的問題。本文從架構到實作，完整拆解 RAG 系統的每個環節。

> 本文基於實際專案經驗整理，部分數據為假設，用於說明概念。

## 什麼是 RAG？

RAG 的核心思路很簡單：**先檢索，再生成**。當用戶提問時，系統先從知識庫中找到最相關的文件片段，再把這些片段作為上下文（context）塞進 prompt，讓 LLM 基於這些資料生成答案。

### 為什麼不直接 Fine-tuning？

| 比較項目 | RAG | Fine-tuning |
|---------|-----|-------------|
| 知識更新 | 即時（更新文件即可） | 需要重新訓練 |
| 成本 | 低（只需向量索引） | 高（GPU 訓練時間） |
| 可溯源 | 可以引用來源文件 | 無法追溯答案來源 |
| 適用場景 | 知識密集型問答 | 風格/格式調整 |
| 幻覺控制 | 較好（有文件佐證） | 較差（模型可能編造） |

實務上，兩者常搭配使用：Fine-tuning 調整模型的回答風格，RAG 提供事實知識。但大多數企業場景（FAQ、文件問答、知識庫），RAG 單獨就能解決 80% 以上的需求。

### 典型應用場景

- **企業知識庫**：內部文件、SOP、政策法規的問答
- **客服機器人**：基於產品文件和 FAQ 回答用戶問題
- **程式碼助手**：檢索 codebase 和文件來輔助開發
- **法律/醫療諮詢**：需要準確引用來源的領域

## RAG 架構總覽

一個標準的 RAG 系統分為三個階段：

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Indexing    │ →  │  Retrieval  │ →  │  Generation │
│  離線建索引   │    │  線上檢索    │    │  生成答案    │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 階段一：Indexing（離線）

1. **載入文件**：PDF、Markdown、HTML、資料庫記錄
2. **切塊（Chunking）**：把長文件拆成小片段
3. **Embedding**：用模型把文字轉成向量
4. **存入向量資料庫**：建立索引，支援快速相似度搜尋

### 階段二：Retrieval（線上）

1. **用戶提問** → 轉成向量
2. **向量搜尋**：找到最相似的 top-k 個文件片段
3. **重排序（可選）**：用 Cross-Encoder 精排，提高相關性

### 階段三：Generation（線上）

1. **組裝 Prompt**：系統指令 + 檢索到的上下文 + 用戶問題
2. **LLM 生成答案**
3. **後處理**：引用來源、格式化、安全檢查

## 資料準備與切塊策略

切塊是 RAG 中最容易被低估、卻影響最大的環節。切得不好，後面的檢索和生成再怎麼優化都救不回來。

### 切塊策略比較

| 策略 | 做法 | 優點 | 缺點 |
|------|------|------|------|
| 固定長度 | 每 500 token 切一塊 | 簡單、可預測 | 可能切斷語意 |
| 語意切塊 | 按段落/章節/標題切分 | 保留完整語意 | 片段大小不一 |
| 遞迴切分 | 先按標題 → 段落 → 句子 | 兼顧結構與大小 | 實作較複雜 |
| 句子視窗 | 以句為單位，檢索時展開上下文 | 精確檢索 + 完整上下文 | 需要額外儲存 |

### 實作建議

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,        # 每塊最大 token 數
    chunk_overlap=50,      # 相鄰塊重疊 50 token
    separators=["\n## ", "\n### ", "\n\n", "\n", " "],
)

chunks = splitter.split_documents(documents)
```

關鍵參數：

- **chunk_size**：太大（>1000 token）會稀釋相關性，太小（<100 token）會丟失上下文。建議從 300-500 token 開始
- **chunk_overlap**：通常設為 chunk_size 的 10-15%，避免切斷邊界處的關鍵資訊
- **separators**：按文件結構設定優先級，先嘗試按標題切，其次段落，最後才是硬切

### Metadata Enrichment

單純的文字切塊往往不夠，加上 metadata 可以大幅提升檢索品質：

- **來源資訊**：文件名稱、頁碼、章節標題
- **時間戳記**：文件建立或更新時間（用於時效性篩選）
- **類別標籤**：文件類型、部門、產品線
- **摘要**：用 LLM 為每個 chunk 生成一句話摘要，檢索時同時比對摘要

## 向量索引與 Embedding

### Embedding 模型選擇

| 模型 | 維度 | 多語言 | 適用場景 |
|------|------|--------|---------|
| OpenAI text-embedding-3-small | 1536 | 是 | 通用、高品質 |
| OpenAI text-embedding-3-large | 3072 | 是 | 最高精度需求 |
| Cohere embed-v3 | 1024 | 是 | 多語言最佳化 |
| BGE-M3 (BAAI) | 1024 | 是 | 開源、可自部署 |
| GTE-large (Alibaba) | 1024 | 是 | 開源、中文優化 |

選擇考量：

- **語言覆蓋**：如果知識庫包含中英文，務必選多語言模型
- **維度與成本**：維度越高精度越好，但儲存和搜尋成本也越高
- **部署方式**：雲端 API 簡單但有延遲和成本，自部署有隱私優勢

### 向量資料庫比較

| 資料庫 | 類型 | 特色 | 適用規模 |
|--------|------|------|---------|
| Pinecone | 全託管 SaaS | 零運維、自動擴展 | 任何規模 |
| Weaviate | 開源/雲端 | 支援混合搜尋、GraphQL API | 中大型 |
| Qdrant | 開源/雲端 | 高效能、Rust 實作 | 中大型 |
| pgvector | PostgreSQL 擴充 | 與現有 DB 整合、無需新服務 | 中小型 |
| ChromaDB | 開源 | 輕量、適合原型開發 | 小型/PoC |

**實務建議**：如果團隊已有 PostgreSQL，用 pgvector 開始最省事。需要百萬級以上文件且不想管基礎設施，選 Pinecone 或 Qdrant Cloud。

### 索引類型

- **HNSW（Hierarchical Navigable Small World）**：最常用，查詢快、精度高，但記憶體消耗大
- **IVF（Inverted File Index）**：先分群再搜尋，記憶體效率較好，適合超大規模資料集
- **Flat（暴力搜尋）**：100% 精確但慢，僅適合小資料集或作為基準線

## 檢索策略

### 純向量搜尋 vs 混合搜尋

純向量搜尋依賴語意相似度，但有盲點：

- **精確匹配差**：用戶問「ERR-4012 錯誤碼」，向量搜尋可能找到語意相近但錯誤碼不同的結果
- **罕見詞彙**：專有名詞、型號、編號等在 embedding 空間中可能表示不佳

混合搜尋解決這個問題：

```python
# 假設使用 Weaviate
results = client.query.hybrid(
    query="ERR-4012 錯誤如何處理",
    alpha=0.7,   # 0 = 純 BM25, 1 = 純向量
    limit=20,
)
```

- **BM25**：基於關鍵字的傳統搜尋，擅長精確匹配
- **向量搜尋**：基於語意，擅長同義詞和模糊查詢
- **alpha 參數**：控制兩者權重，建議從 0.7（偏向量）開始調整

### 重排序（Reranking）

檢索的第一階段（BM25 + 向量）速度快但粗糙。用 Cross-Encoder 做第二階段精排：

```python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

# 先用向量搜尋取 top-20
candidates = vector_search(query, top_k=20)

# 再用 Cross-Encoder 精排取 top-5
pairs = [(query, doc.text) for doc in candidates]
scores = reranker.predict(pairs)
top_results = sorted(zip(candidates, scores), key=lambda x: -x[1])[:5]
```

兩階段檢索的效果顯著：

| 策略 | Context Recall | 延遲 |
|------|---------------|------|
| 純向量 top-5 | ~72% | ~50ms |
| 混合搜尋 top-5 | ~78% | ~80ms |
| 混合搜尋 top-20 → Rerank top-5 | ~87% | ~150ms |

多出的 100ms 延遲換來 15% 的召回率提升，在大多數場景下非常值得。

## 提示工程

### Context Injection 模式

最基本的 RAG prompt 結構：

```
你是一位專業的客服助理。請根據以下參考資料回答用戶問題。
如果參考資料中沒有相關資訊，請誠實回答「我不確定」，不要編造答案。

## 參考資料
{context}

## 用戶問題
{question}
```

### 進階技巧

**1. 分段引用**

讓模型標註答案來源，方便用戶驗證：

```
請在回答中標註引用來源，格式為 [來源 1]、[來源 2]。
每段參考資料開頭會標示其編號。
```

**2. 處理「找不到答案」**

最常見的幻覺場景是：檢索結果不相關，但模型還是硬生成答案。解法：

- 在 prompt 中明確指示「如果資料不足請說不知道」
- 設定相似度門檻，低於門檻的結果不放進 context
- 加入 confidence score，低信心時觸發人工審核

**3. 多輪對話**

對話歷史會影響檢索：用戶說「那它的價格呢？」時，「它」指的是上一輪提到的產品。解法：

```python
# 用 LLM 把多輪對話壓縮成獨立查詢
standalone_query = llm.compress(
    chat_history=history,
    latest_question="那它的價格呢？",
    # 輸出: "MacBook Pro M3 的價格是多少？"
)
results = search(standalone_query)
```

## 評估方法

RAG 系統的評估不能只看「答案對不對」，需要拆解成多個維度。

### RAGAS 框架

[RAGAS](https://docs.ragas.io/) 是目前最廣泛使用的 RAG 評估框架，定義了四個核心指標：

| 指標 | 衡量什麼 | 理想值 |
|------|---------|--------|
| Context Recall | 檢索結果包含了多少正確答案需要的資訊 | >0.85 |
| Context Precision | 檢索結果中有多少是真正相關的（而非噪音） | >0.80 |
| Faithfulness | 生成的答案是否忠於檢索到的資料（不編造） | >0.90 |
| Answer Relevance | 生成的答案是否切題回答了用戶的問題 | >0.85 |

### 評估實作

```python
from ragas import evaluate
from ragas.metrics import (
    context_recall,
    context_precision,
    faithfulness,
    answer_relevancy,
)

# 準備評估資料集
eval_dataset = [
    {
        "question": "RAG 和 Fine-tuning 的差異？",
        "answer": model_answer,
        "contexts": retrieved_contexts,
        "ground_truth": "RAG 透過檢索外部知識...",
    },
    # ... 更多測試案例
]

results = evaluate(
    dataset=eval_dataset,
    metrics=[context_recall, context_precision, faithfulness, answer_relevancy],
)
```

### 人工評估不可省

自動指標有盲點。建議定期進行人工評估：

- **每週抽樣 50-100 筆**回答，由領域專家評分
- **分級評分**：完全正確 / 部分正確 / 不正確 / 有害
- **追蹤失敗模式**：哪類問題最容易答錯？是檢索問題還是生成問題？

## 常見陷阱

### 1. 切塊太大或太小

- **太大（>1000 token）**：包含太多不相關資訊，稀釋了真正相關的內容，LLM 容易被噪音干擾
- **太小（<100 token）**：單個 chunk 缺乏上下文，模型無法理解片段的意義
- **解法**：從 300-500 token 開始，用 Context Precision 指標來調參

### 2. Embedding 與 Query 語言不匹配

知識庫是中文，但用戶可能用英文提問（或反之）。如果 embedding 模型的跨語言能力不夠，檢索效果會大幅下降。

- **解法**：使用多語言 embedding（如 BGE-M3、Cohere embed-v3），或在索引時同時存入中英文版本

### 3. Context Window 溢出

塞太多 context 進去，模型反而表現更差（Lost in the Middle 現象）。研究顯示，LLM 傾向關注 context 的開頭和結尾，中間的資訊容易被忽略。

- **解法**：控制 context 在 3-5 個 chunk（約 1500-2500 token），用 reranker 確保最相關的排在前面

### 4. 忽略資料品質

垃圾進、垃圾出。常見問題：

- PDF 解析錯誤（表格、多欄排版）
- 重複文件導致檢索結果充斥冗餘
- 過時資料沒有被清理或標記

- **解法**：建立資料清洗管道，包含去重、格式修正、時效性標記

### 5. 沒有 Fallback 機制

當檢索結果信心不足時，系統應該：

- 明確告知用戶「找不到相關資訊」
- 提供替代建議（「您是否想問...？」）
- 轉接人工客服

而不是硬生成一個看似合理但可能錯誤的答案。

### 6. 只評估端到端，不分段評估

答案錯了，是檢索的問題還是生成的問題？不分段評估就無法定位瓶頸。

- **解法**：分別追蹤 Retrieval 指標（Context Recall/Precision）和 Generation 指標（Faithfulness/Relevance），才能知道該優化哪一段

## 進階模式

### Agentic RAG

讓 LLM 自己決定要不要檢索、檢索什麼、要不要再查一次：

```
用戶問: "比較 Pinecone 和 Weaviate 的定價"

Agent 思考:
1. 先搜尋 "Pinecone pricing 2025"
2. 再搜尋 "Weaviate pricing 2025"
3. 整合兩次結果，生成比較表
```

適用於複雜問題需要多步檢索的場景。代表框架：LangGraph、CrewAI。

### GraphRAG

傳統 RAG 把文件切成獨立片段，丟失了實體之間的關聯。GraphRAG 在索引時建立知識圖譜，檢索時同時利用向量相似度和圖關係。

適用於：法規文件（條文之間有引用關係）、組織知識（人物、部門、專案的關聯）。

### Self-RAG

讓模型在生成過程中自我評估：

1. 決定是否需要檢索
2. 評估檢索結果是否相關
3. 評估生成的答案是否忠於來源
4. 如果不滿意，重新檢索或修正答案

這種「反思」機制可以顯著降低幻覺率，但增加了推論延遲和成本。

## 結語

RAG 不是一個「設定好就不管」的系統。它是一個需要持續迭代的工程：

1. **從簡單開始**：向量搜尋 + 基本 prompt，先跑起來
2. **用指標驅動優化**：RAGAS 自動評估 + 定期人工抽查
3. **逐步加入進階功能**：混合搜尋 → Reranking → Agentic RAG
4. **不要忽視資料品質**：80% 的問題出在資料，不在模型

記住：**最好的 RAG 系統不是技術最複雜的，而是最了解自己資料特性的**。花時間理解你的文件結構、用戶提問模式、和失敗案例，比盲目堆砌技術有效得多。
