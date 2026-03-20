import { FaChartLine, FaChartBar, FaDice, FaBrain, FaMedkit, FaShoppingCart, FaRobot, FaPython, FaDatabase, FaCloud, FaCode, FaStar } from "react-icons/fa";

/* ── Shared project structure — only text differs per locale ── */

const projectBase = [
  // {
  //   icon: <FaChartLine size={28} />,
  //   categoryIcon: <FaDatabase size={16} />,
  //   category: { zh: "LLM", en: "LLM" },
  //   technologies: ["LLM", "GCP", "Agent", "Text-to-SQL", "Next.js", "FastAPI", "Neo4j"],
  //   link: "#",
  //   color: "from-blue-500 to-cyan-500",
  //   bgGradient: "from-blue-500/10 to-cyan-500/10",
  //   title: {
  //     zh: "公部門的大型語言模型建置 - 運用 GraphRAG",
  //     en: "Public Sector LLM Chatbots – GraphRAG",
  //   },
  //   description: {
  //     zh: "使用 OpenAI、Gemma、Gemini 等語言模型為公部門建置聊天機器人，並且採行雲地混合架構，同時也採用AI代理，為相關單位減少行政作業",
  //     en: "Built chatbots using OpenAI, Gemma, and Gemini with hybrid cloud/on‑prem architecture and agent workflows to reduce administrative workload for government agencies.",
  //   },
  //   detailDescription: {
  //     zh: "本專案為多個公部門單位建置 7 套以上的智慧聊天機器人系統。採用 GraphRAG 架構，將知識庫以知識圖譜形式儲存於 Neo4j，結合 Text-to-SQL 讓使用者以自然語言查詢結構化資料。系統部署於 GCP 與地端的混合架構，並透過 AI Agent 自動化行政流程，大幅提升公務效率。",
  //     en: "This project delivered 7+ intelligent chatbot systems for multiple government agencies. Using a GraphRAG architecture, knowledge bases are stored as knowledge graphs in Neo4j, combined with Text-to-SQL to enable natural language queries over structured data. The system is deployed on a hybrid GCP/on-prem architecture, with AI Agents automating administrative workflows to significantly improve operational efficiency.",
  //   },
  //   highlights: {
  //     zh: ["建置 7+ 套聊天機器人，涵蓋法規查詢、案件追蹤、內部知識庫", "GraphRAG + Neo4j 知識圖譜實現跨文件關聯推理", "Text-to-SQL 讓非技術人員直接用自然語言查詢資料庫", "GCP + 地端混合部署，符合政府資安規範", "AI Agent 自動化公文分類、摘要與派案流程"],
  //     en: ["Built 7+ chatbot systems covering regulation lookup, case tracking, and internal knowledge bases", "GraphRAG + Neo4j knowledge graph for cross-document reasoning", "Text-to-SQL enabling non-technical users to query databases in natural language", "Hybrid GCP/on-prem deployment meeting government security standards", "AI Agent automating document classification, summarization, and routing"],
  //   },
  //   metrics: {
  //     zh: [{ label: "機器人數", value: "7+" }, { label: "處理數據", value: "5T+" }, { label: "工作提升", value: "40%" }],
  //     en: [{ label: "Bots", value: "7+" }, { label: "Data processed", value: "5T+" }, { label: "Work efficiency", value: "40%" }],
  //   },
  // },
  {
    icon: <FaBrain size={28} />,
    categoryIcon: <FaCode size={16} />,
    category: { zh: "LLM", en: "LLM" },
    technologies: ["FastAPI", "Playwright", "React", "OpenAI", "Claude", "Docker", "Python"],
    link: "https://github.com/chien-sheng-liu/Finance-Decision-ChatBot",
    color: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    title: {
      zh: "股票財務多代理財務分析系統",
      en: "Stock Multi-Agent Financial Analyzer",
    },
    description: {
      zh: "結合 LLM Gateway 與 Playwright 瀏覽器自動化的財務分析平台。多 Agent 協作（新聞 / 財務 / 交易 / 數據），搭配 Safety Guard 安全層與完整 Artifact 追溯。",
      en: "Financial analysis platform combining an LLM Gateway with Playwright browser automation. Multi-agent collaboration (news / finance / trader / data) with Safety Guard and full artifact traceability.",
    },
    detailDescription: {
      zh: "VICI 是一套生產級的 LLM Gateway + 多代理財務分析系統。Gateway 層採用 Provider 抽象設計（策略模式），支援 OpenAI / Claude / Mock 一鍵切換，內建 Safety Guard 五層安全架構（輸入驗證→Prompt 掃描→Provider 白名單→輸出脫敏→審計日誌）。四個專業 Agent（News / Finance / Trader / YFinance）各司其職，透過 Playwright 無頭瀏覽器自動抓取股票行情與新聞，再由 LLM 生成帶情緒分析的投資報告與簡報。每次運行產出完整 Artifact（report.md / slides.pdf / run.json / trace.zip / SHA256 校驗），支援 Deterministic Dry-run 離線測試。",
      en: "VICI is a production-grade LLM Gateway + multi-agent financial analysis system. The Gateway layer uses a Provider abstraction (strategy pattern) supporting one-click switching between OpenAI / Claude / Mock, with a built-in 5-layer Safety Guard (input validation → prompt scan → provider allowlist → output redaction → audit log). Four specialized agents (News / Finance / Trader / YFinance) collaborate via Playwright headless browser to scrape stock data and news, then LLM generates investment reports with sentiment analysis. Each run produces full artifacts (report.md / slides.pdf / run.json / trace.zip / SHA256 checksums), with deterministic dry-run for offline testing.",
    },
    highlights: {
      zh: [
        "LLM Gateway 抽象層：OpenAI / Claude / Mock 可插拔切換，重試機制 + 請求追蹤 + 結構化日誌",
        "Safety Guard 五層安全：輸入驗證 → Prompt 掃描 → Provider 白名單 → 輸出脫敏 → 審計日誌",
        "四專業 Agent 協作：News（情緒分析）/ Finance（基本面）/ Trader（技術指標）/ YFinance（數據提取）",
        "Playwright 瀏覽器自動化：截圖追蹤 + Trace 錄製可重放 + Yahoo TW 股票數據抓取",
        "完整 Artifact 追溯：report.md / slides.pdf / run.json / trace.zip / SHA256 校驗",
      ],
      en: [
        "LLM Gateway abstraction: pluggable OpenAI / Claude / Mock switching with retry, request tracking, and structured logging",
        "5-layer Safety Guard: input validation → prompt scan → provider allowlist → output redaction → audit log",
        "4 specialized agents: News (sentiment) / Finance (fundamentals) / Trader (technical indicators) / YFinance (data extraction)",
        "Playwright browser automation: screenshot tracing + replayable trace recording + Yahoo TW stock scraping",
        "Full artifact traceability: report.md / slides.pdf / run.json / trace.zip / SHA256 checksums",
      ],
    },
    metrics: {
      zh: [{ label: "Agent 數", value: "4" }, { label: "安全層級", value: "5 層" }, { label: "LLM 提供商", value: "3+" }],
      en: [{ label: "Agents", value: "4" }, { label: "Safety Layers", value: "5" }, { label: "LLM Providers", value: "3+" }],
    },
  },
  // {
  //   icon: <FaMedkit size={28} />,
  //   categoryIcon: <FaBrain size={16} />,
  //   category: { zh: "深度學習", en: "Deep Learning" },
  //   technologies: ["PyTorch", "ResNet", "CNN", "Medical AI"],
  //   link: "#",
  //   color: "from-green-500 to-emerald-500",
  //   bgGradient: "from-green-500/10 to-emerald-500/10",
  //   title: {
  //     zh: "東部AI智慧決策分析平台",
  //     en: "Medical Imaging – Early Anomaly Detection",
  //   },
  //   description: {
  //     zh: "基於 PyTorch 和 ResNet，訓練一個卷積神經網路 (CNN) 來辨識 X 光片中的早期病徵。模型在公開數據集上的 AUC 分數達到 0.95，展現了高精度的輔助診斷潛力。",
  //     en: "CNN (PyTorch/ResNet) for chest X‑ray anomaly detection achieving AUC 0.95 on public datasets; demonstrates strong assistive diagnostic potential.",
  //   },
  //   detailDescription: {
  //     zh: "本專案針對醫療影像領域，使用 PyTorch 框架與 ResNet 預訓練模型，建立一套自動化的胸部 X 光片異常檢測系統。透過遷移學習與資料增強技術，在有限的標註資料下仍達到 AUC 0.95 的優異表現。系統採用雲地混合部署架構，可同時服務於醫院內部與遠端診斷場景，為醫師提供即時的輔助診斷建議。",
  //     en: "This project targets medical imaging, using PyTorch and ResNet pre-trained models to build an automated chest X-ray anomaly detection system. Through transfer learning and data augmentation, it achieves AUC 0.95 even with limited labeled data. The system uses a hybrid cloud/on-prem architecture, serving both in-hospital and remote diagnostic scenarios, providing real-time assistive diagnostic suggestions to physicians.",
  //   },
  //   highlights: {
  //     zh: ["AUC 達 0.95，準確率 94%，具臨床輔助價值", "遷移學習 + 資料增強克服標註資料不足問題", "雲地混合部署，支援院內與遠端診斷", "自動生成熱力圖標示異常區域，提升醫師判讀效率", "符合醫療資料隱私規範的安全架構"],
  //     en: ["AUC 0.95, 94% accuracy with clinical assistive value", "Transfer learning + data augmentation overcoming limited labeled data", "Hybrid cloud/on-prem deployment for in-hospital and remote diagnosis", "Auto-generated heatmaps highlighting anomaly regions for faster physician review", "Secure architecture compliant with medical data privacy regulations"],
  //   },
  //   metrics: {
  //     zh: [{ label: "AUC 分數", value: "0.95" }, { label: "準確率", value: "94%" }, { label: "部署方式", value: "雲地混合" }],
  //     en: [{ label: "AUC", value: "0.95" }, { label: "Accuracy", value: "94%" }, { label: "Deployment", value: "Hybrid" }],
  //   },
  // },
  {
    icon: <FaShoppingCart size={28} />,
    categoryIcon: <FaCloud size={16} />,
    category: { zh: "深度學習", en: "Deep Learning" },
    technologies: ["Deep Learning", "Streaming", "SQL"],
    link: "#",
    color: "from-orange-500 to-red-500",
    bgGradient: "from-orange-500/10 to-red-500/10",
    title: {
      zh: "海運 - 高風險與船舶航行異常預測",
      en: "Maritime – High‑Risk & Anomaly Prediction",
    },
    description: {
      zh: "蒐集我國氣象、船舶靜態資料、船舶即時AIS資料，並建立 Clickhouse 即時流式資料庫，並以深度學習模型進行不間斷預測船舶擱淺以及異常行為，以防止我國周遭發生船難",
      en: "Integrated national weather, vessel static data, and real‑time AIS streams into ClickHouse and deep learning to predict grounding and anomalous behaviors and help prevent maritime incidents.",
    },
    detailDescription: {
      zh: "本專案整合 15+ 種資料來源，包含氣象局即時氣象資料、船舶靜態資料庫、以及全台灣周遭海域的 AIS（船舶自動識別系統）即時串流資料。所有資料匯入 ClickHouse 即時流式資料庫，經過特徵工程後餵入深度學習模型，對船舶擱淺風險與異常航行行為進行 7×24 小時不間斷預測，協助海巡單位提前預警並防止船難發生。",
      en: "This project integrates 15+ data sources including real-time weather data, vessel static databases, and AIS (Automatic Identification System) streaming data from surrounding waters. All data flows into ClickHouse for real-time processing, goes through feature engineering, and feeds into deep learning models for 24/7 continuous prediction of vessel grounding risks and anomalous navigation behaviors, helping coast guard units issue early warnings and prevent maritime incidents.",
    },
    highlights: {
      zh: ["整合 15+ 種異質資料來源（氣象、AIS、船舶靜態資料）", "ClickHouse 即時流式資料庫處理 20TB+ 數據", "深度學習模型 7×24 不間斷預測擱淺與異常行為", "地端部署符合國安等級資料處理規範", "為海巡單位建立預警系統，提前 30 分鐘發出警報"],
      en: ["Integrated 15+ heterogeneous data sources (weather, AIS, vessel static data)", "ClickHouse real-time streaming database processing 20TB+ data", "Deep learning model for 24/7 continuous grounding and anomaly prediction", "On-prem deployment meeting national security data processing standards", "Early warning system for coast guard, alerting 30 minutes in advance"],
    },
    metrics: {
      zh: [{ label: "資料來源", value: "15+" }, { label: "處理數據", value: "20TB+" }, { label: "部署方式", value: "地端部署" }],
      en: [{ label: "Sources", value: "15+" }, { label: "Data processed", value: "20TB+" }, { label: "Deployment", value: "On‑prem" }],
    },
    extraTech: {
      zh: "非結構化與結構化資料",
      en: "Structured & Unstructured Data",
    },
  },
  {
    icon: <FaChartBar size={28} />,
    categoryIcon: <FaBrain size={16} />,
    category: { zh: "深度學習", en: "Deep Learning" },
    technologies: ["Python", "SARIMA", "Prophet", "Holt-Winters", "pandas", "statsmodels"],
    link: "https://github.com/chien-sheng-liu/disrupted-timeseries-forecasting",
    color: "from-teal-500 to-cyan-500",
    bgGradient: "from-teal-500/10 to-cyan-500/10",
    title: {
      zh: "疫情干擾下的時間序列預測",
      en: "Disrupted Time-Series Forecasting under COVID-19",
    },
    description: {
      zh: "比較 SARIMA、Holt-Winters、Prophet 三種模型在 COVID-19 干擾下的預測表現，設計排除疫情 / 包含疫情 / 後疫情三組實驗，量化外部衝擊對時間序列預測的影響。",
      en: "Compared SARIMA, Holt-Winters, and Prophet under COVID-19 disruptions. Designed three experimental groups (excluding / including / post-COVID data) to quantify the impact of external shocks on time-series forecasting.",
    },
    detailDescription: {
      zh: "本專案探討 COVID-19 疫情如何影響時間序列預測模型的準確度。透過嚴謹的實驗設計，將數據分為「排除疫情」「包含疫情」「後疫情」三組，分別以 SARIMA（含自動參數優化）、Holt-Winters（三重指數平滑）、Prophet（自動處理假日與異常值）進行建模與預測，最終比較各模型在不同情境下的 MAE、RMSE、MAPE 等指標表現，並提出面對外部干擾時的最佳預測策略。",
      en: "This project investigates how COVID-19 disruptions affect time-series forecasting accuracy. Through rigorous experimental design, data was split into three groups: excluding COVID, including COVID, and post-COVID. SARIMA (with auto-parameter optimization), Holt-Winters (triple exponential smoothing), and Prophet (automatic holiday and outlier handling) were applied to each group, comparing MAE, RMSE, and MAPE across scenarios and proposing optimal forecasting strategies for external disruptions.",
    },
    highlights: {
      zh: [
        "三模型比較框架：SARIMA（季節性）、Holt-Winters（趨勢平滑）、Prophet（異常值抵抗）",
        "實驗設計：排除疫情 / 包含疫情 / 後疫情三組對照實驗",
        "Auto SARIMA 自動參數優化，減少人工調參成本",
        "Prophet 添加疫情作為外部迴歸變數，提升預測穩健性",
        "可應用於零售需求預測、供應鏈管理、市場規劃等場景",
      ],
      en: [
        "Three-model comparison: SARIMA (seasonality), Holt-Winters (trend smoothing), Prophet (outlier resistance)",
        "Experimental design: excluding / including / post-COVID control groups",
        "Auto SARIMA for automated parameter optimization reducing manual tuning",
        "Prophet with COVID as external regressor for improved robustness",
        "Applicable to retail demand forecasting, supply chain management, and market planning",
      ],
    },
    metrics: {
      zh: [{ label: "預測模型", value: "3" }, { label: "實驗組數", value: "3" }, { label: "機構", value: "Uni Mannheim" }],
      en: [{ label: "Models", value: "3" }, { label: "Experiments", value: "3" }, { label: "Institution", value: "Uni Mannheim" }],
    },
  },
  {
    icon: <FaDice size={28} />,
    categoryIcon: <FaCode size={16} />,
    category: { zh: "演算法", en: "Algorithm" },
    technologies: ["Python", "FastAPI", "React", "Monte Carlo", "NumPy", "Vite"],
    link: "https://github.com/chien-sheng-liu/Slot-Game-Simulator",
    color: "from-amber-500 to-rose-500",
    bgGradient: "from-amber-500/10 to-rose-500/10",
    title: {
      zh: "老虎機遊戲引擎與機率優化系統",
      en: "Slot Game Engine & Probability Optimizer",
    },
    description: {
      zh: "3×3 老虎機遊戲引擎，結合 Monte Carlo 模擬與啟發式搜索算法自動優化轉軸配置，在目標 RTP 95% 與勝率 ≥ 55% 的約束下找出最佳符號分布。全棧實現含 FastAPI 後端與 React 前端。",
      en: "3×3 slot game engine combining Monte Carlo simulation with heuristic search to auto-optimize reel configurations under RTP 95% and win rate ≥ 55% constraints. Full-stack implementation with FastAPI backend and React frontend.",
    },
    detailDescription: {
      zh: "是一套老虎機遊戲引擎與機率優化系統。核心挑戰在於如何設計轉軸配置使遊戲同時滿足 RTP（返還率）與勝率雙目標。系統以啟發式搜索算法迭代 800 步，每步透過 Monte Carlo 模擬 50,000 局來評估配置的適應度，最終以 100,000 局精確驗證最佳候選。5 種符號（不同賠率）搭配 5 種獲勝模式（水平、垂直、對角、V 型、自定義），透過符號分布變異與適應性搜索策略，在巨大的搜索空間中高效收斂至目標配置。全棧實現支援 CLI 與 API 雙模式，React 前端可即時體驗遊戲與查看統計數據。",
      en: "This is a slot game engine and probability optimization system. The core challenge is designing reel configurations that simultaneously meet RTP (Return to Player) and win rate targets. The system uses heuristic search iterating 800 steps, evaluating each configuration via 50,000-spin Monte Carlo simulation, with final 100,000-spin verification. Five symbols (varying multipliers) combined with five winning patterns (horizontal, vertical, diagonal, V-shape, custom), using symbol distribution mutation and adaptive search to efficiently converge in a massive search space. Full-stack implementation supports both CLI and API modes, with a React frontend for real-time gameplay and statistics.",
    },
    highlights: {
      zh: [
        "啟發式搜索算法：800 步迭代優化，平衡探索與利用，自動收斂至目標 RTP/勝率",
        "Monte Carlo 模擬引擎：每次評估 50,000 局、精確驗證 100,000 局，確保統計信賴度",
        "多目標優化：同時滿足 RTP ≥ 0.95 與 Win Rate ≥ 0.55 的約束條件",
        "5 種獲勝模式 × 5 種符號賠率，支援 RNG seed 確保結果可重現",
        "全棧實現：FastAPI + React + Vite，CLI / API 雙模式，Makefile 自動化部署",
      ],
      en: [
        "Heuristic search: 800-step iterative optimization balancing exploration and exploitation",
        "Monte Carlo engine: 50,000-spin evaluation + 100,000-spin precise verification for statistical confidence",
        "Multi-objective optimization: meeting both RTP ≥ 0.95 and Win Rate ≥ 0.55 constraints",
        "5 winning patterns × 5 symbol multipliers with RNG seed for reproducible results",
        "Full-stack: FastAPI + React + Vite, CLI/API dual mode, Makefile automation",
      ],
    },
    metrics: {
      zh: [{ label: "目標 RTP", value: "95%" }, { label: "模擬次數", value: "100K" }, { label: "獲勝模式", value: "5 種" }],
      en: [{ label: "Target RTP", value: "95%" }, { label: "Simulations", value: "100K" }, { label: "Win Patterns", value: "5" }],
    },
  },
  {
    icon: <FaRobot size={28} />,
    categoryIcon: <FaCloud size={16} />,
    category: { zh: "LLM", en: "LLM" },
    technologies: ["FastAPI", "Next.js", "PostgreSQL", "pgvector", "Redis", "Docker", "OpenAI", "Gemini"],
    link: "https://github.com/chien-sheng-liu/AutoLLM",
    color: "from-violet-500 to-indigo-500",
    bgGradient: "from-violet-500/10 to-indigo-500/10",
    title: {
      zh: "AutoLLM — No-Code RAG 聊天機器人平台",
      en: "AutoLLM — No-Code RAG Chatbot Platform",
    },
    description: {
      zh: "生產級 RAG 平台，支援文檔上傳、向量檢索、多 LLM 切換（OpenAI / Gemini / Claude），搭配 Redis + PostgreSQL 雙層存儲與 Docker 微服務部署。",
      en: "Production-grade RAG platform with document upload, vector retrieval, multi-LLM switching (OpenAI / Gemini / Claude), dual-layer Redis + PostgreSQL storage, and Docker microservice deployment.",
    },
    detailDescription: {
      zh: "AutoLLM 是一套 No-Code 的 RAG 聊天機器人平台。使用者上傳文件後，系統自動完成解析、分塊、Embedding 生成與向量儲存（pgvector），再透過餘弦相似度檢索相關文檔塊，構建上下文送入 LLM 生成帶引用的答案。架構採用 FastAPI + Next.js 全棧，Redis 做短期對話緩存（3 天 TTL）、PostgreSQL 做永久審計，Provider 抽象層可一鍵切換 OpenAI / Gemini / Claude。全服務以 Docker Compose 編排，支援流式回答（SSE）、JWT 認證、速率限制與自動版本管理。",
      en: "AutoLLM is a No-Code RAG chatbot platform. Users upload documents, and the system automatically parses, chunks, generates embeddings, and stores vectors (pgvector). Cosine similarity retrieval finds relevant chunks to build context for LLM-generated answers with citations. Built with FastAPI + Next.js full-stack, Redis for short-term conversation cache (3-day TTL), PostgreSQL for permanent audit storage, and a provider abstraction layer for one-click switching between OpenAI / Gemini / Claude. All services orchestrated via Docker Compose, supporting streaming responses (SSE), JWT auth, rate limiting, and automatic versioning.",
    },
    highlights: {
      zh: [
        "完整 RAG 流程：上傳 → 分塊 → Embedding → 向量檢索 → LLM 生成帶引用答案",
        "Provider 抽象層（策略模式），一鍵切換 OpenAI / Gemini / Claude",
        "Redis 短期緩存 + PostgreSQL 永久審計的雙層對話存儲架構",
        "pgvector 餘弦距離檢索，可配置 chunk_size / overlap / top_k",
        "Docker Compose 微服務部署，SSE 流式回答 + JWT 認證 + 速率限制",
      ],
      en: [
        "End-to-end RAG pipeline: upload → chunking → embedding → vector retrieval → LLM answers with citations",
        "Provider abstraction layer (strategy pattern) for one-click OpenAI / Gemini / Claude switching",
        "Dual-layer storage: Redis short-term cache + PostgreSQL permanent audit trail",
        "pgvector cosine retrieval with configurable chunk_size / overlap / top_k",
        "Docker Compose microservices with SSE streaming, JWT auth, and rate limiting",
      ],
    },
    metrics: {
      zh: [{ label: "LLM 提供商", value: "3+" }, { label: "API 端點", value: "15+" }, { label: "部署方式", value: "Docker" }],
      en: [{ label: "LLM Providers", value: "3+" }, { label: "API Endpoints", value: "15+" }, { label: "Deploy", value: "Docker" }],
    },
  },
];

