"use client";

import { useState, useCallback } from "react";
import { SWOTResponse, Product, BusinessObjective, Segment } from "@/types";

interface UseSWOTAnalysisReturn {
  responses: SWOTResponse[];
  isGenerating: boolean;
  error: string | null;
  remainingRequests: number;
  totalRequests: number;
  estimatedCost: number;
  generateInsight: (
    product: Product,
    objective: BusinessObjective,
    segment: Segment,
    promptTypeId: string,
    prompt: string
  ) => Promise<void>;
  clearResponses: () => void;
  clearError: () => void;
  getResponseByKeys: (
    segmentId: string,
    promptTypeId: string
  ) => SWOTResponse | undefined;
}

export function useEnhancedSWOTAnalysis(): UseSWOTAnalysisReturn {
  const [responses, setResponses] = useState<SWOTResponse[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingRequests, setRemainingRequests] = useState(10); // Default rate limit
  const [totalRequests, setTotalRequests] = useState(0);

  const generateInsight = useCallback(
    async (
      product: Product,
      objective: BusinessObjective,
      segment: Segment,
      promptTypeId: string,
      prompt: string
    ) => {
      if (isGenerating) return;

      setIsGenerating(true);
      setError(null);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            segment: segment.name,
            product: product.name,
            objective: objective.name,
            promptType: promptTypeId,
          }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            const resetHeader = response.headers.get("X-RateLimit-Reset");
            const resetTime = resetHeader
              ? parseInt(resetHeader)
              : Date.now() + 60000;
            const timeLeft = Math.ceil((resetTime - Date.now()) / 1000);
            throw new Error(
              `Rate limit exceeded. Please wait ${timeLeft} seconds before trying again.`
            );
          }
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate insight");
        }

        const data = await response.json();

        const newResponse: SWOTResponse = {
          id: `${segment.id}-${promptTypeId}-${Date.now()}`,
          segmentId: segment.id,
          promptTypeId,
          content: data.insight || data.content || "No insight generated",
          timestamp: new Date().toISOString(),
          product: product.name,
          objective: objective.name,
        };

        setResponses((prev) => {
          const filtered = prev.filter(
            (r) =>
              !(r.segmentId === segment.id && r.promptTypeId === promptTypeId)
          );
          return [...filtered, newResponse];
        });

        // Update tracking
        setTotalRequests((prev) => prev + 1);
        setRemainingRequests((prev) => Math.max(0, prev - 1));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        console.error("Error generating insight:", err);
      } finally {
        setIsGenerating(false);
      }
    },
    [isGenerating]
  );

  const clearResponses = useCallback(() => {
    setResponses([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getResponseByKeys = useCallback(
    (segmentId: string, promptTypeId: string) => {
      return responses.find(
        (r) => r.segmentId === segmentId && r.promptTypeId === promptTypeId
      );
    },
    [responses]
  );

  // Calculate estimated cost (rough estimate: $0.002 per 1K tokens, assuming ~100 tokens per request)
  const estimatedCost = totalRequests * 0.0002;

  return {
    responses,
    isGenerating,
    error,
    remainingRequests,
    totalRequests,
    estimatedCost,
    generateInsight,
    clearResponses,
    clearError,
    getResponseByKeys,
  };
}
