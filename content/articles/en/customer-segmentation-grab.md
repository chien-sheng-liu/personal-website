---
title: "Customer Segmentation in Practice: Building Precision User Strategies with Grab"
date: 2025-03-15
tags: [Customer Segmentation, K-Means, RFM, Python, Growth]
category: Data Science
---

Customer segmentation is one of the highest-ROI applications of data science in business. It replaces the "treat all users the same" approach with targeted strategies for distinct groups. This article uses Grab — Southeast Asia's leading super app — as a case study, walking through the strategic framework from business objectives to go-to-market execution.

> All data in this article is hypothetical, used solely to illustrate the methodology. Grab's actual business data is not publicly available.

## What Is Customer Segmentation?

Customer segmentation divides users into meaningful groups based on behavioral, demographic, or value-based similarities. Users within each group should be as similar as possible; groups should be as different as possible.

```
                    All Users (100%)
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   ┌─────────┐     ┌─────────┐     ┌─────────┐
   │  High    │     │ Growth  │     │ Dormant │
   │  Value   │     │  Users  │     │  Users  │
   │  15%     │     │  45%    │     │  40%    │
   └─────────┘     └─────────┘     └─────────┘
        │                │                │
    VIP program     Cross-sell        Win-back
   Dedicated care   Upgrade path     Low-cost reach
```

The core principle is simple: **not every user deserves equal investment**. Concentrate resources on the most valuable and highest-potential groups, and overall ROI improves naturally.

### Segmentation vs. Personalization

| Dimension | Segmentation | Personalization |
|-----------|-------------|-----------------|
| Granularity | Group-level (thousands to millions) | Individual |
| Complexity | Medium | High (requires recommendation systems) |
| Use cases | Marketing strategy, product planning, pricing | Recommendations, dynamic pricing, push notifications |
| Data requirements | Moderate | Large-scale real-time behavioral data |
| Time to value | Fast (1-2 weeks) | Slow (full ML pipeline needed) |

**Practical advice**: Do segmentation first, personalization second. Segmentation is the 80/20 rule in action — 20% of the complexity captures 80% of the business value.

### Business Value

- **Marketing efficiency**: Invest heavily in high-value users, use low-cost channels for low-activity users
- **Product decisions**: Different segments have different needs, changing feature priorities
- **Retention strategy**: Identify at-risk groups before they churn
- **Pricing strategy**: Different segments have different price sensitivities

## Why Grab?

Grab is Southeast Asia's largest super app, spanning ride-hailing (GrabCar), food delivery (GrabFood), digital payments (GrabPay), grocery delivery (GrabMart), and financial services (GrabFinance).

```
┌─────────────────────────────────────────────────────┐
│                  Grab Super App                      │
│                                                     │
│   🚗 GrabCar    🍔 GrabFood    💳 GrabPay          │
│   Ride-hailing   Food delivery   Digital payments   │
│                                                     │
│   🛒 GrabMart   🏦 GrabFinance                     │
│   Groceries      Lending/Insurance                  │
│                                                     │
│   ─────────────────────────────────────────────     │
│   A single user may use 3-5 business lines          │
│   → Rich behavioral combinations → Higher value     │
└─────────────────────────────────────────────────────┘
```

A single user might commute with GrabCar on Monday, order GrabFood for lunch, use GrabMart for groceries on the weekend, and pay for everything with GrabPay. This **cross-business behavioral richness** makes segmentation more challenging — and far more valuable.

## The Complete Segmentation Process

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Business │ → │   Data   │ → │  Method  │ → │ Interpret│ → │ Execute  │
│ Objective│   │  Prep    │   │ Selection│   │ Personas │   │ Strategy │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
     ▲                                                            │
     └──────────────── Iterate (monthly/quarterly) ──────────────┘
