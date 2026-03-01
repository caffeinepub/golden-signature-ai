import type { BatchRecord, GoldenSignature, Scenario } from "../backend";

export function generateParetoFront(): Array<{
  energy: number;
  yield: number;
  quality: number;
  performance: number;
  carbon: number;
  category: string;
  label: string;
}> {
  const points: Array<{
    energy: number;
    yield: number;
    quality: number;
    performance: number;
    carbon: number;
    category: string;
    label: string;
  }> = [];

  // Best Yield + Low Energy cluster
  for (let i = 0; i < 7; i++) {
    const energy = 750 + i * 25 + Math.random() * 20;
    const yieldPct = 95 - i * 1.5 + Math.random() * 3;
    points.push({
      energy: Math.round(energy),
      yield: Math.round(yieldPct * 10) / 10,
      quality: Math.round((82 + Math.random() * 10) * 10) / 10,
      performance: Math.round((85 + Math.random() * 8) * 10) / 10,
      carbon: Math.round(energy * 0.45 * 10) / 10,
      category: "best_yield_low_energy",
      label: "Best Yield + Low Energy",
    });
  }

  // Best Quality + Low Carbon cluster
  for (let i = 0; i < 7; i++) {
    const energy = 820 + i * 30 + Math.random() * 25;
    const quality = 94 - i * 1.2 + Math.random() * 2;
    points.push({
      energy: Math.round(energy),
      yield: Math.round((87 + Math.random() * 6) * 10) / 10,
      quality: Math.round(quality * 10) / 10,
      performance: Math.round((80 + Math.random() * 12) * 10) / 10,
      carbon: Math.round(energy * 0.38 * 10) / 10,
      category: "best_quality_low_carbon",
      label: "Best Quality + Low Carbon",
    });
  }

  // Max Performance + Min Emission cluster
  for (let i = 0; i < 6; i++) {
    const energy = 900 + i * 20 + Math.random() * 30;
    const performance = 96 - i * 1.8 + Math.random() * 2;
    points.push({
      energy: Math.round(energy),
      yield: Math.round((84 + Math.random() * 8) * 10) / 10,
      quality: Math.round((86 + Math.random() * 8) * 10) / 10,
      performance: Math.round(performance * 10) / 10,
      carbon: Math.round(energy * 0.42 * 10) / 10,
      category: "max_performance_min_emission",
      label: "Max Performance + Min Emission",
    });
  }

  return points;
}

export function generateEnergyTimeSeries(): Array<{
  time: string;
  energy: number;
  isAnomaly: boolean;
  anomalyMsg?: string;
}> {
  const data: Array<{
    time: string;
    energy: number;
    isAnomaly: boolean;
    anomalyMsg?: string;
  }> = [];
  const anomalyIndices = new Set([7, 18, 25]);

  for (let i = 0; i < 30; i++) {
    const hour = i % 24;
    const baseEnergy = 850 + Math.sin(i * 0.4) * 120;
    const isAnomaly = anomalyIndices.has(i);
    const energy = isAnomaly
      ? baseEnergy + 250 + Math.random() * 100
      : baseEnergy + (Math.random() - 0.5) * 60;

    data.push({
      time: `${String(hour).padStart(2, "0")}:00`,
      energy: Math.round(energy),
      isAnomaly,
      anomalyMsg: isAnomaly
        ? "Anomaly Detected: Spike exceeds threshold"
        : undefined,
    });
  }

  return data;
}

export function generateCarbonTrend(): Array<{
  date: string;
  actual: number;
  target: number;
  regulation: number;
}> {
  const data: Array<{
    date: string;
    actual: number;
    target: number;
    regulation: number;
  }> = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const label = `${date.getMonth() + 1}/${date.getDate()}`;

    const actual = 820 + Math.sin(i * 0.3) * 60 + (Math.random() - 0.5) * 40;
    data.push({
      date: label,
      actual: Math.round(actual),
      target: 900,
      regulation: 1000,
    });
  }

  return data;
}

