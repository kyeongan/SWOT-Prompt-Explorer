import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerateInsightRequest {
  prompt: string;
  segment: string;
  product: string;
  objective: string;
  promptType: string;
}

export interface GenerateInsightResponse {
  content: string;
  timestamp: string;
}

export async function generateInsight(
  request: GenerateInsightRequest
): Promise<GenerateInsightResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a strategic marketing analyst. Provide clear, actionable insights for SWOT analysis. 
          Format your response with bullet points or numbered lists when appropriate. 
          Be specific and practical in your recommendations.
          Keep responses concise but comprehensive (3-5 key points).`,
        },
        {
          role: "user",
          content: request.prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content =
      completion.choices[0]?.message?.content || "No response generated.";

    return {
      content,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error generating insight:", error);
    throw new Error(
      "Failed to generate insight. Please check your API key and try again."
    );
  }
}
