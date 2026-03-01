import { Bot, Check, Edit3, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useTypingEffect } from "../hooks/useTypingEffect";

interface RecommendationCardProps {
  id: string;
  message: string;
  confidence: number;
  impact: string;
  category: string;
  delay?: number;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onModify: (id: string) => void;
}

export default function RecommendationCard({
  id,
  message,
  confidence,
  impact,
  category,
  delay = 0,
  onAccept,
  onReject,
  onModify,
}: RecommendationCardProps) {
  const [dismissed, setDismissed] = useState(false);
  const { displayText, isDone } = useTypingEffect(message, 30, delay * 1000);

  if (dismissed) return null;

  const confidenceColor =
    confidence >= 90 ? "#10b981" : confidence >= 75 ? "#f59e0b" : "#ef4444";

  return (
    <motion.div
      className="glass-card-static p-4 rounded-xl relative overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
        style={{ background: "linear-gradient(180deg, #3b82f6, #10b981)" }}
      />

      <div className="pl-3">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-blue-300">
            {category}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                color: confidenceColor,
                background: `${confidenceColor}22`,
              }}
            >
              {confidence}% confidence
            </span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                color: "#10b981",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              {impact}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-3 min-h-[2.5rem]">
          {displayText}
          {!isDone && (
            <span className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 animate-pulse" />
          )}
        </p>

        <div className="flex gap-2">
          <motion.button
            onClick={() => {
              onAccept(id);
              setDismissed(true);
              toast.success(
                "Recommendation accepted and queued for implementation.",
              );
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white glow-btn-green"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
            whileTap={{ scale: 0.96 }}
          >
            <Check className="w-3 h-3" />
            Accept
          </motion.button>
          <motion.button
            onClick={() => {
              onReject(id);
              setDismissed(true);
              toast.info("Recommendation dismissed.");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white glow-btn-red"
            style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
            whileTap={{ scale: 0.96 }}
          >
            <X className="w-3 h-3" />
            Reject
          </motion.button>
          <motion.button
            onClick={() => {
              onModify(id);
              toast.info("Opening modification dialog...");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white glow-btn-amber"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
            whileTap={{ scale: 0.96 }}
          >
            <Edit3 className="w-3 h-3" />
            Modify
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
