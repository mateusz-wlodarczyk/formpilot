import { prisma } from "@/lib/prisma/prisma";

export async function POST(req: Request) {
  const data = await req.json();
  const form = await prisma.form.create({
    data,
  });
  return new Response(JSON.stringify(form), { status: 201 });
}

export async function PUT(req: Request) {
  const data = await req.json();
  const { id, ...updates } = data;
  const form = await prisma.form.update({
    where: { id },
    data: updates,
  });
  return new Response(JSON.stringify(form), { status: 200 });
}
