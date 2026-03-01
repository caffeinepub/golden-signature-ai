import { CheckCircle, Clock, Star, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { GoldenSignature } from "../backend";

interface GoldenSignatureCardProps {
  signature: GoldenSignature;
  onUpdateStatus: (id: string, status: string) => void;
  delay?: number;
}

const categoryLabels: Record<string, string> = {
  best_yield_low_energy: "Best Yield + Low Energy",
  best_quality_low_carbon: "Best Quality + Low Carbon",
  max_performance_min_emission: "Max Performance + Min Emission",
};

const categoryColors: Record<string, string> = {
  best_yield_low_energy: "#3b82f6",
  best_quality_low_carbon: "#10b981",
  max_performance_min_emission: "#a855f7",
};

const statusConfig: Record<
  string,
  { color: string; bg: string; icon: React.ElementType }
> = {
  Active: {
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.15)",
    icon: CheckCircle,
  },
  Improved: {
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.15)",
    icon: TrendingUp,
  },
  Outdated: { color: "#6b7280", bg: "rgba(107, 114, 128, 0.15)", icon: Clock },
};

export default function GoldenSignatureCard({
  signature,
  onUpdateStatus,
  delay = 0,
}: GoldenSignatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const catColor = categoryColors[signature.category] ?? "#3b82f6";
  const status = statusConfig[signature.status] ?? statusConfig.Active;
  const StatusIcon = status.icon;

  return (
    <motion.div
      className="relative rounded-xl p-5 cursor-default overflow-hidden"
      style={{
        background: "rgba(17, 24, 39, 0.9)",
        border: `1px solid ${isHovered ? catColor : "rgba(59, 130, 246, 0.15)"}`,
        transition: "all 0.3s ease",
        boxShadow: isHovered ? `0 0 25px ${catColor}33` : "none",
        transform: isHovered ? "translateY(-4px)" : "none",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Category color stripe */}
      <div
        className="absolute top-0 left-0 w-full h-1 rounded-t-xl"
        style={{
          background: `linear-gradient(90deg, ${catColor}, transparent)`,
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3 mt-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4" style={{ color: catColor }} />
            <span className="font-semibold text-slate-200 text-sm">
              {signature.name}
            </span>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              color: catColor,
              background: `${catColor}22`,
              border: `1px solid ${catColor}44`,
            }}
          >
            {categoryLabels[signature.category] ?? signature.category}
          </span>
        </div>
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold"
          style={{ color: status.color, background: status.bg }}
        >
          <StatusIcon className="w-3 h-3" />
          {signature.status}
        </div>
      </div>

      {/* Objectives Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          {
            label: "Energy",
            value: `${signature.objectives.energyKwh} kWh`,
            color: "#3b82f6",
          },
          {
            label: "Carbon",
            value: `${signature.objectives.carbonKg} kg`,
            color: "#10b981",
          },
          {
            label: "Yield",
            value: `${signature.objectives.yieldPct}%`,
            color: "#a855f7",
          },
          {
            label: "Quality",
            value: `${signature.objectives.qualityPct}%`,
            color: "#f59e0b",
          },
        ].map((obj) => (
          <div
            key={obj.label}
            className="rounded-lg p-2"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="text-xs text-slate-500 mb-0.5">{obj.label}</div>
            <div
              className="text-sm font-bold font-mono"
              style={{ color: obj.color }}
            >
              {obj.value}
            </div>
          </div>
        ))}
      </div>

      {/* Performance bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Performance</span>
          <span className="font-mono text-slate-300">
            {signature.objectives.performancePct}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${catColor}, ${catColor}aa)`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${signature.objectives.performancePct}%` }}
            transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Apply button — appears on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={() => onUpdateStatus(signature.id, "Active")}
            className="w-full py-2 rounded-lg text-xs font-semibold text-white glow-btn"
            style={{
              background: `linear-gradient(135deg, ${catColor}, ${catColor}cc)`,
            }}
          >
            Apply Optimization
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
