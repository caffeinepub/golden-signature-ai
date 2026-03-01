# AI-Driven Manufacturing Intelligence – Golden Signature Optimization Engine

## Current State

New project. No existing code.

## Requested Changes (Diff)

### Add

**Backend (Motoko on ICP)**
- `GoldenSignature` data type: id, name, parameters (key-value map), objectives (yield, quality, performance, energy, carbon), status (Active/Improved/Outdated), createdAt, updatedAt
- `BatchRecord` data type: id, timestamp, material, batchSize, machineSettings, processParameters, metrics (yield, quality, performance, energy, carbon), deviationScore, riskScore
- `Recommendation` data type: id, batchId, message, confidence, status (Pending/Accepted/Rejected/Modified), createdAt
- `OptimizationResult` data type: paretoFront (array of parameter sets with objective scores), timestamp
- Stable storage for all entities with auto-incrementing IDs
- CRUD for GoldenSignatures: createSignature, getSignatures, updateSignature, deleteSignature
- Batch analysis: analyzeBatch(input) -> returns deviation score, risk score, corrections, maintenance alert probability, carbon target
- Optimization: runOptimization() -> returns Pareto front (simulated NSGA-II results from stored data)
- Energy patterns: getEnergyPattern() -> time series with anomaly flags
- Carbon metrics: getCarbonMetrics() -> current target, regulation limit, historic best, trend data
- Recommendations: getRecommendations(), acceptRecommendation(id), rejectRecommendation(id)
- Business metrics: getBusinessMetrics() -> energy saved, carbon reduced, cost saved, efficiency gain
- SHAP explainability: getShapValues(batchId) -> top 5 parameters with impact scores
- Seed data: 3 golden signatures, 30 historical batch records, 5 recommendations

**Frontend**
- 4-page SPA with sidebar navigation: Dashboard, Energy Analytics, Carbon Intelligence, Batch Simulator
- Dashboard: KPI cards (Energy, Carbon, Yield, Quality, Performance), Pareto graph, Golden Signature panel, AI Recommendation panel, Business Metrics panel
- Energy Analytics: time series chart, anomaly highlights, equipment health gauge
- Carbon Intelligence: dynamic carbon gauge, compliance status, emission trend, savings calculator
- Batch Simulator: input form (material, batch size, machine settings, process params), results panel with comparison vs golden signature
- Global hover effects: cards scale 1.05 + glow border on hover, buttons gradient shift + glow + upward movement
- Framer Motion: page fade-in, card stagger, tab switching, shimmer loading, number counter
- Dark industrial theme: #0f172a bg, #3b82f6 accent, #10b981 success, #ef4444 alert
- Glassmorphism cards with blur background overlays
- Recharts for all data visualizations
- AI typing effect in recommendation panel
- Digital twin mode toggle, AI confidence scores, what-if scenario, ROI calculator, PDF export

### Modify

Nothing (new project).

### Remove

Nothing (new project).

## Implementation Plan

1. Write spec.md (this file) + rename project
2. Generate Motoko backend with all data types, CRUD, simulation logic, and seed data
3. Build frontend:
   a. Layout shell with dark sidebar navigation and routing
   b. Dashboard page: KPI cards, Pareto scatter chart, Golden Signature panel, AI Recommendation panel, Business Metrics
   c. Energy Analytics page: time series + anomaly chart, health gauge
   d. Carbon Intelligence page: gauge, compliance, trend, savings calculator
   e. Batch Simulator page: form + results comparison
   f. Global animation system (Framer Motion page transitions, card stagger, counter animation)
   g. Global hover effect CSS classes
4. Deploy