```

A common mistake is starting directly with method selection. But **segmentation starts with the business objective**. Are you optimizing marketing budget allocation? Improving retention? Finding cross-sell opportunities? Different goals lead to different feature choices and segmentation strategies.

## Step 1: Define the Business Objective

For Grab, common segmentation goals include:

| Goal | Key Question | Segmentation Focus |
|------|-------------|-------------------|
| Marketing budget optimization | Which users deserve more investment? | Value-centric (spend, frequency) |
| Retention improvement | Which users are about to churn? | Activity change-centric |
| Cross-selling | Can ride-only users be converted to food delivery? | Business line combination-centric |
| New user nurturing | What's the path from trial to loyalty? | Lifecycle-centric |

**This article's goal**: Identify cross-business behavioral combinations across Grab's lines to design cross-sell strategies.

## Step 2: Data Preparation and Feature Design

### Available Data Sources

```
┌──────────────────────────────────────────────────────────┐
│                    Grab Data Landscape                    │
├──────────────┬──────────────┬──────────────┬────────────┤
│  Ride Data   │  Food Data   │  Payment Data│  User Attr │
├──────────────┼──────────────┼──────────────┼────────────┤
│ Order count  │ Order count  │ Txn count    │ Tenure     │
│ Total spend  │ Total spend  │ Txn volume   │ City       │
│ Last order   │ Last order   │ Online/offline│ Device    │
│ Common routes│ Cuisine pref │ Top-up freq  │ Referral   │
│ Avg distance │ Avg AOV      │ Card linked  │ Tier       │
└──────────────┴──────────────┴──────────────┴────────────┘
```

### Feature Design Principles

Raw data can't be used directly. Good feature engineering determines segmentation quality.

**Principle 1: Business-meaningful features**

Avoid features like "standard deviation of GrabFood orders over 6 months." Good features should be immediately understandable:

- ✅ Total orders (engagement)
- ✅ Total spend (value)
- ✅ Days since last activity (churn risk)
- ✅ Ride share vs. food share (business line preference)
- ✅ Average order value (spending level)
- ✅ GrabPay usage rate (ecosystem stickiness)

**Principle 2: Consistent time windows**

All features should be based on the same time window (e.g., past 6 months).

**Principle 3: Handle outliers**

Extreme users (corporate accounts, test accounts, API users) can severely skew clustering results. Winsorize or remove before clustering.

## Step 3: Choose the Segmentation Method

### Methodology Comparison

| Method | Principle | Pros | Cons | Best For |
|--------|-----------|------|------|----------|
| **RFM** | Score on Recency, Frequency, Monetary | Simple, no modeling needed | Transaction-only, fixed dimensions | Quick wins, e-commerce |
| **K-Means** | Minimize within-cluster distance | Fast, scalable | Requires predefined K, outlier-sensitive | General purpose, large datasets |
| **DBSCAN** | Density-based clustering | Auto-determines K, finds outliers | Parameter-sensitive | Anomaly detection |
| **Hierarchical** | Agglomerative/divisive tree | Dendrogram visualization | Computationally expensive | Small datasets, exploration |
| **LTV-based** | Segment by customer lifetime value | Directly maps to business value | Requires LTV model | Subscription businesses |

### Recommended Strategy: RFM First, Then K-Means

```
┌─────────────────────────────────────────────────────────────┐
│               Segmentation Strategy Path                    │
│                                                             │
│   Week 1: RFM Quick Segmentation                           │
│   ├── 3 dimensions: Recency × Frequency × Monetary         │
│   ├── Each dimension split into 5 quantiles                 │
│   ├── Output: Champions / Loyal / At Risk / Hibernating     │
│   └── Purpose: Build intuition, give teams something        │
│                                                             │
│   Week 2: K-Means Multi-dimensional Clustering              │
│   ├── 8+ dimensions: add business line prefs, payments      │
│   ├── Elbow Method + Silhouette Score to choose K           │
│   ├── Output: 5-7 refined clusters                          │
│   └── Purpose: Discover hidden patterns RFM can't see       │
│                                                             │
│   Week 3: Translate to Personas + Design Strategies         │
│   ├── Name each cluster, build user portraits               │
│   ├── Assign action plans per persona                       │
│   └── Purpose: Enable business teams to execute             │
└─────────────────────────────────────────────────────────────┘
```

## Step 3a: RFM Quick Segmentation

RFM is the classic framework with three dimensions:

- **R (Recency)**: How recently did the customer transact? More recent is better.
- **F (Frequency)**: How often? Higher is better.
- **M (Monetary)**: How much? Higher is better.

### RFM Applied to Grab

```
              High Frequency (F)
                ▲
                │
   At Risk      │    Champions
   Inactive but │    Recent, frequent, high-spending
   formerly     │    → VIP program
   frequent     │
   ─────────────┼──────────────→ Recent Activity (R)
                │
   Hibernating  │    New Customers
   Dormant      │    Recent but low frequency
   users        │    → Onboarding nurture
                │
