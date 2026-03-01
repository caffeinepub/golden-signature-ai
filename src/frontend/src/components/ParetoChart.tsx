import { Target } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import type { GoldenSignature } from "../backend";
import { generateParetoFront } from "../hooks/useMockData";

interface ParetoChartProps {
  onSetSignature?: (sig: GoldenSignature) => void;
}

const categoryColors: Record<string, string> = {
  best_yield_low_energy: "#3b82f6",
  best_quality_low_carbon: "#10b981",
  max_performance_min_emission: "#a855f7",
};

const categoryLabels: Record<string, string> = {
  best_yield_low_energy: "Best Yield + Low Energy",
  best_quality_low_carbon: "Best Quality + Low Carbon",
  max_performance_min_emission: "Max Performance + Min Emission",
};

interface ParetoPoint {
  energy: number;
  yield: number;
  quality: number;
  performance: number;
  carbon: number;
  category: string;
  label: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ParetoPoint }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  return (
    <div
      className="rounded-xl p-3 text-xs"
      style={{
        background: "rgba(17, 24, 39, 0.98)",
        border: "1px solid rgba(59, 130, 246, 0.4)",
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="font-bold mb-2 text-sm"
        style={{ color: categoryColors[d.category] }}
      >
        {categoryLabels[d.category]}
      </div>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Energy:</span>
          <span className="font-mono text-blue-300">{d.energy} kWh</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Yield:</span>
          <span className="font-mono text-purple-300">{d.yield}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Quality:</span>
          <span className="font-mono text-amber-300">{d.quality}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Performance:</span>
          <span className="font-mono text-cyan-300">{d.performance}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Carbon:</span>
          <span className="font-mono text-emerald-300">{d.carbon} kg</span>
        </div>
      </div>
      <div className="mt-2 text-blue-400 text-xs font-semibold">
        Click to set as Golden Signature
      </div>
    </div>
  );
}

export default function ParetoChart({ onSetSignature }: ParetoChartProps) {
  const allData = generateParetoFront();
  const [clickedPoint, setClickedPoint] = useState<string | null>(null);

  const categories = [
    "best_yield_low_energy",
    "best_quality_low_carbon",
    "max_performance_min_emission",
  ];

  const handleClick = (data: {
    activePayload?: Array<{
      payload: {
        energy: number;
        yield: number;
        quality: number;
        performance: number;
        carbon: number;
        category: string;
      };
    }>;
  }) => {
    if (!data?.activePayload?.[0]) return;
    const point = data.activePayload[0].payload;

    if (onSetSignature) {
      const sig: GoldenSignature = {
        id: `sig-pareto-${Date.now()}`,
        name: `Pareto Point (${point.energy}kWh / ${point.yield}%)`,
        category: point.category,
        status: "Active",
        createdAt: BigInt(Date.now()),
        updatedAt: BigInt(Date.now()),
        parameters: {
          temperature: 250 + Math.random() * 80,
          holdTime: 30 + Math.random() * 60,
          coolingRate: 2 + Math.random() * 7,
          feedRate: 100 + Math.random() * 100,
          pressure: 10 + Math.random() * 15,
        },
        objectives: {
          energyKwh: point.energy,
          carbonKg: point.carbon,
          yieldPct: point.yield,
          qualityPct: point.quality,
          performancePct: point.performance,
        },
      };
      onSetSignature(sig);
      setClickedPoint(`${point.energy}-${point.yield}`);
      toast.success("Pareto point set as Golden Signature!");
    }
  };

  return (
    <motion.div
      className="glass-card-static p-5 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(59, 130, 246, 0.15)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
            }}
          >
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 text-sm">
              NSGA-II Pareto Front
            </h3>
            <p className="text-xs text-slate-500">
              Click any point to set as Golden Signature
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold text-emerald-400"
          style={{ background: "rgba(16,185,129,0.1)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          20 Pareto Points
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart style={{ cursor: "pointer" }} onClick={handleClick}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(59, 130, 246, 0.07)"
          />
          <XAxis
            dataKey="energy"
            name="Energy"
            unit=" kWh"
            tick={{
              fill: "#64748b",
              fontSize: 11,
              fontFamily: "JetBrains Mono",
            }}
            axisLine={{ stroke: "rgba(59, 130, 246, 0.2)" }}
            tickLine={false}
            label={{
              value: "Energy Consumption (kWh)",
              position: "insideBottom",
              offset: -5,
              fill: "#475569",
              fontSize: 11,
            }}
          />
          <YAxis
            dataKey="yield"
            name="Yield"
            unit="%"
            tick={{
              fill: "#64748b",
              fontSize: 11,
              fontFamily: "JetBrains Mono",
            }}
            axisLine={{ stroke: "rgba(59, 130, 246, 0.2)" }}
            tickLine={false}
            label={{
              value: "Yield (%)",
              angle: -90,
              position: "insideLeft",
              fill: "#475569",
              fontSize: 11,
            }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "rgba(59, 130, 246, 0.3)" }}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "16px" }}
            formatter={(value) => (
              <span style={{ color: "#94a3b8" }}>{value}</span>
            )}
          />
          {categories.map((cat) => (
            <Scatter
              key={cat}
              name={categoryLabels[cat]}
              data={allData.filter((d) => d.category === cat)}
              fill={categoryColors[cat]}
              opacity={0.85}
              shape={(props: {
                cx?: number;
                cy?: number;
                payload?: { energy: number; yield: number };
              }) => {
                const isClicked =
                  clickedPoint ===
                  `${props.payload?.energy}-${props.payload?.yield}`;
                return (
                  <circle
                    cx={props.cx ?? 0}
                    cy={props.cy ?? 0}
                    r={isClicked ? 9 : 6}
                    fill={categoryColors[cat]}
                    stroke={isClicked ? "#fff" : "none"}
                    strokeWidth={isClicked ? 2 : 0}
                    style={{
                      filter: isClicked
                        ? `drop-shadow(0 0 8px ${categoryColors[cat]})`
                        : `drop-shadow(0 0 3px ${categoryColors[cat]}80)`,
                      transition: "all 0.2s",
                    }}
                  />
                );
              }}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
