"use server";
import prisma from "@/libs/prisma";
import { revalidatePath } from "next/cache";

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { email: "asc" },
  });
}

export async function updateUserRole(userId: string, newRole: "USER" | "ADMIN") {
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });
  revalidatePath("/ProfileUsers");
}
