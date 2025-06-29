import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { TEST_USER_ID } from "@/lib/test-data";
import {
  createFormLogic,
  getFormsLogic,
  updateFormLogic,
} from "@/lib/forms-logic";

// Helper function to get user ID from session or test mode
export async function getUserIdFromRequest(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // If we have a real session, use that user
  if (session?.user?.email) {
    console.log("Session found:", {
      email: session.user.email,
      id: session.user.id,
    });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user) {
      console.log("User found in database:", user.id);
      return user.id;
    } else {
      console.log("User not found in database for email:", session.user.email);
    }
  } else {
    console.log("No session or no email in session");
  }

  // Check if this is a test mode request
  const testUserHeader = req.headers.get("x-test-user");
  if (testUserHeader === "true") {
    const testUser = await prisma.user.findUnique({
      where: { id: TEST_USER_ID },
    });
    return testUser?.id;
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();
    const form = await createFormLogic({ userId, data });
    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const page = Number(req.nextUrl.searchParams.get("page") || 0);

    // Use larger pageSize for test mode to show all test forms
    const testUserHeader = req.headers.get("x-test-user");
    const defaultPageSize = testUserHeader === "true" ? 100 : 20;
    const pageSize = Number(
      req.nextUrl.searchParams.get("pageSize") || defaultPageSize
    );

    const forms = await getFormsLogic({ userId, page, pageSize });
    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();
    const { id, ...updates } = data;
    const form = await updateFormLogic({ userId, id, updates });
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }
    return NextResponse.json(form);
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
