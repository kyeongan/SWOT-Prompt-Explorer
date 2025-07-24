import { NextRequest, NextResponse } from "next/server";
import { generateInsight, GenerateInsightRequest } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
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
