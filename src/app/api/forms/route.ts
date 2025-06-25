import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth/auth";

export async function POST(req: NextRequest) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const data = await req.json();

    // Pobierz użytkownika
    // const user = await prisma.user.findUnique({
    //   where: { email: session.user.email }
    // });

    // if (!user) {
    //   return NextResponse.json({ error: "User not found" }, { status: 404 });
    // }

    const form = await prisma.form.create({
      data: {
        title: data.title,
        description: data.description,
        fields: data.fields || [],
        userId: "temp-user-id", // Tymczasowe ID
      },
    });

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
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const user = await prisma.user.findUnique({
    //   where: { email: session.user.email }
    // });

    // if (!user) {
    //   return NextResponse.json({ error: "User not found" }, { status: 404 });
    // }

    const forms = await prisma.form.findMany({
      // where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

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
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const data = await req.json();
    const { id, ...updates } = data;

    // const user = await prisma.user.findUnique({
    //   where: { email: session.user.email }
    // });

    // if (!user) {
    //   return NextResponse.json({ error: "User not found" }, { status: 404 });
    // }

    // Sprawdź czy formularz należy do użytkownika
    // const existingForm = await prisma.form.findFirst({
    //   where: { id, userId: user.id }
    // });

    // if (!existingForm) {
    //   return NextResponse.json({ error: "Form not found" }, { status: 404 });
    // }

    const form = await prisma.form.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
