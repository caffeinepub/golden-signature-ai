import {
  AlertTriangle,
  Calculator,
  CheckCircle,
  Leaf,
  Target,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  RadialBar,
  RadialBarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCountUp } from "../hooks/useCountUp";
import { generateCarbonTrend } from "../hooks/useMockData";

const carbonTrend = generateCarbonTrend();

const regulations = [
  {
    id: "eu",
    label: "EU ETS Compliance",
    status: "PASS",
    icon: CheckCircle,
    color: "#10b981",
    detail: "847 kg / 1000 kg limit",
  },
  {
    id: "iso",
    label: "ISO 14001 Standard",
    status: "PASS",
    icon: CheckCircle,
    color: "#10b981",
    detail: "Emissions trending down 5.8%",
  },
  {
    id: "internal",
    label: "Internal Target",
    status: "WARNING",
    icon: AlertTriangle,
    color: "#f59e0b",
    detail: "847 kg vs 900 kg target",
  },
];

const gaugeData = [
  { name: "Regulation Limit", value: 100, fill: "#ef444422" },
  { name: "Target", value: 90, fill: "#3b82f633" },
  { name: "Actual", value: 84.7, fill: "#10b981" },
];

interface CarbonTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CarbonTooltip({ active, payload, label }: CarbonTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-xl p-3 text-xs"
      style={{
        background: "rgba(17, 24, 39, 0.98)",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        boxShadow: "0 0 20px rgba(16, 185, 129, 0.15)",
      }}
    >
      <div className="text-slate-400 mb-2 font-semibold">{label}</div>
      {payload.map((p: { name: string; value: number; color: string }) => (
        <div key={p.name} className="flex justify-between gap-3 mb-1">
          <span style={{ color: p.color }}>{p.name}:</span>
          <span className="font-mono font-bold text-slate-200">
            {p.value} kg
          </span>
        </div>
      ))}
    </div>
  );
}

