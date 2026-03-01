import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GoldenSignature {
    id: string;
    status: string;
    name: string;
    createdAt: bigint;
    parameters: {
        temperature: number;
        holdTime: number;
        coolingRate: number;
        feedRate: number;
        pressure: number;
    };
    updatedAt: bigint;
    category: string;
    objectives: {
        carbonKg: number;
        energyKwh: number;
        qualityPct: number;
        yieldPct: number;
        performancePct: number;
    };
}
export interface BatchRecord {
    id: string;
    maintenanceAlertProb: number;
    carbonKg: number;
    temperature: number;
    holdTime: number;
    coolingRate: number;
    feedRate: number;
    energyKwh: number;
    pressure: number;
    qualityPct: number;
    timestamp: bigint;
    deviationScore: number;
    materialType: string;
    machineId: string;
    riskScore: number;
    yieldPct: number;
    batchSize: number;
    performancePct: number;
}
export interface Scenario {
    id: string;
    name: string;
    parameters: {
        temperature: number;
        holdTime: number;
        coolingRate: number;
        feedRate: number;
        pressure: number;
    };
}
export interface backendInterface {
    acceptRecommendation(id: string): Promise<void>;
    compareScenarios(id1: string, id2: string): Promise<[Scenario, Scenario]>;
    createSignature(signature: GoldenSignature): Promise<void>;
    deleteSignature(id: string): Promise<void>;
    getBatchById(id: string): Promise<BatchRecord>;
    getBatches(): Promise<Array<BatchRecord>>;
    getScenarios(): Promise<Array<Scenario>>;
    getSignatureById(id: string): Promise<GoldenSignature>;
    getSignatures(): Promise<Array<GoldenSignature>>;
    modifyRecommendation(id: string, newMessage: string): Promise<void>;
    rejectRecommendation(id: string): Promise<void>;
    saveScenario(name: string, params: Scenario): Promise<void>;
    storeBatch(batch: BatchRecord): Promise<void>;
    updateSignatureStatus(id: string, status: string): Promise<void>;
}
