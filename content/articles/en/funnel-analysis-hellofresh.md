---
title: "Funnel Analysis in Practice: Breaking Down Conversions with HelloFresh"
date: 2026-03-19
tags: [Product Analytics, Funnel Analysis, HelloFresh, Growth]
category: Data Analysis
---

Funnel analysis is one of the most fundamental and practical methods in product analytics. It tracks user behavior through a sequence of ordered steps, quantifying conversion and drop-off at each stage. This article uses HelloFresh's subscription business model to walk through the full framework: defining funnels, calculating metrics, identifying bottlenecks, and developing optimization strategies.

> Note: All numbers in this article are hypothetical, used solely to illustrate the analytical approach.

## What Is Funnel Analysis?

Funnel analysis is a **sequential model** that tracks users from an initial touchpoint to a final goal (e.g., purchase, signup), measuring completion and drop-off rates at every step.

Core concepts:

- **Conversion Rate**: The percentage of users who complete the current step and move to the next
- **Drop-off Rate**: The percentage who leave at the current step without progressing
- **Overall Conversion Rate**: The end-to-end ratio from funnel top to bottom

How it differs from other methods:

| Method | Question It Answers |
|--------|-------------------|
| Funnel Analysis | Where do users drop off the most? |
| Cohort Analysis | How do different user batches behave? |
| Retention Analysis | Do users keep coming back? |

These three are often used together, but funnel analysis is your first tool for diagnosing conversion problems.

## HelloFresh: Business Context

HelloFresh is the world's largest meal-kit subscription service. The business model is straightforward: users choose a meal plan online, receive ingredients and recipes weekly, and cook at home.

This model is ideal for demonstrating funnel analysis because:

1. **Clear path**: There's a well-defined linear flow from browsing to subscribing
2. **Subscription mechanics**: You track not just first purchase but also retention and reorders
3. **Multiple friction points**: Plan selection, signup, menu customization, and checkout each present potential drop-off

Key business metrics:

- **CAC (Customer Acquisition Cost)**: Cost to acquire one new customer
- **Trial-to-Paid Conversion**: Rate at which trial users become paying subscribers
- **Churn Rate**: Monthly subscription cancellation rate

## Defining Funnel Steps

A typical HelloFresh new-user funnel:

| Step | Event Name | Description |
|------|-----------|-------------|
| Step 1 | `page_view_landing` | Visit landing or campaign page |
| Step 2 | `plan_browse` | Browse the plans page |
| Step 3 | `plan_select` | Select a specific plan |
| Step 4 | `signup_complete` | Complete registration or login |
| Step 5 | `menu_customize` | Customize the weekly menu |
| Step 6 | `checkout_complete` | Complete checkout and payment |
| Step 7 | `reorder` | Reorder in week two or later |

### Granularity Trade-offs

More steps isn't always better:

- **Too few** (e.g., just "visit → checkout"): You can't see where the problem is
- **Too many** (e.g., splitting every form field): Too much noise, hard to focus
- **Recommended**: 3–7 steps, each corresponding to a meaningful user decision point

## Calculating Conversion and Drop-off Rates

Assume we tracked one month of data:

| Step | Users | Step Conversion | Cumulative Conversion |
|------|-------|----------------|----------------------|
| Landing Page | 100,000 | — | 100% |
| Plan Browse | 60,000 | 60.0% | 60.0% |
| Plan Select | 25,000 | 41.7% | 25.0% |
| Signup | 15,000 | 60.0% | 15.0% |
| Menu Customize | 10,000 | 66.7% | 10.0% |
| Checkout | 7,000 | 70.0% | 7.0% |
| Reorder | 3,500 | 50.0% | 3.5% |

Formulas:

```
Step Conversion = Users at current step / Users at previous step
Cumulative Conversion = Users at current step / Users at step 1
Drop-off Rate = 1 - Step Conversion
```

Quick takeaway: **Plan Browse → Plan Select** (41.7%) and **Checkout → Reorder** (50.0%) are the two biggest bottlenecks.

## Finding Bottlenecks: Common Analytical Techniques

Looking at the overall funnel isn't enough — you need to slice by dimensions to diagnose root causes.

### 1. Step-by-Step Drop-off Analysis

Identify the step with the largest drop-off and prioritize it. In our example, "Plan Browse → Plan Select" loses 58.3% of users — that's where to investigate first.

### 2. Segmentation by Channel

| Channel | Landing → Checkout Conversion |
|---------|-------------------------------|
| Google Ads | 5.2% |
| Organic Search | 8.1% |
| Referral | 12.3% |
| Social Media | 3.8% |

Referral conversion is significantly higher than paid ads, suggesting the referral program may deliver better ROI.

### 3. Segmentation by Device

| Device | Menu Customize → Checkout Conversion |
|--------|-------------------------------------|
| Desktop | 78.5% |
| Mobile | 58.2% |

Mobile checkout conversion is notably lower — likely a UX issue in the mobile checkout flow.

### 4. Time-to-Convert Analysis

How long do users spend at each step before moving on?

- Plan Browse → Plan Select: median 4.2 minutes (long deliberation — plan comparison may be too complex)
- Menu Customize → Checkout: median 1.1 minutes (smooth, no obvious friction)

Extended dwell time usually signals user confusion or hesitation.

## Optimization Strategies