const statsBase = [
  { value: "12+", icon: <FaCode />, label: { zh: "完成專案", en: "Projects" } },
  { value: "15+", icon: <FaPython />, label: { zh: "技術棧", en: "Tech Stack" } },
  { value: "5+", icon: <FaCloud />, label: { zh: "部署平台", en: "Platforms" } },
  { value: "200+", icon: <FaStar />, label: { zh: "GitHub Stars", en: "GitHub Stars" } },
];

/** Resolve locale-specific fields and return flat project/stats arrays */
export function getProjectData(locale = "zh") {
  const projects = projectBase.map((p) => ({
    title: p.title[locale] || p.title.zh,
    description: p.description[locale] || p.description.zh,
    detailDescription: p.detailDescription?.[locale] || p.detailDescription?.zh || null,
    highlights: p.highlights?.[locale] || p.highlights?.zh || null,
    icon: p.icon,
    categoryIcon: p.categoryIcon,
    category: p.category[locale] || p.category.zh,
    technologies: [...p.technologies, ...(p.extraTech?.[locale] ? [p.extraTech[locale]] : [])],
    metrics: p.metrics[locale] || p.metrics.zh,
    link: p.link,
    color: p.color,
    bgGradient: p.bgGradient,
  }));

  const stats = statsBase.map((s) => ({
    value: s.value,
    icon: s.icon,
    label: s.label[locale] || s.label.zh,
  }));

  return { projects, stats };
}