```

Score users 1-5 on each dimension, then assign labels based on the combination:

| Segment | R Score | F Score | M Score | Action |
|---------|---------|---------|---------|--------|
| Champions | 4-5 | 4-5 | 4-5 | Reward loyalty, VIP treatment |
| Loyal Customers | 3-5 | 3-5 | 3-5 | Upgrade experience, cross-sell |
| New Customers | 4-5 | 1-2 | — | Drive second purchase |
| At Risk | 1-2 | 3-5 | 3-5 | Win-back campaigns, churn surveys |
| Hibernating | 1-2 | 1-2 | 1-2 | Low-cost reach or sunset |

### RFM Limitations

RFM is effective but limited:

1. **Transaction-only**: Ignores business line preferences, payment behavior
2. **Arbitrary boundaries**: Threshold choices directly affect results
3. **Cannot discover hidden patterns**: Confined to the R/F/M space

This is why we need K-Means.

## Step 3b: K-Means Multi-dimensional Clustering

K-Means finds natural cluster boundaries across arbitrary dimensions.

### Core Concept

```
  Step 1                Step 2                Step 3
  Random K centroids    Assign each user      Recompute centroids
                        to nearest centroid
  ·    ·  ★             ·····  ★              ·····  ★
     ·  ·                ····                  ····
  ·   ·                ·····                 ·····
           ·  ★              ·····  ★              ·····  ★
        ·  ·                  ····                  ····
     ·    ·                ·····                 ·····

                    Repeat Steps 2-3 until convergence
```

The algorithm automatically groups similar users together without manual threshold setting.

### Key Decision: Choosing K

**K too small** (e.g., 2-3): Groups too coarse, can't distinguish meaningful differences
**K too large** (e.g., 15+): Groups too fragmented, business teams can't design strategies for each

The practical sweet spot is usually **K = 4-7**.

Two diagnostic tools:

| Method | Principle | How to Read |
|--------|-----------|-------------|
| **Elbow Method** | Plot inertia for different K values | Find the "elbow" bend point |
| **Silhouette Score** | Measures within-cluster tightness vs. between-cluster separation | Higher is better (0-1) |

### K-Means Applied to Grab

Input 8 feature dimensions:

```
┌─────────────────────────────────────────────┐
│            K-Means Input Features            │
├─────────────────────┬───────────────────────┤
│ Engagement Features │ Preference Features   │
│ • Total orders      │ • Ride share          │
│ • Total spend       │ • Food share          │
│ • Days since active │ • GrabPay usage rate  │
│ • Avg order value   │ • Account age         │
└─────────────────────┴───────────────────────┘
                      │
                 ┌────┴────┐
                 │ K-Means │
                 │  K = 5  │
                 └────┬────┘
                      │
        ┌─────┬───────┼───────┬─────┐
        ▼     ▼       ▼       ▼     ▼
     Cluster Cluster Cluster Cluster Cluster
       1       2       3       4       5
```

**Important**: K-Means is scale-sensitive. Spend might range 0-5000 while ride share ranges 0-1. Always **standardize** features first so each dimension contributes equally to the distance calculation.

## Step 4: Cross-Business Segmentation — Grab's Unique Advantage

This is the unique value of a super app. Single-business companies can only see one behavioral dimension, but Grab can analyze ride, food, and payment behaviors simultaneously.

### Business Line Activity Matrix

```
                         Food Activity
                    Low       Medium      High
              ┌─────────┬─────────┬─────────┐
         High │ Commuter│ Balanced│  Super  │
Ride          │         │  User   │  User   │
Activity Med  │  Light  │ Moderate│  Food   │
              │  Rider  │  User   │ leaning │
         Low  │  Light  │  Food   │  Food   │
              │  User   │ curious │  Lover  │
              └─────────┴─────────┴─────────┘
