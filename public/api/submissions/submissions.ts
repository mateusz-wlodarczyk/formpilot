import { prisma } from "../../../src/lib/prisma/prisma";

export async function POST(req: Request) {
  const data = await req.json();
  const submission = await prisma.submission.create({
    data,
  });
  return new Response(JSON.stringify(submission), { status: 201 });
}
