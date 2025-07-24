import { NextRequest, NextResponse } from "next/server";
import { generateInsight, GenerateInsightRequest } from "@/lib/openai";
import { rateLimit, isDemoMode, getClientIP } from "@/lib/rate-limit";

// Rate limiter instance
const limiter = rateLimit({
  limit: isDemoMode() ? 5 : 20, // Lower limit in demo mode
  window: 60 * 1000, // 1 minute window
});

// Demo responses for when API is rate limited
const demoResponses = {
  strengths:
    "• Strong brand recognition\n• Innovative product features\n• Experienced team\n• Loyal customer base",
  weaknesses:
    "• Limited market presence\n• Higher pricing compared to competitors\n• Resource constraints\n• Technical limitations",
  opportunities:
    "• Growing market demand\n• Emerging technologies\n• Strategic partnerships\n• International expansion",
  threats:
    "• Increasing competition\n• Economic uncertainty\n• Regulatory changes\n• Market saturation",
};

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = limiter.check(clientIP);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        {
          status: 429,
          headers: {
            "X-RateLimit-Reset": rateLimitResult.reset?.toString() || "",
          },
        }
      );
    }

    const body: GenerateInsightRequest = await request.json();

    // Validate required fields
    if (
      !body.prompt ||
      !body.segment ||
      !body.product ||
      !body.objective ||
      !body.promptType
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In demo mode, return mock data after a short delay
    if (isDemoMode()) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      const mockResponse =
        demoResponses[body.promptType as keyof typeof demoResponses] ||
        "Demo insight for " + body.promptType;

      return NextResponse.json({
        insight: mockResponse,
        usage: { total_tokens: 50 }, // Mock usage
      });
    }

    const response = await generateInsight(body);

    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