```

Layer GrabPay usage on top for even more precise user identification.

## Step 5: Persona Development and Go-to-Market

Translating numbers into business language is the **make-or-break step** for adoption.

### Grab's Seven Personas

```
┌─────────────────────────────────────────────────────────────┐
│  Persona          │ Behavioral Profile        │ Est. Share │
├───────────────────┼───────────────────────────┼────────────┤
│ 🌟 Super User     │ High rides + food + pay    │     ~8%   │
│ 🚗 Commuter       │ High rides, low food       │    ~15%   │
│ 🍔 Food Lover     │ High food, low rides       │    ~20%   │
│ 💳 Pay Power User │ High payments, few orders  │    ~12%   │
│ ⚖️ Balanced User  │ Moderate across all lines  │    ~18%   │
│ 💡 Light User     │ Low across all lines       │    ~15%   │
│ 📊 Moderate User  │ Medium, no strong pref     │    ~12%   │
└───────────────────┴───────────────────────────┴────────────┘
```

### Strategy Blueprint Per Persona

#### Super User (~8% of users, ~30% of revenue)

```
┌─ Goal: Retain + Increase ARPU ────────────────────────────┐
│                                                           │
│  Strategy:                                                │
│  • VIP program (dedicated support, priority dispatch)     │
│  • Cross-business subscription ($29.9/mo rides + food)    │
│  • Surprise & delight (birthday perks, milestone rewards) │
│                                                           │
│  Risk: Losing even one is extremely costly                │
│  KPIs: Monthly retention > 95%, ARPU quarterly growth > 5%│
└───────────────────────────────────────────────────────────┘
```

#### Commuter (~15%)

```
┌─ Goal: Cross-sell food delivery ──────────────────────────┐
│                                                           │
│  Insight: Daily ride commuter, rarely orders food.        │
│           May not realize how convenient GrabFood is.     │
│                                                           │
│  Strategy:                                                │
│  • "Order dinner on your way home" contextual push        │
│  • Lunchtime GrabFood 50% off first order                 │
│  • Post-ride prompt: "Grab dinner too?"                   │
│                                                           │
│  KPIs: Food delivery activation rate, 30-day retention    │
└───────────────────────────────────────────────────────────┘
```

#### Food Lover (~20%)

```
┌─ Goal: Cross-sell rides + boost GrabPay ──────────────────┐
│                                                           │
│  Insight: High-frequency food user, almost never rides.   │
│           Likely remote/hybrid worker.                     │
│                                                           │
│  Strategy:                                                │
│  • Weekend ride discounts ("Get out this weekend? $3 off")│
│  • Extra GrabPay cashback on food orders                  │
│  • GrabMart cross-recommendation ("Restock while at it?") │
│                                                           │
│  KPIs: Ride activation rate, GrabPay binding rate         │
└───────────────────────────────────────────────────────────┘
```

#### Pay Power User (~12%)

```
┌─ Goal: Convert to transactional user ─────────────────────┐
│                                                           │
│  Insight: Uses GrabPay at convenience stores and          │
│           restaurants, but rarely orders rides or food.    │
│           High financial stickiness.                      │
│                                                           │
│  Strategy:                                                │
│  • GrabPay-exclusive ride/food discounts ("Pay & save 15%")│
│  • Spending milestones unlock ride credits                │
│  • GrabFinance product recommendations                    │
│                                                           │
│  KPIs: Order activation rate, GrabPay volume growth       │
└───────────────────────────────────────────────────────────┘
```

#### Light User (~15%)

```
┌─ Goal: Activation ────────────────────────────────────────┐
│                                                           │
│  Insight: Occasional use or recent sign-up.               │
│           Hasn't formed a usage habit yet.                 │
│                                                           │
│  Strategy:                                                │
│  • Onboarding quests ("Complete 3 rides, unlock $5 off")  │
│  • Time-limited new user offers (3 free deliveries in 7d) │
│  • Referral rewards ($5 each for inviter and invitee)     │
│                                                           │
│  Caution: Control subsidy costs — avoid pure deal-seekers │
│  KPIs: 3rd order completion rate within 30 days           │
└───────────────────────────────────────────────────────────┘
```

#### Balanced User (~18%)

```
┌─ Goal: Stabilize retention + upgrade to Super User ───────┐
│                                                           │
│  Insight: Moderate across all lines. Highest upgrade      │
│           potential to Super User.                        │
│                                                           │
│  Strategy:                                                │
│  • Loyalty points across all business lines               │
│  • Multi-line milestone rewards ("Use 3 lines this month")│
│  • Personalized recommendations by usage pattern          │
│                                                           │
│  KPIs: Cross-line usage frequency, Super User upgrade rate│
└───────────────────────────────────────────────────────────┘
```

## Step 6: Measurement and Iteration

### Segment Migration Matrix

Segmentation doesn't end when the model runs. The most critical measurement tool is the **segment migration matrix** — tracking how users move between segments over time.

```
                         Current Quarter
                 Super  Balanced  Light  At Risk
