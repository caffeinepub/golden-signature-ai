import { Activity, AlertTriangle, Brain, Zap } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  generateEnergyTimeSeries,
  generateShapValues,
} from "../hooks/useMockData";

const energyData = generateEnergyTimeSeries();
const shapData = generateShapValues();

const equipmentData = [
  { name: "Machine A", health: 87, color: "#10b981", fill: "#10b981" },
  { name: "Machine B", health: 62, color: "#f59e0b", fill: "#f59e0b" },
  { name: "Machine C", health: 94, color: "#10b981", fill: "#10b981" },
];

const anomalies = energyData.filter((d) => d.isAnomaly);

interface EnergyTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { isAnomaly?: boolean } }>;
  label?: string;
}

function EnergyTooltip({ active, payload, label }: EnergyTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;

  return (
    <div
      className="rounded-xl p-3 text-xs"
      style={{
        background: "rgba(17, 24, 39, 0.98)",
        border: `1px solid ${d?.isAnomaly ? "#ef4444" : "rgba(59, 130, 246, 0.4)"}`,
        boxShadow: d?.isAnomaly
          ? "0 0 20px rgba(239, 68, 68, 0.3)"
          : "0 0 20px rgba(59, 130, 246, 0.2)",
      }}
    >
      <div className="text-slate-400 mb-1">{label}</div>
      <div className="font-bold font-mono text-blue-300 text-sm">
        {payload[0]?.value} kWh
      </div>
      {d?.isAnomaly && (
        <div className="mt-1.5 flex items-center gap-1.5 text-red-400 font-semibold">
          <AlertTriangle className="w-3 h-3" />
          ANOMALY DETECTED
        </div>
      )}
    </div>
  );
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: { isAnomaly?: boolean };
}

// Custom dot renderer
function CustomDot(props: CustomDotProps) {
  const { cx, cy, payload } = props;
  if (!payload?.isAnomaly) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill="#3b82f6"
        stroke="rgba(59, 130, 246, 0.4)"
        strokeWidth={1}
      />
    );
  }
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill="rgba(239, 68, 68, 0.2)"
        stroke="#ef4444"
        strokeWidth={1}
      />
      <circle cx={cx} cy={cy} r={4} fill="#ef4444" />
    </g>
  );
}

function HealthGauge({
  name,
  health,
  color,
}: {
  name: string;
  health: number;
  color: string;
}) {
  const data = [{ name, value: health, fill: color }];
  const statusLabel =
    health >= 80 ? "Optimal" : health >= 60 ? "Warning" : "Critical";

  return (
    <div className="flex flex-col items-center glass-card-static p-4 rounded-xl">
      <RadialBarChart
        width={140}
        height={140}
        cx={70}
        cy={70}
        innerRadius={45}
        outerRadius={60}
        startAngle={180}
        endAngle={0}
        data={data}
      >
        <RadialBar
          dataKey="value"
          cornerRadius={10}
          background={{ fill: "rgba(255,255,255,0.05)" }}
        />
      </RadialBarChart>
      <div className="font-bold text-2xl font-mono -mt-10" style={{ color }}>
        {health}%
      </div>
      <div className="text-sm font-semibold text-slate-300 mt-1">{name}</div>
      <div
        className="text-xs px-2 py-0.5 rounded-full mt-1"
        style={{ color, background: `${color}22` }}
      >
        {statusLabel}
      </div>
    </div>
  );
}

