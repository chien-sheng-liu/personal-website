---
title: "A Practical Guide to RAG: Principles, Best Practices, and Pitfalls"
date: 2025-02-20
tags: [LLM, RAG, Vector DB]
category: AI
---

Retrieval-Augmented Generation (RAG) is the most popular way to connect large language models (LLMs) to external knowledge. Instead of retraining the model, you feed relevant documents into the prompt at inference time. This article breaks down every stage of a RAG system — from architecture to implementation.

> This article draws on real project experience. Some numbers are hypothetical, used to illustrate concepts.

## What Is RAG?

The core idea is simple: **retrieve first, then generate**. When a user asks a question, the system finds the most relevant document fragments from a knowledge base, injects them as context into the prompt, and lets the LLM generate an answer grounded in that data.

### Why Not Just Fine-tune?

| Dimension | RAG | Fine-tuning |
|-----------|-----|-------------|
| Knowledge updates | Instant (update documents) | Requires retraining |
| Cost | Low (vector index only) | High (GPU training time) |
| Traceability | Can cite source documents | Cannot trace answer origins |
| Use case | Knowledge-intensive Q&A | Style/format adjustment |
| Hallucination control | Better (documents as evidence) | Weaker (model may fabricate) |

In practice, the two are often combined: fine-tuning adjusts the model's tone, while RAG provides factual knowledge. But for most enterprise scenarios — FAQ bots, document Q&A, knowledge bases — RAG alone covers 80%+ of needs.

### Typical Use Cases

- **Enterprise knowledge bases**: Internal docs, SOPs, regulatory policies
- **Customer support bots**: Answers grounded in product documentation and FAQs
- **Code assistants**: Retrieving from codebases and documentation
- **Legal/medical consultation**: Domains requiring accurate source citations

## RAG Architecture Overview

A standard RAG system has three stages:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Indexing    │ →  │  Retrieval  │ →  │  Generation │
│  (offline)  │    │  (online)   │    │  (online)   │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Stage 1: Indexing (Offline)

1. **Load documents**: PDFs, Markdown, HTML, database records
2. **Chunk**: Split long documents into smaller fragments
3. **Embed**: Convert text into vectors using an embedding model
4. **Store**: Index vectors in a vector database for fast similarity search

### Stage 2: Retrieval (Online)

1. **User query** → converted to a vector
2. **Vector search**: Find the top-k most similar document chunks
3. **Reranking (optional)**: Use a Cross-Encoder for precision reranking

### Stage 3: Generation (Online)

1. **Assemble prompt**: System instructions + retrieved context + user question
2. **LLM generates answer**
3. **Post-processing**: Source citations, formatting, safety checks

## Data Preparation and Chunking Strategies

Chunking is the most underestimated — yet most impactful — part of RAG. Bad chunking undermines everything downstream.

### Chunking Strategies Compared

| Strategy | Approach | Pros | Cons |
|----------|----------|------|------|
| Fixed-length | Every 500 tokens | Simple, predictable | May break semantics |
| Semantic | By paragraph/section/heading | Preserves meaning | Uneven chunk sizes |
| Recursive | Heading → paragraph → sentence | Balances structure and size | More complex to implement |
| Sentence window | Sentence-level, expand context at retrieval | Precise retrieval + full context | Extra storage required |

### Implementation Example

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,        # max tokens per chunk
    chunk_overlap=50,      # overlap between adjacent chunks
    separators=["\n## ", "\n### ", "\n\n", "\n", " "],
)

