import { NextRequest, NextResponse } from "next/server";
import { generateTestData, clearTestData } from "@/lib/test-data";

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === "generate") {
      await generateTestData();
      return NextResponse.json({
        success: true,
        message: "Demo data ready",
      });
    } else if (action === "clear") {
      await clearTestData();
      return NextResponse.json({
        success: true,
        message: "Demo data cleared",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Test data API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
