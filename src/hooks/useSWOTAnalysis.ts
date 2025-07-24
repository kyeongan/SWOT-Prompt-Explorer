import { useState, useCallback } from "react";
import { SWOTResponse, Product, BusinessObjective, Segment } from "@/types";

interface UseSWOTAnalysisReturn {
  responses: SWOTResponse[];
  isGenerating: boolean;
  generateInsight: (
    product: Product,
    objective: BusinessObjective,
    segment: Segment,
    promptTypeId: string,
    prompt: string
  ) => Promise<void>;
  clearResponses: () => void;
  getResponseByKeys: (
    segmentId: string,
    promptTypeId: string
  ) => SWOTResponse | undefined;
}

export function useSWOTAnalysis(): UseSWOTAnalysisReturn {
  const [responses, setResponses] = useState<SWOTResponse[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInsight = useCallback(
    async (
      product: Product,
      objective: BusinessObjective,
      segment: Segment,
      promptTypeId: string,
      prompt: string
    ) => {
      setIsGenerating(true);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            segment: segment.name,
            product: product.name,
            objective: objective.name,
            promptType: promptTypeId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate insight");
        }

        const data = await response.json();

        const newResponse: SWOTResponse = {
          id: `${segment.id}-${promptTypeId}-${Date.now()}`,
          segmentId: segment.id,
          promptTypeId,
          content: data.content,
          timestamp: data.timestamp,
          product: product.name,
          objective: objective.name,
        };

        setResponses((prev) => {
          // Remove any existing response for this segment + prompt type combination
          const filtered = prev.filter(
            (r) =>
              !(r.segmentId === segment.id && r.promptTypeId === promptTypeId)
          );
          return [...filtered, newResponse];
        });
      } catch (error) {
        console.error("Error generating insight:", error);
        throw error;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const clearResponses = useCallback(() => {
    setResponses([]);
  }, []);

  const getResponseByKeys = useCallback(
    (segmentId: string, promptTypeId: string) => {
      return responses.find(
        (r) => r.segmentId === segmentId && r.promptTypeId === promptTypeId
      );
    },
    [responses]
  );

  return {
    responses,
    isGenerating,
    generateInsight,
    clearResponses,
    getResponseByKeys,
  };
}