chunks = splitter.split_documents(documents)
```

Key parameters:

- **chunk_size**: Too large (>1000 tokens) dilutes relevance; too small (<100 tokens) loses context. Start with 300–500 tokens.
- **chunk_overlap**: Typically 10–15% of chunk_size, preventing key information from being cut at boundaries.
- **separators**: Set priority by document structure — try heading splits first, then paragraphs, then hard cuts.

### Metadata Enrichment

Plain text chunks often aren't enough. Adding metadata significantly boosts retrieval quality:

- **Source info**: Document name, page number, section title
- **Timestamps**: Document creation or update time (for recency filtering)
- **Category tags**: Document type, department, product line
- **Summaries**: Use an LLM to generate a one-sentence summary per chunk; match against summaries during retrieval

## Vector Indexing and Embeddings

### Embedding Model Selection

| Model | Dimensions | Multilingual | Best For |
|-------|-----------|-------------|----------|
| OpenAI text-embedding-3-small | 1536 | Yes | General purpose, high quality |
| OpenAI text-embedding-3-large | 3072 | Yes | Maximum precision |
| Cohere embed-v3 | 1024 | Yes | Multilingual optimization |
| BGE-M3 (BAAI) | 1024 | Yes | Open source, self-hostable |
| GTE-large (Alibaba) | 1024 | Yes | Open source, CJK-optimized |

Selection considerations:

- **Language coverage**: If your knowledge base spans multiple languages, choose a multilingual model
- **Dimensions vs. cost**: Higher dimensions yield better precision but increase storage and search costs
- **Deployment**: Cloud APIs are simpler but add latency and cost; self-hosting offers privacy advantages

### Vector Database Comparison

| Database | Type | Highlights | Scale |
|----------|------|-----------|-------|
| Pinecone | Fully managed SaaS | Zero-ops, auto-scaling | Any scale |
| Weaviate | Open source / cloud | Hybrid search, GraphQL API | Medium–large |
| Qdrant | Open source / cloud | High performance, Rust-based | Medium–large |
| pgvector | PostgreSQL extension | Integrates with existing DB | Small–medium |
| ChromaDB | Open source | Lightweight, great for prototyping | Small / PoC |

**Practical advice**: If your team already runs PostgreSQL, start with pgvector — minimal overhead. For millions of documents without infrastructure management, choose Pinecone or Qdrant Cloud.

### Index Types

- **HNSW (Hierarchical Navigable Small World)**: Most common — fast queries, high accuracy, but memory-intensive
- **IVF (Inverted File Index)**: Cluster-then-search approach, better memory efficiency for very large datasets
- **Flat (brute force)**: 100% accurate but slow — only suitable for small datasets or as a baseline

## Retrieval Strategies

### Pure Vector Search vs. Hybrid Search

Pure vector search relies on semantic similarity, but has blind spots:

- **Poor exact matching**: A query for "ERR-4012 error code" might return semantically similar but wrong error codes
- **Rare vocabulary**: Product codes, model numbers, and specialized terms may not embed well

Hybrid search addresses this:

```python
# Example using Weaviate
results = client.query.hybrid(
    query="How to resolve ERR-4012 error",
    alpha=0.7,   # 0 = pure BM25, 1 = pure vector
    limit=20,
)
```

- **BM25**: Traditional keyword-based search, excels at exact matching
- **Vector search**: Semantic-based, excels at synonyms and fuzzy queries
- **alpha parameter**: Controls the weighting — start at 0.7 (vector-leaning) and tune from there

### Reranking

The first retrieval stage (BM25 + vector) is fast but coarse. A Cross-Encoder provides precise second-stage ranking:

```python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

# First: vector search for top-20
candidates = vector_search(query, top_k=20)

# Then: Cross-Encoder rerank to top-5
pairs = [(query, doc.text) for doc in candidates]
scores = reranker.predict(pairs)
top_results = sorted(zip(candidates, scores), key=lambda x: -x[1])[:5]
```

Two-stage retrieval delivers significant improvements:

| Strategy | Context Recall | Latency |
|----------|---------------|---------|
| Pure vector top-5 | ~72% | ~50ms |
| Hybrid search top-5 | ~78% | ~80ms |
| Hybrid top-20 → Rerank top-5 | ~87% | ~150ms |

The extra ~100ms latency buys a 15% recall improvement — well worth it in most scenarios.

## Prompt Engineering

### Context Injection Pattern

The most basic RAG prompt structure:

```
You are a professional support assistant. Answer the user's question based on the reference materials below.
If the reference materials do not contain relevant information, honestly say "I'm not sure" — do not make up an answer.

## Reference Materials
{context}

## User Question
{question}
```

### Advanced Techniques

**1. Source Citations**

Ask the model to annotate sources so users can verify:

```
Cite your sources in the answer using [Source 1], [Source 2] format.
Each reference material is labeled with its number at the beginning.
```

**2. Handling "No Answer Found"**

The most common hallucination scenario: retrieval results are irrelevant, but the model generates an answer anyway. Solutions:

- Explicitly instruct the prompt to say "I don't know" when data is insufficient
- Set a similarity threshold — exclude results below it from context
- Add a confidence score; trigger human review for low-confidence answers

**3. Multi-turn Conversations**

Conversation history affects retrieval: when a user asks "What about its price?" the "its" refers to a product from the previous turn. Solution:

```python
# Use an LLM to compress multi-turn history into a standalone query
standalone_query = llm.compress(
    chat_history=history,
    latest_question="What about its price?",
    # Output: "What is the price of the MacBook Pro M3?"
)
results = search(standalone_query)
```

## Evaluation Methods

Evaluating a RAG system isn't just about whether the answer is correct — you need to decompose it into multiple dimensions.

### The RAGAS Framework

[RAGAS](https://docs.ragas.io/) is the most widely adopted RAG evaluation framework, defining four core metrics:

| Metric | What It Measures | Target |
|--------|-----------------|--------|
| Context Recall | How much of the required information is in the retrieved results | >0.85 |
| Context Precision | How much of the retrieved content is actually relevant (vs. noise) | >0.80 |
| Faithfulness | Whether the answer stays faithful to retrieved data (no fabrication) | >0.90 |
| Answer Relevance | Whether the answer actually addresses the user's question | >0.85 |

### Evaluation Implementation

```python
from ragas import evaluate
from ragas.metrics import (
    context_recall,
    context_precision,
    faithfulness,
    answer_relevancy,
)