export function generateShapValues(): Array<{
  name: string;
  impact: number;
  color: string;
}> {
  return [
    { name: "Temperature", impact: 0.42, color: "#3b82f6" },
    { name: "Pressure", impact: 0.31, color: "#3b82f6" },
    { name: "Hold Time", impact: -0.28, color: "#ef4444" },
    { name: "Feed Rate", impact: 0.19, color: "#3b82f6" },
    { name: "Cooling Rate", impact: -0.15, color: "#ef4444" },
  ];
}

export function generateMockSignatures(): GoldenSignature[] {
  return [
    {
      id: "sig-001",
      name: "Optimal Yield Config",
      category: "best_yield_low_energy",
      status: "Active",
      createdAt: BigInt(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000),
      parameters: {
        temperature: 285,
        holdTime: 45,
        coolingRate: 4.5,
        feedRate: 150,
        pressure: 18,
      },
      objectives: {
        energyKwh: 780,
        carbonKg: 340,
        yieldPct: 94.2,
        qualityPct: 88.5,
        performancePct: 87.3,
      },
    },
    {
      id: "sig-002",
      name: "Low Carbon Premium",
      category: "best_quality_low_carbon",
      status: "Improved",
      createdAt: BigInt(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: BigInt(Date.now() - 1 * 24 * 60 * 60 * 1000),
      parameters: {
        temperature: 260,
        holdTime: 55,
        coolingRate: 3.8,
        feedRate: 130,
        pressure: 15,
      },
      objectives: {
        energyKwh: 820,
        carbonKg: 295,
        yieldPct: 89.1,
        qualityPct: 95.4,
        performancePct: 82.7,
      },
    },
    {
      id: "sig-003",
      name: "Max Throughput",
      category: "max_performance_min_emission",
      status: "Outdated",
      createdAt: BigInt(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000),
      parameters: {
        temperature: 310,
        holdTime: 35,
        coolingRate: 6.2,
        feedRate: 185,
        pressure: 22,
      },
      objectives: {
        energyKwh: 940,
        carbonKg: 410,
        yieldPct: 86.3,
        qualityPct: 85.8,
        performancePct: 96.1,
      },
    },
  ];
}

export function generateMockBatches(): BatchRecord[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `batch-${String(i + 1).padStart(3, "0")}`,
    maintenanceAlertProb: Math.random() * 0.4,
    carbonKg: 350 + Math.random() * 200,
    temperature: 250 + Math.random() * 80,
    holdTime: 30 + Math.random() * 60,
    coolingRate: 2 + Math.random() * 7,
    feedRate: 100 + Math.random() * 100,
    energyKwh: 750 + Math.random() * 400,
    pressure: 10 + Math.random() * 15,
    qualityPct: 80 + Math.random() * 18,
    timestamp: BigInt(Date.now() - i * 3600000),
    deviationScore: Math.random() * 0.5,
    materialType: ["Steel", "Aluminum", "Copper", "Titanium"][i % 4],
    machineId: `Machine-${["A", "B", "C"][i % 3]}`,
    riskScore: Math.random() * 0.6,
    yieldPct: 82 + Math.random() * 15,
    batchSize: 500 + Math.round(Math.random() * 4500),
    performancePct: 78 + Math.random() * 20,
  }));
}

export function generateMockScenarios(): Scenario[] {
  return [
    {
      id: "scenario-001",
      name: "High Temp Aggressive",
      parameters: {
        temperature: 320,
        holdTime: 40,
        coolingRate: 5.5,
        feedRate: 170,
        pressure: 20,
      },
    },
    {
      id: "scenario-002",
      name: "Low Energy Conservative",
      parameters: {
        temperature: 250,
        holdTime: 60,
        coolingRate: 3.0,
        feedRate: 120,
        pressure: 14,
      },
    },
    {
      id: "scenario-003",
      name: "Balanced Production",
      parameters: {
        temperature: 285,
        holdTime: 48,
        coolingRate: 4.2,
        feedRate: 148,
        pressure: 17,
      },
    },
  ];
}

