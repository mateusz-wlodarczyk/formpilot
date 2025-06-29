import { prisma } from "@/lib/prisma/prisma";

export async function createFormLogic({
  userId,
  data,
}: {
  userId: string;
  data: any;
}) {
  return prisma.form.create({
    data: {
      title: data.title,
      description: data.description,
      fields: data.fields || [],
      userId: userId,
    },
  });
}

export async function getFormsLogic({
  userId,
  page,
  pageSize,
}: {
  userId: string;
  page: number;
  pageSize: number;
}) {
  return prisma.form.findMany({
    where: { userId: userId },
    select: {
      id: true,
      title: true,
      description: true,
      isActive: true,
      createdAt: true,
      _count: { select: { submissions: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: page * pageSize,
    take: pageSize,
  });
}

export async function updateFormLogic({
  userId,
  id,
  updates,
}: {
  userId: string;
  id: string;
  updates: any;
}) {
  // Check if form belongs to user
  const existingForm = await prisma.form.findFirst({
    where: { id, userId: userId },
  });
  if (!existingForm) return null;
  return prisma.form.update({
    where: { id },
    data: updates,
  });
}
