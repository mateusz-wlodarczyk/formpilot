import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { TEST_USER_ID } from "@/lib/test-data";
import { updateFormLogic } from "@/lib/forms-logic";

// Helper function to get user ID from session or test mode
export async function getUserIdFromRequest(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    return user?.id;
  }

  const testUserHeader = req.headers.get("x-test-user");
  if (testUserHeader === "true") {
    const testUser = await prisma.user.findUnique({
      where: { id: TEST_USER_ID },
    });
    return testUser?.id;
  }

  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    const userId = await getUserIdFromRequest(req);

    // Try to find the form
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        submissions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // If user is authenticated and owns the form, return full data
    if (userId && form.userId === userId) {
      return NextResponse.json(form);
    }

    // If form is inactive, require authentication
    if (!form.isActive) {
      return NextResponse.json(
        { error: "Form not available" },
        { status: 403 }
      );
    }

    // For public access to active forms, return form without submissions
    const { submissions, ...publicForm } = form;
    return NextResponse.json(publicForm);
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    const userId = await getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Check if user owns the form
    const existingForm = await prisma.form.findUnique({
      where: { id: formId },
    });

    if (!existingForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (existingForm.userId !== userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const updatedForm = await prisma.form.update({
      where: { id: formId },
      data: {
        title: body.title,
        description: body.description,
        fields: body.fields,
      },
      include: {
        submissions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    const userId = await getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user owns the form
    const existingForm = await prisma.form.findUnique({
      where: { id: formId },
    });

    if (!existingForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (existingForm.userId !== userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Delete form and all its submissions
    await prisma.submission.deleteMany({
      where: { formId },
    });

    await prisma.form.delete({
      where: { id: formId },
    });

    return NextResponse.json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isActive } = await req.json();

    // Check if form belongs to user
    const existingForm = await prisma.form.findFirst({
      where: { id: formId, userId },
    });

    if (!existingForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const updatedForm = await prisma.form.update({
      where: { id: formId },
      data: { isActive },
      select: {
        id: true,
        title: true,
        description: true,
        isActive: true,
        createdAt: true,
        _count: { select: { submissions: true } },
      },
    });

    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error("Error updating form status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
