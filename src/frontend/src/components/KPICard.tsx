import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useCountUp } from "../hooks/useCountUp";

interface KPICardProps {
  label: string;
  value: number;
  unit: string;
  trend: number;
  icon: LucideIcon;
  color: string;
  glowColor: string;
  format?: "number" | "decimal" | "currency";
  delay?: number;
}

export default function KPICard({
  label,
  value,
  unit,
  trend,
  icon: Icon,
  color,
  glowColor,
  format = "number",
  delay = 0,
}: KPICardProps) {
  const animatedValue = useCountUp(
    format === "decimal" ? Math.round(value * 10) : Math.round(value),
    1500,
  );

  const displayValue =
    format === "decimal"
      ? (animatedValue / 10).toFixed(1)
      : format === "currency"
        ? animatedValue.toLocaleString()
        : animatedValue.toLocaleString();

  const trendPositive = trend >= 0;
  const isGoodTrend =
    label.includes("Energy") || label.includes("Carbon")
      ? !trendPositive
      : trendPositive;

  return (
    <motion.div
      className="metric-card p-5 relative overflow-hidden"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {/* Background gradient glow */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl pointer-events-none"
        style={{ background: color }}
      />

      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: `${color}22`,
            border: `1px solid ${color}44`,
          }}
        >
          <Icon
            className="w-5 h-5"
            style={{
              color,
              filter: `drop-shadow(0 0 6px ${glowColor})`,
            }}
          />
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            isGoodTrend
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-red-500/15 text-red-400"
          }`}
        >
          {trendPositive ? "+" : ""}
          {trend.toFixed(1)}%
        </span>
      </div>

      <div className="flex items-end gap-1.5 mb-1">
        <span
          className="text-2xl font-bold font-mono leading-none"
          style={{ color }}
        >
          {format === "currency" ? "$" : ""}
          {displayValue}
        </span>
        <span className="text-xs text-slate-500 pb-0.5">{unit}</span>
      </div>

      <div className="text-sm text-slate-400 font-medium">{label}</div>

      {/* Mini sparkline bars */}
      {(() => {
        const bars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => ({
          id: `${label}-bar-${i}`,
          h: Math.max(20, 30 + Math.sin(i * 0.8 + 1) * 50 + 20),
          delayVal: delay + i * 0.05,
        }));
        return (
          <div className="mt-3 flex items-end gap-0.5 h-6">
            {bars.map((bar) => (
              <motion.div
                key={bar.id}
                className="flex-1 rounded-sm opacity-40"
                style={{ backgroundColor: color, height: `${bar.h}%` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.3, delay: bar.delayVal }}
              />
            ))}
          </div>
        );
      })()}
    </motion.div>
  );
}