eval_dataset = [
    {
        "question": "What's the difference between RAG and fine-tuning?",
        "answer": model_answer,
        "contexts": retrieved_contexts,
        "ground_truth": "RAG retrieves external knowledge at inference time...",
    },
    # ... more test cases
]

results = evaluate(
    dataset=eval_dataset,
    metrics=[context_recall, context_precision, faithfulness, answer_relevancy],
)
```

### Human Evaluation Is Non-negotiable

Automated metrics have blind spots. Conduct regular human evaluations:

- **Sample 50–100 responses weekly**, scored by domain experts
- **Tiered scoring**: Fully correct / Partially correct / Incorrect / Harmful
- **Track failure patterns**: Which question types fail most? Is it a retrieval issue or a generation issue?

## Common Pitfalls

### 1. Chunks Too Large or Too Small

- **Too large (>1000 tokens)**: Too much irrelevant information dilutes the truly relevant content; the LLM gets distracted by noise
- **Too small (<100 tokens)**: Individual chunks lack context; the model can't understand the fragment's meaning
- **Fix**: Start at 300–500 tokens, use Context Precision as your tuning metric

### 2. Embedding–Query Language Mismatch

Your knowledge base is in Chinese, but users might query in English (or vice versa). If the embedding model's cross-lingual capability is weak, retrieval quality drops dramatically.

- **Fix**: Use multilingual embeddings (BGE-M3, Cohere embed-v3), or store both Chinese and English versions at indexing time

### 3. Context Window Overflow

Stuffing too much context actually degrades performance — the "Lost in the Middle" phenomenon. Research shows LLMs attend more to the beginning and end of context, while middle content gets ignored.

- **Fix**: Limit context to 3–5 chunks (~1500–2500 tokens); use a reranker to ensure the most relevant chunks appear first

### 4. Ignoring Data Quality

Garbage in, garbage out. Common issues:

- PDF parsing errors (tables, multi-column layouts)
- Duplicate documents flooding retrieval results with redundancy
- Outdated data that hasn't been cleaned or flagged

- **Fix**: Build a data cleaning pipeline with deduplication, format correction, and recency tagging

### 5. No Fallback Mechanism

When retrieval confidence is low, the system should:

- Clearly tell the user "No relevant information found"
- Offer alternatives ("Did you mean...?")
- Escalate to a human agent

Not force-generate a plausible-sounding but potentially wrong answer.

### 6. Only Evaluating End-to-End

If the answer is wrong, is it a retrieval problem or a generation problem? Without segmented evaluation, you can't locate the bottleneck.

- **Fix**: Track Retrieval metrics (Context Recall/Precision) and Generation metrics (Faithfulness/Relevance) separately to know which stage needs optimization

## Advanced Patterns

### Agentic RAG

Let the LLM decide whether to retrieve, what to retrieve, and whether to retrieve again:

```
User asks: "Compare Pinecone and Weaviate pricing"

Agent reasoning:
1. Search "Pinecone pricing 2025"
2. Search "Weaviate pricing 2025"
3. Synthesize both results into a comparison table
```

Ideal for complex questions requiring multi-step retrieval. Key frameworks: LangGraph, CrewAI.

### GraphRAG

Traditional RAG chunks documents into independent fragments, losing entity relationships. GraphRAG builds a knowledge graph during indexing, leveraging both vector similarity and graph relationships during retrieval.

Best for: regulatory documents (cross-references between clauses), organizational knowledge (people, departments, project relationships).

### Self-RAG

The model self-evaluates during generation:

1. Decide whether retrieval is needed
2. Assess whether retrieved results are relevant
3. Evaluate whether the generated answer is faithful to sources
4. If unsatisfied, re-retrieve or revise the answer

This "reflection" mechanism significantly reduces hallucination rates but increases inference latency and cost.

## Conclusion

RAG is not a "set it and forget it" system. It's an engineering practice that requires continuous iteration:

1. **Start simple**: Vector search + basic prompt — get it running first
2. **Optimize with metrics**: RAGAS automated evaluation + periodic human review
3. **Progressively add advanced features**: Hybrid search → Reranking → Agentic RAG
4. **Don't neglect data quality**: 80% of problems are in the data, not the model

Remember: **the best RAG system isn't the most technically complex — it's the one that best understands its own data characteristics**. Spending time understanding your document structure, user query patterns, and failure cases is far more effective than blindly stacking technologies.
