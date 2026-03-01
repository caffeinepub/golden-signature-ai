import { DollarSign, Leaf, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useCountUp } from "../hooks/useCountUp";

interface MetricItem {
  label: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  color: string;
  prefix?: string;
  isDecimal?: boolean;
}

const metrics: MetricItem[] = [
  {
    label: "Energy Saved",
    value: 12450,
    unit: "kWh",
    icon: Zap,
    color: "#3b82f6",
  },
  {
    label: "Carbon Reduced",
    value: 2340,
    unit: "kg CO₂e",
    icon: Leaf,
    color: "#10b981",
  },
  {
    label: "Cost Saved",
    value: 18720,
    unit: "",
    icon: DollarSign,
    color: "#f59e0b",
    prefix: "$",
  },
  {
    label: "Efficiency Gain",
    value: 143,
    unit: "%",
    icon: TrendingUp,
    color: "#a855f7",
    isDecimal: true,
  },
];

function MetricCount({
  value,
  color,
  prefix = "",
  isDecimal = false,
}: {
  value: number;
  color: string;
  prefix?: string;
  isDecimal?: boolean;
}) {
  const count = useCountUp(value, 2000);
  const display = isDecimal ? (count / 10).toFixed(1) : count.toLocaleString();

  return (
    <span
      className="text-3xl font-bold font-mono"
      style={{ color, textShadow: `0 0 20px ${color}44` }}
    >
      {prefix}
      {display}
    </span>
  );
}

export default function BusinessMetrics() {
  return (
    <motion.div
      className="glass-card-static p-5 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-5 h-5 text-blue-400" />
        <h3 className="font-semibold text-slate-200">
          Business Impact Metrics
        </h3>
        <span className="ml-auto text-xs text-slate-500">30-day period</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              className="rounded-xl p-4 text-center relative overflow-hidden"
              style={{
                background: `${metric.color}08`,
                border: `1px solid ${metric.color}25`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
            >
              <div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10 blur-xl"
                style={{ background: metric.color }}
              />
              <div
                className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{
                  background: `${metric.color}22`,
                  border: `1px solid ${metric.color}44`,
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{
                    color: metric.color,
                    filter: `drop-shadow(0 0 5px ${metric.color})`,
                  }}
                />
              </div>
              <div className="mb-1">
                <MetricCount
                  value={metric.value}
                  color={metric.color}
                  prefix={metric.prefix}
                  isDecimal={metric.isDecimal}
                />
              </div>
              <div className="text-xs text-slate-500">
                {metric.unit && <span>{metric.unit} · </span>}
                {metric.label}
              </div>

              {/* Sparkline */}
              <div className="mt-2 flex items-end gap-0.5 h-4 justify-center">
                {Array.from({ length: 8 }, (_, i) => {
                  const h = 30 + Math.abs(Math.sin(i * 1.2 + index)) * 70;
                  return (
                    <div
                      key={`spark-${metric.label}-${i}`}
                      className="w-1.5 rounded-sm opacity-50"
                      style={{
                        background: metric.color,
                        height: `${Math.max(20, h)}%`,
                      }}
                    />
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
