import { Activity, BarChart3, Leaf, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { GoldenSignature } from "../backend";
import BusinessMetrics from "../components/BusinessMetrics";
import GoldenSignatureCard from "../components/GoldenSignatureCard";
import KPICard from "../components/KPICard";
import ParetoChart from "../components/ParetoChart";
import RecommendationCard from "../components/RecommendationCard";
import { mockRecommendations } from "../hooks/useMockData";
import {
  useAcceptRecommendation,
  useCreateSignature,
  useGetSignatures,
  useModifyRecommendation,
  useRejectRecommendation,
  useUpdateSignatureStatus,
} from "../hooks/useQueries";

export default function DashboardPage() {
  const { data: signatures = [] } = useGetSignatures();
  const createSignature = useCreateSignature();
  const updateStatus = useUpdateSignatureStatus();
  const acceptRec = useAcceptRecommendation();
  const rejectRec = useRejectRecommendation();
  const modifyRec = useModifyRecommendation();

  const kpiCards = [
    {
      label: "Energy Consumption",
      value: 943,
      unit: "kWh",
      trend: -3.2,
      icon: Zap,
      color: "#3b82f6",
      glowColor: "rgba(59,130,246,0.8)",
      format: "number" as const,
    },
    {
      label: "Carbon Emissions",
      value: 847,
      unit: "kg CO₂e",
      trend: -5.8,
      icon: Leaf,
      color: "#10b981",
      glowColor: "rgba(16,185,129,0.8)",
      format: "number" as const,
    },
    {
      label: "Yield Rate",
      value: 921,
      unit: "%",
      trend: 2.4,
      icon: BarChart3,
      color: "#a855f7",
      glowColor: "rgba(168,85,247,0.8)",
      format: "decimal" as const,
    },
    {
      label: "Quality Score",
      value: 883,
      unit: "%",
      trend: 1.7,
      icon: Star,
      color: "#f59e0b",
      glowColor: "rgba(245,158,11,0.8)",
      format: "decimal" as const,
    },
    {
      label: "Performance",
      value: 876,
      unit: "%",
      trend: 3.1,
      icon: Activity,
      color: "#06b6d4",
      glowColor: "rgba(6,182,212,0.8)",
      format: "decimal" as const,
    },
  ];

  const handleSetSignature = (sig: GoldenSignature) => {
    createSignature.mutate(sig, {
      onError: () => toast.error("Failed to save signature"),
    });
  };

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
            Manufacturing Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time optimization dashboard — Golden Signature AI Engine
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2"
          style={{
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            color: "#10b981",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          Live · Updated 2s ago
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiCards.map((card, index) => (
          <KPICard key={card.label} {...card} delay={index * 0.08} />
        ))}
      </div>

      {/* Pareto Chart */}
      <ParetoChart onSetSignature={handleSetSignature} />

      {/* Golden Signatures */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-slate-200">
            Golden Signature Benchmarks
          </h2>
          <span
            className="ml-2 text-xs px-2 py-0.5 rounded-full font-mono"
            style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa" }}
          >
            {signatures.length} saved
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {signatures.map((sig, i) => (
            <GoldenSignatureCard
              key={sig.id}
              signature={sig}
              onUpdateStatus={(id, status) =>
                updateStatus.mutate(
                  { id, status },
                  {
                    onSuccess: () => toast.success("Signature status updated!"),
                  },
                )
              }
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(59, 130, 246, 0.2)" }}
          >
            <Activity className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <h2 className="font-semibold text-slate-200">AI Recommendations</h2>
          <span
            className="ml-auto text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(59, 130, 246, 0.1)", color: "#60a5fa" }}
          >
            Human-in-loop review
          </span>
        </div>
        <div className="space-y-3">
          {mockRecommendations.map((rec, i) => (
            <RecommendationCard
              key={rec.id}
              {...rec}
              delay={i * 0.4}
              onAccept={(id) => acceptRec.mutate(id)}
              onReject={(id) => rejectRec.mutate(id)}
              onModify={(id) =>
                modifyRec.mutate({ id, msg: "Modified by user" })
              }
            />
          ))}
        </div>
      </div>

      {/* Business Metrics */}
      <BusinessMetrics />
    </motion.div>
  );
}
