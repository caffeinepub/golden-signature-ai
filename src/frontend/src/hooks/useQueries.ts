import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BatchRecord, GoldenSignature, Scenario } from "../backend";
import { useActor } from "./useActor";
import {
  generateMockBatches,
  generateMockScenarios,
  generateMockSignatures,
} from "./useMockData";

// Golden Signatures
export function useGetSignatures() {
  const { actor, isFetching } = useActor();
  return useQuery<GoldenSignature[]>({
    queryKey: ["signatures"],
    queryFn: async () => {
      if (!actor) return generateMockSignatures();
      try {
        const result = await actor.getSignatures();
        return result.length > 0 ? result : generateMockSignatures();
      } catch {
        return generateMockSignatures();
      }
    },
    enabled: !isFetching,
    placeholderData: generateMockSignatures(),
  });
}

export function useCreateSignature() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sig: GoldenSignature) => {
      if (!actor) return;
      await actor.createSignature(sig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signatures"] });
    },
  });
}

export function useUpdateSignatureStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (!actor) return;
      await actor.updateSignatureStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signatures"] });
    },
  });
}

export function useDeleteSignature() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) return;
      await actor.deleteSignature(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signatures"] });
    },
  });
}

// Batches
export function useGetBatches() {
  const { actor, isFetching } = useActor();
  return useQuery<BatchRecord[]>({
    queryKey: ["batches"],
    queryFn: async () => {
      if (!actor) return generateMockBatches();
      try {
        const result = await actor.getBatches();
        return result.length > 0 ? result : generateMockBatches();
      } catch {
        return generateMockBatches();
      }
    },
    enabled: !isFetching,
    placeholderData: generateMockBatches(),
  });
}

export function useStoreBatch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batch: BatchRecord) => {
      if (!actor) return;
      await actor.storeBatch(batch);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
  });
}

// Scenarios
export function useGetScenarios() {
  const { actor, isFetching } = useActor();
  return useQuery<Scenario[]>({
    queryKey: ["scenarios"],
    queryFn: async () => {
      if (!actor) return generateMockScenarios();
      try {
        const result = await actor.getScenarios();
        return result.length > 0 ? result : generateMockScenarios();
      } catch {
        return generateMockScenarios();
      }
    },
    enabled: !isFetching,
    placeholderData: generateMockScenarios(),
  });
}

export function useSaveScenario() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      params,
    }: { name: string; params: Scenario }) => {
      if (!actor) return;
      await actor.saveScenario(name, params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scenarios"] });
    },
  });
}

// Recommendations
export function useAcceptRecommendation() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) return;
      await actor.acceptRecommendation(id);
    },
  });
}

export function useRejectRecommendation() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) return;
      await actor.rejectRecommendation(id);
    },
  });
}

export function useModifyRecommendation() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ id, msg }: { id: string; msg: string }) => {
      if (!actor) return;
      await actor.modifyRecommendation(id, msg);
    },
  });
}