For each bottleneck, apply targeted optimizations:

### Browse → Select (41.7%, biggest bottleneck)

- **Simplify plan comparison**: Reduce the number of plans, highlight differences, add recommendation labels ("Most Popular")
- **A/B test the pricing page**: Test different layouts, default selections, and price anchoring
- **Add social proof**: Display subscriber counts, ratings, and user reviews

### Select → Signup (60.0%)

- **Reduce signup friction**: Support Google/Apple social login
- **Defer registration**: Let users finish menu selection before requiring signup (create sunk cost first)
- **Guest checkout**: Allow purchase without account creation

### Menu Customize → Checkout (70.0%)

- **Default menus**: Offer system-recommended default selections to reduce choice burden
- **Save preferences**: Remember dietary preferences (vegetarian, gluten-free) and auto-filter

### Checkout → Reorder (50.0%, retention key)

- **Onboarding emails**: Send cooking tips and recipe videos during the first week
- **Difficulty matching**: Recommend recipes matching the user's cooking experience
- **Flexible pause**: Allow skipping a week instead of outright cancellation
- **Exit retention**: Offer discounts or plan adjustments during the cancellation flow

### Prioritization: Impact × Effort

| Optimization | Expected Impact | Implementation Effort | Priority |
|-------------|----------------|----------------------|----------|
| Simplify plan comparison | High | Low | P0 |
| Social login | Medium | Low | P1 |
| Default menus | Medium | Medium | P1 |
| Onboarding emails | High | Medium | P0 |
| Flexible pause | High | High | P2 |

## Tools and Implementation

### Analytics Platforms

- **Mixpanel / Amplitude**: Built-in funnel analysis with drag-and-drop step configuration
- **Google Analytics 4**: Funnel exploration report (Exploration → Funnel)
- **Custom solution**: Event tables + SQL queries

### SQL Example

Given an events table `events(user_id, event_name, timestamp)`, use window functions to build the funnel:

```sql
WITH funnel AS (
  SELECT
    user_id,
    MAX(CASE WHEN event_name = 'page_view_landing' THEN 1 ELSE 0 END) AS step1,
    MAX(CASE WHEN event_name = 'plan_browse' THEN 1 ELSE 0 END) AS step2,
    MAX(CASE WHEN event_name = 'plan_select' THEN 1 ELSE 0 END) AS step3,
    MAX(CASE WHEN event_name = 'signup_complete' THEN 1 ELSE 0 END) AS step4,
    MAX(CASE WHEN event_name = 'checkout_complete' THEN 1 ELSE 0 END) AS step5
  FROM events
  WHERE timestamp BETWEEN '2026-02-01' AND '2026-02-28'
  GROUP BY user_id
)
SELECT
  COUNT(*) AS total_users,
  SUM(step1) AS landing,
  SUM(CASE WHEN step1 = 1 AND step2 = 1 THEN 1 ELSE 0 END) AS browse,
  SUM(CASE WHEN step1 = 1 AND step2 = 1 AND step3 = 1 THEN 1 ELSE 0 END) AS selected,
  SUM(CASE WHEN step1 = 1 AND step2 = 1 AND step3 = 1 AND step4 = 1 THEN 1 ELSE 0 END) AS signup,
  SUM(CASE WHEN step1 = 1 AND step2 = 1 AND step3 = 1 AND step4 = 1 AND step5 = 1 THEN 1 ELSE 0 END) AS checkout
FROM funnel;
```

This SQL ensures users must **complete steps in order** to be counted at each stage, preventing step-skipping from inflating numbers.

### Presenting to Stakeholders

- Use a **horizontal bar chart** for the funnel, annotating each step with conversion rates and absolute numbers
- Add a **trend line chart** tracking weekly funnel conversion changes
- Include a **segmentation comparison table** so product managers can instantly spot which channel or device needs attention

## Common Pitfalls

### 1. Vanity Metrics Only

Optimizing only the top of the funnel (e.g., landing page traffic) while ignoring downstream conversion won't drive revenue growth.

### 2. Unclear Attribution Windows

A user browses today but checks out next week — does that count as the same funnel? You need a well-defined **attribution window** (e.g., all steps completed within 7 days).

### 3. Survivorship Bias

Analyzing only users who entered the funnel ignores those who never entered at all. Perhaps the biggest problem isn't inside the funnel — it's that nobody knows your product exists.

### 4. Over-segmentation

Slicing data across too many dimensions (channel × device × region × new vs. returning) shrinks sample sizes and makes conclusions unreliable. Verify each segment has sufficient sample size before drawing conclusions.

### 5. Numbers Without Context

Funnel analysis tells you **where** the problem is, not **why**. Pair it with qualitative methods — user interviews, session recordings, surveys — to find the real root cause.

## Conclusion

Funnel analysis is a starting point for product analytics, not the destination. It helps you quickly pinpoint conversion bottlenecks, but real optimization requires combining segmentation, A/B testing, and qualitative research.

Using HelloFresh as our example, we can see that even a seemingly simple "browse → buy" flow contains multiple optimization opportunities when decomposed. The key is: define clear steps, track the right events, use data to find bottlenecks, then prioritize with Impact × Effort to decide what to tackle first.

Remember: **funnels evolve as your product evolves**. Periodically revisit your funnel definitions to ensure they reflect the current user journey, not assumptions from six months ago.
