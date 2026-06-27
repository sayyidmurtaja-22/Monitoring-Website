  // import { userSession } from "@/libs/auth-libs";
  import { auth } from "@/lib/auth";
  import HomePageClient from "@/app/HomePageClient";
  import "./globals.css";
  import prisma from "@/libs/prisma"


  export default async function HomePage() {
    // const user = await userSession();
    const session = await auth();

    let user = null;
    if (session?.user) {
      try {
        if (session.user.id) {
          user = await prisma?.user.findUnique({
            where: {
              id: session.user.id,
            },
          });
        } else if (session.user.email) {
          user = await prisma?.user.findUnique({
            where: {
              email: session.user.email,
            },
          });
        }
      } catch (error) {
        console.error("Gagal terhubung ke database:", error);
        user = null;
      }
    }

    return <HomePageClient user={user} session={session} />;
  }