Prev    Super    [85%]    10%      2%      3%
Qtr     Balanced   8%   [72%]    12%      8%
        Light      2%     15%   [65%]    18%
        At Risk    1%      5%     20%   [74%]

Diagonal = stayed in same segment
Off-diagonal = migrated to another segment
```

**How to read this:**

- **Super → Super 85%**: Strong super user retention
- **Light → Balanced 15%**: Activation campaigns converting 15%
- **Balanced → At Risk 8%**: 8% of balanced users starting to churn — investigate
- **At Risk → Light 20%**: 20% of at-risk users deteriorating further

This table directly tells you which strategies work and which segments need more attention.

### A/B Testing Framework

Every persona's strategy should be validated through A/B testing:

```
┌──────────────────────────────────────────────────┐
│             A/B Test Design                      │
│                                                  │
│  Target: Commuter segment (~15% of users)        │
│  Hypothesis: "Evening GrabFood push" increases   │
│              food delivery activation             │
│                                                  │
│  Control (A): No push notification               │
│  Treatment (B): 5-7 PM GrabFood offer push       │
│                                                  │
│  Metrics:                                        │
│  • Primary: Food activation rate (7-day)         │
│  • Secondary: 30-day food retention              │
│  • Guardrail: Ride frequency doesn't drop,       │
│               unsubscribe rate doesn't increase   │
│                                                  │
│  Sample: 2,000 per group, 2-week runtime         │
└──────────────────────────────────────────────────┘
```

## Common Pitfalls

### 1. Feature Selection Bias

Using only spend amount mixes "low-frequency high-AOV" with "high-frequency low-AOV" users.

→ **Fix**: Include frequency, recency, behavioral type, and other multi-dimensional features.

### 2. Too Many Clusters

K=15 looks precise, but the marketing team can't design 15 different strategies.

→ **Fix**: K=4-7 is usually the sweet spot. The goal is **actionability**, not minimizing mathematical error.

### 3. Ignoring the Time Dimension

A heavy user from 6 months ago may have already churned. Static segmentation still labels them "high value."

→ **Fix**: Include Recency as a key feature; re-run segmentation periodically (monthly or quarterly).

### 4. Non-Actionable Results

"Cluster 3 has an avg_order_value of $23.7" — the marketing team can't do anything with this.

→ **Fix**: Every segment must have an **understandable label** and a **clear action plan**. The data scientist's job doesn't end when the model runs — it ends when results are translated into business language.

### 5. Running It Once and Forgetting

User behavior changes over time. Last quarter's Super User might be this quarter's Light User.

→ **Fix**: Build a segmentation pipeline that re-runs periodically, tracking segment migration.

### 6. Ignoring Cluster Size Balance

If one cluster has 60% of users and another has 2%, the segmentation lacks discriminatory power.

→ **Fix**: Check cluster sizes. If one is too large, consider further sub-segmentation.

## Conclusion: Segmentation Is an Operating System, Not a Report

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Week 1   RFM quick segmentation → Build intuition         │
│      ↓                                                      │
│   Week 2   K-Means multi-dimensional → Discover patterns    │
│      ↓                                                      │
│   Week 3   Translate to Personas → Design strategies        │
│      ↓                                                      │
│   Week 4+  A/B test → Measure impact → Iterate             │
│      ↓                                                      │
│   Monthly/Quarterly  Re-segment → Track migration           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**The most important takeaway**: Segmentation's goal is not minimizing inertia or maximizing Silhouette Score. It's enabling business teams to **understand, act, and measure**. A K=5 segmentation where every group has a clear strategy will always beat a K=20 segmentation that nobody knows how to use.

Great customer segmentation is not a report — it's a **continuously running decision engine** that tells your team who to target, what to do, and what results to expect.