export const mockRecommendations = [
  {
    id: "rec-001",
    message:
      "AI suggests reducing hold time by 4% to reduce energy consumption by 8% while maintaining yield above 92%.",
    confidence: 94,
    impact: "−8% Energy",
    category: "Energy Optimization",
  },
  {
    id: "rec-002",
    message:
      "Increasing cooling rate from 4.2 to 5.1°C/min could improve quality score by 3.2% with minimal carbon impact.",
    confidence: 87,
    impact: "+3.2% Quality",
    category: "Quality Enhancement",
  },
  {
    id: "rec-003",
    message:
      "Switching to batch profile Omega-7 during low-demand periods projects 12% carbon reduction over 30-day cycle.",
    confidence: 91,
    impact: "−12% Carbon",
    category: "Carbon Reduction",
  },
];

export const businessMetrics = {
  energySaved: 12450,
  carbonReduced: 2340,
  costSaved: 18720,
  efficiencyGain: 14.3,
};

export function simulateBatch(params: {
  materialType: string;
  batchSize: number;
  machineId: string;
  temperature: number;
  pressure: number;
  holdTime: number;
  feedRate: number;
  coolingRate: number;
}): {
  yieldPct: number;
  qualityPct: number;
  performancePct: number;
  energyKwh: number;
  carbonKg: number;
  deviationScore: number;
  riskScore: number;
  maintenanceAlertProb: number;
  confidenceScore: number;
  improvements: Array<{ label: string; gain: string; desc: string }>;
} {
  // Simulate with realistic formulas
  const tempFactor = Math.min(1.0, params.temperature / 300);
  const holdFactor = Math.min(1.0, params.holdTime / 90);
  const pressFactor = Math.min(1.0, params.pressure / 20);
  const feedFactor = params.feedRate / 200;
  const coolFactor = params.coolingRate / 10;

  const yieldPct =
    80 + tempFactor * 10 + holdFactor * 5 - feedFactor * 3 + Math.random() * 3;
  const qualityPct =
    78 + pressFactor * 12 + holdFactor * 6 - feedFactor * 4 + Math.random() * 4;
  const performancePct =
    75 + feedFactor * 15 + tempFactor * 5 - holdFactor * 3 + Math.random() * 4;
  const energyKwh =
    600 + tempFactor * 300 + feedFactor * 200 + params.batchSize * 0.05;
  const carbonKg = energyKwh * 0.42;
  const deviationScore = Math.abs(0.5 - tempFactor) * 0.5 + Math.random() * 0.2;
  const riskScore = deviationScore * 0.8 + Math.random() * 0.2;
  const maintenanceAlertProb = coolFactor * 0.3 + Math.random() * 0.2;
  const confidenceScore = 85 + Math.random() * 12;

  return {
    yieldPct: Math.min(99, Math.round(yieldPct * 10) / 10),
    qualityPct: Math.min(99, Math.round(qualityPct * 10) / 10),
    performancePct: Math.min(99, Math.round(performancePct * 10) / 10),
    energyKwh: Math.round(energyKwh),
    carbonKg: Math.round(carbonKg * 10) / 10,
    deviationScore: Math.round(deviationScore * 100) / 100,
    riskScore: Math.round(riskScore * 100) / 100,
    maintenanceAlertProb: Math.round(maintenanceAlertProb * 100) / 100,
    confidenceScore: Math.round(confidenceScore),
    improvements: [
      {
        label: "Reduce Hold Time",
        gain: "-6.5% Energy",
        desc: "Reducing hold time by 8 min saves energy without yield loss",
      },
      {
        label: "Optimize Temperature",
        gain: "+4.2% Yield",
        desc: "Raising temp to 295°C improves material crystallization",
      },
      {
        label: "Adjust Feed Rate",
        gain: "+2.8% Quality",
        desc: "Reducing feed rate by 10% improves quality consistency",
      },
    ],
  };
}
