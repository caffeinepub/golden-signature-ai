import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Play,
  Save,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { BatchRecord, Scenario } from "../backend";
import { generateMockSignatures, simulateBatch } from "../hooks/useMockData";
import {
  useGetScenarios,
  useSaveScenario,
  useStoreBatch,
} from "../hooks/useQueries";

const goldenSig = generateMockSignatures()[0];

type SimResult = ReturnType<typeof simulateBatch>;

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  color,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  color: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const inputId = `slider-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label htmlFor={inputId} className="text-xs text-slate-400">
          {label}
        </label>
        <span className="text-xs font-mono font-bold" style={{ color }}>
          {value} {unit}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-slate-800">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-150"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
          }}
        />
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
        <div
          className="absolute w-3.5 h-3.5 rounded-full border-2 border-white -translate-y-1/2 top-1/2 pointer-events-none transition-all duration-150"
          style={{
            left: `calc(${pct}% - 7px)`,
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-700 mt-0.5">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function GaugeBar({
  label,
  value,
  max,
  color,
  unit,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  unit: string;
}) {
  const pct = Math.min(100, (value / max) * 100);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-mono font-bold" style={{ color }}>
          {typeof value === "number" ? value.toFixed(1) : value}
          {unit}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function BatchSimulatorPage() {
  const [form, setForm] = useState({
    materialType: "Steel",
    batchSize: 1000,
    machineId: "Machine-A",
    temperature: 250,
    pressure: 15,
    holdTime: 45,
    feedRate: 140,
    coolingRate: 4.0,
  });

  const [result, setResult] = useState<SimResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [roiExpanded, setRoiExpanded] = useState(false);
  const [roi, setRoi] = useState({
    costPerBatch: 500,
    batchesPerDay: 8,
    savingPct: 12,
  });

  const { data: scenarios = [] } = useGetScenarios();
  const saveScenario = useSaveScenario();
  const storeBatch = useStoreBatch();

  const handleSimulate = async () => {
    setIsSimulating(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 800));
    const res = simulateBatch(form);
    setResult(res);
    setIsSimulating(false);

    // Store batch to backend
    const batch: BatchRecord = {
      id: `batch-${Date.now()}`,
      maintenanceAlertProb: res.maintenanceAlertProb,
      carbonKg: res.carbonKg,
      temperature: form.temperature,
      holdTime: form.holdTime,
      coolingRate: form.coolingRate,
      feedRate: form.feedRate,
      energyKwh: res.energyKwh,
      pressure: form.pressure,
      qualityPct: res.qualityPct,
      timestamp: BigInt(Date.now()),
      deviationScore: res.deviationScore,
      materialType: form.materialType,
      machineId: form.machineId,
      riskScore: res.riskScore,
      yieldPct: res.yieldPct,
      batchSize: form.batchSize,
      performancePct: res.performancePct,
    };
    storeBatch.mutate(batch);
  };

  const handleSaveScenario = () => {
    const name = `${form.materialType} @ ${form.temperature}°C`;
    const params: Scenario = {
      id: `scenario-${Date.now()}`,
      name,
      parameters: {
        temperature: form.temperature,
        holdTime: form.holdTime,
        coolingRate: form.coolingRate,
        feedRate: form.feedRate,
        pressure: form.pressure,
      },
    };
    saveScenario.mutate(
      { name, params },
      { onSuccess: () => toast.success(`Scenario "${name}" saved!`) },
    );
  };

  const riskLabel =
    result && result.riskScore < 0.25
      ? { label: "Low Risk", color: "#10b981" }
      : result && result.riskScore < 0.5
        ? { label: "Medium Risk", color: "#f59e0b" }
        : { label: "High Risk", color: "#ef4444" };

  const dailySavings =
    (roi.costPerBatch * roi.batchesPerDay * roi.savingPct) / 100;
  const annualSavings = dailySavings * 365;
  const roiPct = (
    (annualSavings / (roi.costPerBatch * roi.batchesPerDay * 365)) *
    100
  ).toFixed(1);

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
          <h1 className="text-2xl font-bold text-slate-100">Batch Simulator</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Digital twin — test parameter combinations before production
          </p>
        </div>
      </div>

      {/* Main Simulator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input Form */}
        <motion.div
          className="lg:col-span-2 glass-card-static p-5 rounded-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <FlaskConical className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-slate-200">Batch Parameters</h3>
          </div>

          <div className="space-y-5">
            {/* Dropdowns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="material-type"
                  className="text-xs text-slate-400 block mb-1.5"
                >
                  Material Type
                </label>
                <select
                  id="material-type"
                  value={form.materialType}
                  onChange={(e) =>
                    setForm({ ...form, materialType: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  {["Steel", "Aluminum", "Copper", "Titanium"].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="machine-id"
                  className="text-xs text-slate-400 block mb-1.5"
                >
                  Machine ID
                </label>
                <select
                  id="machine-id"
                  value={form.machineId}
                  onChange={(e) =>
                    setForm({ ...form, machineId: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  {["Machine-A", "Machine-B", "Machine-C"].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="batch-size"
                className="text-xs text-slate-400 block mb-1.5"
              >
                Batch Size (units)
              </label>
              <input
                id="batch-size"
                type="number"
                value={form.batchSize}
                onChange={(e) =>
                  setForm({ ...form, batchSize: Number(e.target.value) })
                }
                min={100}
                max={5000}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-4 pt-1">
              <SliderInput
                label="Temperature"
                value={form.temperature}
                min={150}
                max={350}
                step={5}
                unit="°C"
                onChange={(v) => setForm({ ...form, temperature: v })}
                color="#3b82f6"
              />
              <SliderInput
                label="Pressure"
                value={form.pressure}
                min={5}
                max={25}
                step={0.5}
                unit="bar"
                onChange={(v) => setForm({ ...form, pressure: v })}
                color="#a855f7"
              />
              <SliderInput
                label="Hold Time"
                value={form.holdTime}
                min={10}
                max={120}
                step={5}
                unit="min"
                onChange={(v) => setForm({ ...form, holdTime: v })}
                color="#f59e0b"
              />
              <SliderInput
                label="Feed Rate"
                value={form.feedRate}
                min={50}
                max={200}
                step={5}
                unit="u/hr"
                onChange={(v) => setForm({ ...form, feedRate: v })}
                color="#06b6d4"
              />
              <SliderInput
                label="Cooling Rate"
                value={form.coolingRate}
                min={1}
                max={10}
                step={0.5}
                unit="°C/min"
                onChange={(v) => setForm({ ...form, coolingRate: v })}
                color="#10b981"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <motion.button
                onClick={handleSimulate}
                disabled={isSimulating}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white glow-btn disabled:opacity-50"
                style={{
                  background: isSimulating
                    ? "rgba(59, 130, 246, 0.5)"
                    : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                }}
                whileTap={{ scale: 0.97 }}
                animate={isSimulating ? { scale: [1, 1.02, 1] } : {}}
                transition={
                  isSimulating
                    ? { repeat: Number.POSITIVE_INFINITY, duration: 0.6 }
                    : {}
                }
              >
                <Play className="w-4 h-4" />
                {isSimulating ? "Simulating..." : "Simulate Batch"}
              </motion.button>
              <motion.button
                onClick={handleSaveScenario}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 glow-btn"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Save className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Results Panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {isSimulating && (
              <motion.div
                key="loading"
                className="glass-card-static p-8 rounded-xl flex flex-col items-center justify-center h-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mb-4" />
                <p className="text-slate-400 text-sm">Running simulation...</p>
                <p className="text-xs text-slate-600 mt-1">
                  NSGA-II engine processing
                </p>
              </motion.div>
            )}

            {!isSimulating && !result && (
              <motion.div
                key="empty"
                className="glass-card-static p-8 rounded-xl flex flex-col items-center justify-center h-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FlaskConical className="w-12 h-12 text-slate-700 mb-4" />
                <p className="text-slate-500 text-sm">
                  Configure parameters and run simulation
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Results will appear here
                </p>
              </motion.div>
            )}

            {!isSimulating && result && (
              <motion.div
                key="results"
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Predicted Metrics */}
                <div className="glass-card-static p-5 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-200 text-sm">
                      Predicted Metrics
                    </h4>
                    <div className="flex items-center gap-2">
                      <div
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{
                          color: riskLabel.color,
                          background: `${riskLabel.color}18`,
                          border: `1px solid ${riskLabel.color}40`,
                        }}
                      >
                        {riskLabel.label}
                      </div>
                      <div
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{
                          color: "#a855f7",
                          background: "rgba(168, 85, 247, 0.1)",
                          border: "1px solid rgba(168, 85, 247, 0.3)",
                        }}
                      >
                        {result.confidenceScore}% AI confidence
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <GaugeBar
                      label="Yield %"
                      value={result.yieldPct}
                      max={100}
                      color="#a855f7"
                      unit="%"
                    />
                    <GaugeBar
                      label="Quality %"
                      value={result.qualityPct}
                      max={100}
                      color="#f59e0b"
                      unit="%"
                    />
                    <GaugeBar
                      label="Performance %"
                      value={result.performancePct}
                      max={100}
                      color="#06b6d4"
                      unit="%"
                    />
                    <GaugeBar
                      label="Energy kWh"
                      value={result.energyKwh}
                      max={2000}
                      color="#3b82f6"
                      unit=" kWh"
                    />
                    <GaugeBar
                      label="Carbon kg CO₂e"
                      value={result.carbonKg}
                      max={1000}
                      color="#10b981"
                      unit=" kg"
                    />
                  </div>
                </div>

                {/* Comparison vs Golden Signature */}
                <div className="glass-card-static p-5 rounded-xl">
                  <h4 className="font-semibold text-slate-200 text-sm mb-3">
                    vs Golden Signature: {goldenSig.name}
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        label: "Yield",
                        sim: result.yieldPct,
                        gold: goldenSig.objectives.yieldPct,
                        unit: "%",
                        higherIsBetter: true,
                      },
                      {
                        label: "Quality",
                        sim: result.qualityPct,
                        gold: goldenSig.objectives.qualityPct,
                        unit: "%",
                        higherIsBetter: true,
                      },
                      {
                        label: "Energy",
                        sim: result.energyKwh,
                        gold: goldenSig.objectives.energyKwh,
                        unit: " kWh",
                        higherIsBetter: false,
                      },
                      {
                        label: "Carbon",
                        sim: result.carbonKg,
                        gold: goldenSig.objectives.carbonKg,
                        unit: " kg",
                        higherIsBetter: false,
                      },
                    ].map((row) => {
                      const delta = row.sim - row.gold;
                      const deltaPct = ((delta / row.gold) * 100).toFixed(1);
                      const isGood = row.higherIsBetter
                        ? delta >= 0
                        : delta <= 0;
                      const color = isGood ? "#10b981" : "#ef4444";

                      return (
                        <div
                          key={row.label}
                          className="flex items-center gap-3 py-1.5 border-b border-white/5"
                        >
                          <span className="text-xs text-slate-500 w-16">
                            {row.label}
                          </span>
                          <span className="text-xs font-mono text-slate-300 w-20">
                            {row.sim.toFixed(1)}
                            {row.unit}
                          </span>
                          <span className="text-xs text-slate-600 flex-1 font-mono">
                            GS: {row.gold.toFixed(1)}
                            {row.unit}
                          </span>
                          <div
                            className="flex items-center gap-1 text-xs font-bold"
                            style={{ color }}
                          >
                            {isGood ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {Number(deltaPct) > 0 ? "+" : ""}
                            {deltaPct}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Improvement Suggestions */}
                <div className="glass-card-static p-5 rounded-xl">
                  <h4 className="font-semibold text-slate-200 text-sm mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Improvement Potential
                  </h4>
                  <div className="space-y-2">
                    {result.improvements.map((imp) => (
                      <div
                        key={imp.label}
                        className="flex items-start gap-3 p-2.5 rounded-lg"
                        style={{
                          background: "rgba(16, 185, 129, 0.07)",
                          border: "1px solid rgba(16, 185, 129, 0.15)",
                        }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: "#10b981" }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-200">
                              {imp.label}
                            </span>
                            <span
                              className="text-xs font-bold px-1.5 py-0.5 rounded"
                              style={{
                                color: "#10b981",
                                background: "rgba(16, 185, 129, 0.15)",
                              }}
                            >
                              {imp.gain}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {imp.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Maintenance Alert */}
                <div
                  className="glass-card-static p-4 rounded-xl"
                  style={{
                    border: `1px solid ${result.maintenanceAlertProb > 0.3 ? "rgba(239, 68, 68, 0.3)" : "rgba(59, 130, 246, 0.15)"}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle
                        className="w-4 h-4"
                        style={{
                          color:
                            result.maintenanceAlertProb > 0.3
                              ? "#ef4444"
                              : "#f59e0b",
                        }}
                      />
                      <span className="text-xs font-semibold text-slate-300">
                        Maintenance Alert Probability
                      </span>
                    </div>
                    <span
                      className="text-sm font-bold font-mono"
                      style={{
                        color:
                          result.maintenanceAlertProb > 0.3
                            ? "#ef4444"
                            : "#10b981",
                      }}
                    >
                      {(result.maintenanceAlertProb * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background:
                          result.maintenanceAlertProb > 0.3
                            ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                            : "linear-gradient(90deg, #10b981, #3b82f6)",
                      }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${result.maintenanceAlertProb * 100}%`,
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* What-If Scenario Comparison */}
      {scenarios.length >= 2 && (
        <motion.div
          className="glass-card-static p-5 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-slate-200 text-sm mb-4">
            What-If Scenario Comparison
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {scenarios.slice(0, 2).map((scenario, idx) => (
              <div key={scenario.id}>
                <div
                  className="text-xs font-semibold mb-3 px-2 py-1 rounded inline-block"
                  style={{
                    background:
                      idx === 0
                        ? "rgba(59, 130, 246, 0.15)"
                        : "rgba(168, 85, 247, 0.15)",
                    color: idx === 0 ? "#60a5fa" : "#c084fc",
                  }}
                >
                  {scenario.name}
                </div>
                <div className="space-y-2">
                  {Object.entries(scenario.parameters).map(([key, val]) => {
                    const other = scenarios[idx === 0 ? 1 : 0];
                    const otherVal =
                      other.parameters[key as keyof typeof other.parameters];
                    const diff = val - otherVal;
                    const diffColor =
                      Math.abs(diff) < 1
                        ? "#64748b"
                        : diff > 0
                          ? "#10b981"
                          : "#ef4444";

                    const labels: Record<string, string> = {
                      temperature: "Temp (°C)",
                      holdTime: "Hold Time (min)",
                      coolingRate: "Cooling (°C/min)",
                      feedRate: "Feed Rate (u/hr)",
                      pressure: "Pressure (bar)",
                    };

                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-500">
                          {labels[key] || key}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-200">
                            {Number(val).toFixed(1)}
                          </span>
                          {diff !== 0 && (
                            <span
                              className="font-mono font-bold"
                              style={{ color: diffColor }}
                            >
                              {diff > 0 ? "+" : ""}
                              {diff.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ROI Calculator */}
      <motion.div
        className="glass-card-static rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          type="button"
          onClick={() => setRoiExpanded(!roiExpanded)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-slate-200">ROI Calculator</h3>
          </div>
          {roiExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        <AnimatePresence>
          {roiExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="roi-cost-per-batch"
                      className="text-xs text-slate-400 block mb-1.5"
                    >
                      Cost / Batch ($)
                    </label>
                    <input
                      id="roi-cost-per-batch"
                      type="number"
                      value={roi.costPerBatch}
                      onChange={(e) =>
                        setRoi({ ...roi, costPerBatch: Number(e.target.value) })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="roi-batches-per-day"
                      className="text-xs text-slate-400 block mb-1.5"
                    >
                      Batches / Day
                    </label>
                    <input
                      id="roi-batches-per-day"
                      type="number"
                      value={roi.batchesPerDay}
                      onChange={(e) =>
                        setRoi({
                          ...roi,
                          batchesPerDay: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="roi-saving-pct"
                      className="text-xs text-slate-400 block mb-1.5"
                    >
                      Optimization Saving (%)
                    </label>
                    <input
                      id="roi-saving-pct"
                      type="number"
                      value={roi.savingPct}
                      onChange={(e) =>
                        setRoi({ ...roi, savingPct: Number(e.target.value) })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "Daily Savings",
                      value: `$${dailySavings.toFixed(0)}`,
                      color: "#10b981",
                    },
                    {
                      label: "Annual Savings",
                      value: `$${annualSavings.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
                      color: "#3b82f6",
                    },
                    { label: "ROI", value: `${roiPct}%`, color: "#f59e0b" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-4 rounded-xl text-center"
                      style={{
                        background: `${item.color}08`,
                        border: `1px solid ${item.color}25`,
                      }}
                    >
                      <div className="text-xs text-slate-500 mb-1">
                        {item.label}
                      </div>
                      <div
                        className="text-2xl font-bold font-mono"
                        style={{ color: item.color }}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