function CarbonGauge() {
  const animatedValue = useCountUp(847, 1500);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <RadialBarChart
          width={260}
          height={260}
          cx={130}
          cy={130}
          innerRadius={55}
          outerRadius={120}
          startAngle={180}
          endAngle={0}
          data={gaugeData}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={8}
            background={{ fill: "rgba(255,255,255,0.03)" }}
          />
        </RadialBarChart>
        {/* Center text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ top: "30px" }}
        >
          <div className="text-3xl font-bold font-mono text-emerald-400">
            {animatedValue}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">kg CO₂e</div>
          <div
            className="mt-2 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#10b981",
            }}
          >
            <CheckCircle className="w-3 h-3" />
            COMPLIANT
          </div>
        </div>
      </div>

      <div className="flex gap-6 mt-2 text-xs">
        {[
          { label: "Actual", color: "#10b981", value: "847 kg" },
          { label: "Target", color: "#3b82f6", value: "900 kg" },
          { label: "Regulation", color: "#ef4444", value: "1000 kg" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: item.color,
                boxShadow: `0 0 4px ${item.color}`,
              }}
            />
            <span className="text-slate-400">{item.label}:</span>
            <span className="font-mono font-bold text-slate-200">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SavingsCalculator() {
  const [baseline, setBaseline] = useState(1200);
  const [optFactor, setOptFactor] = useState(15);
  const [intensity, setIntensity] = useState(0.42);

  const carbonSavingPerBatch = ((baseline * optFactor) / 100) * intensity;
  const annualProjection = carbonSavingPerBatch * 365;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div>
          <label
            htmlFor="carbon-baseline"
            className="text-xs text-slate-400 block mb-1.5"
          >
            Baseline Consumption (kWh)
          </label>
          <input
            id="carbon-baseline"
            type="number"
            value={baseline}
            onChange={(e) => setBaseline(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="carbon-opt-factor"
            className="text-xs text-slate-400 block mb-1.5"
          >
            Optimization Factor (%)
          </label>
          <input
            id="carbon-opt-factor"
            type="number"
            value={optFactor}
            onChange={(e) => setOptFactor(Number(e.target.value))}
            min={1}
            max={100}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="carbon-intensity"
            className="text-xs text-slate-400 block mb-1.5"
          >
            Carbon Intensity (kg/kWh)
          </label>
          <input
            id="carbon-intensity"
            type="number"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            step={0.01}
            min={0}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          className="rounded-xl p-4 text-center"
          style={{
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
          }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.3 }}
          key={`${baseline}-${optFactor}-${intensity}`}
        >
          <div className="text-xs text-slate-500 mb-1">
            Carbon Saving / Batch
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {carbonSavingPerBatch.toFixed(1)}
          </div>
          <div className="text-xs text-slate-500">kg CO₂e</div>
        </motion.div>
        <motion.div
          className="rounded-xl p-4 text-center"
          style={{
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
          }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.3 }}
          key={`annual-${baseline}-${optFactor}-${intensity}`}
        >
          <div className="text-xs text-slate-500 mb-1">Annual Projection</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {annualProjection.toFixed(0)}
          </div>
          <div className="text-xs text-slate-500">kg CO₂e / year</div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CarbonIntelligencePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Carbon Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Adaptive carbon target management & regulatory compliance
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2"
          style={{
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            color: "#10b981",
          }}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Fully Compliant
        </div>
      </div>

      {/* Carbon Gauge + Regulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="glass-card-static p-6 rounded-xl flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4 self-start">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-slate-200">
              Carbon Target Status
            </h3>
          </div>
          <CarbonGauge />
        </motion.div>

        {/* Regulation Compliance */}
        <motion.div
          className="glass-card-static p-5 rounded-xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-slate-200">
              Regulation Compliance
            </h3>
          </div>
          <div className="space-y-3">
            {regulations.map((reg) => {
              const Icon = reg.icon;
              return (
                <motion.div
                  key={reg.id}
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{
                    background: `${reg.color}08`,
                    border: `1px solid ${reg.color}25`,
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Icon
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: reg.color }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-200">
                      {reg.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {reg.detail}
                    </div>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      color: reg.color,
                      background: `${reg.color}20`,
                      border: `1px solid ${reg.color}40`,
                    }}
                  >
                    {reg.status}
                  </span>
                </motion.div>
              );
            })}
            <div
              className="p-3 rounded-lg text-xs"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="text-slate-400 mb-1">
                <span className="text-blue-400 font-semibold">
                  Adaptive Carbon Formula:{" "}
                </span>
                Carbon_Target = f(Regulation × 0.85, Historic Best, Current
                Load, Energy Intensity)
              </div>
              <div className="flex gap-4">
                <span className="text-slate-500">
                  Regulation Limit:{" "}
                  <span className="text-slate-300 font-mono">1000 kg</span>
                </span>
                <span className="text-slate-500">
                  Historic Best:{" "}
                  <span className="text-slate-300 font-mono">723 kg</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Emission Trend */}
      <motion.div
        className="glass-card-static p-5 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-slate-200">
            30-Day Emission Trend
          </h3>
          <span className="ml-auto text-xs text-slate-500">
            Target: 900 kg · Regulation: 1000 kg
          </span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={carbonTrend}>
            <defs>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(59, 130, 246, 0.07)"
            />
            <XAxis
              dataKey="date"
              tick={{
                fill: "#64748b",
                fontSize: 9,
                fontFamily: "JetBrains Mono",
              }}
              axisLine={{ stroke: "rgba(59, 130, 246, 0.2)" }}
              tickLine={false}
              interval={4}
            />
            <YAxis
              tick={{
                fill: "#64748b",
                fontSize: 10,
                fontFamily: "JetBrains Mono",
              }}
              axisLine={{ stroke: "rgba(59, 130, 246, 0.2)" }}
              tickLine={false}
              domain={[600, 1100]}
            />
            <Tooltip content={<CarbonTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
              formatter={(value) => (
                <span style={{ color: "#94a3b8" }}>{value}</span>
              )}
            />
            <ReferenceLine
              y={1000}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />
            <Area
              type="monotone"
              dataKey="regulation"
              name="Regulation Limit"
              stroke="#ef4444"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="none"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="target"
              name="Carbon Target"
              stroke="#3b82f6"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              fill="url(#targetGrad)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="actual"
              name="Actual Emissions"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#actualGrad)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#10b981",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Carbon Savings Calculator */}
      <motion.div
        className="glass-card-static p-5 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-slate-200">
            Carbon Savings Calculator
          </h3>
          <span className="ml-auto text-xs text-slate-500">
            Real-time estimation
          </span>
        </div>
        <SavingsCalculator />
      </motion.div>

      {/* Regulation Compliance Table */}
      <motion.div
        className="glass-card-static p-5 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-slate-200">
            Compliance Status Details
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Current Load",
              value: "847 kg",
              limit: "1000 kg",
              pct: 84.7,
              color: "#10b981",
              status: "OK",
            },
            {
              label: "30-Day Avg",
              value: "831 kg",
              limit: "900 kg",
              pct: 92.3,
              color: "#f59e0b",
              status: "CAUTION",
            },
            {
              label: "Monthly Peak",
              value: "923 kg",
              limit: "1000 kg",
              pct: 92.3,
              color: "#10b981",
              status: "OK",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="text-xs text-slate-500 mb-1">{item.label}</div>
              <div
                className="text-xl font-bold font-mono"
                style={{ color: item.color }}
              >
                {item.value}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                of {item.limit} limit
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-xs">
                <span className="text-slate-600">{item.pct}%</span>
                <span className="font-semibold" style={{ color: item.color }}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