export default function EnergyAnalyticsPage() {
  const anomalyTimes = anomalies.map((a) => a.time);

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
            Energy Pattern Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            30-hour consumption monitoring with anomaly detection
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            color: "#ef4444",
          }}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          {anomalies.length} Anomalies Detected
        </div>
      </div>

      {/* Energy Time Series */}
      <motion.div
        className="glass-card-static p-5 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-slate-200">
            Energy Consumption (kWh/hr)
          </h3>
          <span
            className="ml-auto text-xs px-2 py-0.5 rounded-full font-mono"
            style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa" }}
          >
            30hr window
          </span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={energyData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(59, 130, 246, 0.07)"
            />
            <XAxis
              dataKey="time"
              tick={{
                fill: "#64748b",
                fontSize: 10,
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
              domain={[600, 1400]}
            />
            <Tooltip content={<EnergyTooltip />} />
            {anomalyTimes.map((t) => (
              <ReferenceLine
                key={t}
                x={t}
                stroke="rgba(239, 68, 68, 0.3)"
                strokeDasharray="4 4"
              />
            ))}
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{
                r: 6,
                fill: "#60a5fa",
                stroke: "#3b82f6",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Equipment Health + Anomaly Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Health */}
        <motion.div
          className="glass-card-static p-5 rounded-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-slate-200">
              Equipment Health Scores
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {equipmentData.map((equip) => (
              <HealthGauge
                key={equip.name}
                name={equip.name}
                health={equip.health}
                color={equip.color}
              />
            ))}
          </div>
        </motion.div>

        {/* Anomaly Summary */}
        <motion.div
          className="glass-card-static p-5 rounded-xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="font-semibold text-slate-200">Detected Anomalies</h3>
          </div>
          <div className="space-y-3">
            {anomalies.map((anomaly, i) => {
              const severity = anomaly.energy > 1200 ? "Critical" : "Warning";
              return (
                <motion.div
                  key={`${anomaly.time}-${i}`}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{
                    background: "rgba(239, 68, 68, 0.07)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                  }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background:
                        severity === "Critical" ? "#ef4444" : "#f59e0b",
                      boxShadow: `0 0 6px ${severity === "Critical" ? "#ef4444" : "#f59e0b"}`,
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-200">
                      Hour {anomaly.time} — {anomaly.energy} kWh
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {anomaly.anomalyMsg}
                    </div>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      color: severity === "Critical" ? "#ef4444" : "#f59e0b",
                      background:
                        severity === "Critical"
                          ? "rgba(239, 68, 68, 0.15)"
                          : "rgba(245, 158, 11, 0.15)",
                    }}
                  >
                    {severity}
                  </span>
                </motion.div>
              );
            })}
            <div
              className="p-3 rounded-lg text-xs text-slate-400"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <span className="text-emerald-400 font-semibold">
                27 normal readings
              </span>{" "}
              in the last 30 hours · Isolation Forest threshold: 1150 kWh
            </div>
          </div>
        </motion.div>
      </div>

      {/* SHAP Feature Importance */}
      <motion.div
        className="glass-card-static p-5 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-slate-200">
            Top 5 Influential Parameters (SHAP Values)
          </h3>
          <span className="ml-auto text-xs text-slate-500">
            Impact on energy prediction
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={shapData.map((d) => ({
                ...d,
                absImpact: Math.abs(d.impact),
              }))}
              layout="vertical"
            >
              <CartesianGrid
                horizontal={false}
                stroke="rgba(59, 130, 246, 0.07)"
              />
              <XAxis
                type="number"
                tick={{
                  fill: "#64748b",
                  fontSize: 10,
                  fontFamily: "JetBrains Mono",
                }}
                axisLine={{ stroke: "rgba(59, 130, 246, 0.2)" }}
                tickLine={false}
                tickFormatter={(v) => v.toFixed(2)}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={85}
              />
              <Tooltip
                formatter={(
                  _value: number,
                  _name: string,
                  props: { payload?: { impact: number } },
                ) => {
                  const impact = props.payload?.impact ?? 0;
                  return [`${impact > 0 ? "+" : ""}${impact}`, "SHAP Impact"];
                }}
                contentStyle={{
                  background: "rgba(17, 24, 39, 0.98)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#94a3b8" }}
                itemStyle={{ color: "#f1f5f9" }}
              />
              <Bar dataKey="absImpact" radius={[0, 4, 4, 0]}>
                {shapData.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={entry.color}
                    opacity={0.85}
                    style={{ filter: `drop-shadow(0 0 3px ${entry.color}60)` }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="space-y-2">
            {shapData.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <div className="w-24 text-xs font-medium text-slate-300 flex-shrink-0">
                  {d.name}
                </div>
                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: d.color,
                      filter: `drop-shadow(0 0 3px ${d.color})`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.abs(d.impact) * 200}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                  />
                </div>
                <span
                  className="text-xs font-mono font-bold w-12 text-right"
                  style={{ color: d.color }}
                >
                  {d.impact > 0 ? "+" : ""}
                  {d.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
