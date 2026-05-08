import { auth } from "@/lib/auth";
import { type User } from "next-auth";


export const userSession = async (): Promise<User | null> => {
  const session = await auth();

  if (!session?.user) return null;

  return {
    id: (session.user as any).id || "",
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
};
