  "use server";

  // import { userSession } from "@/libs/auth-libs";
  import { auth } from "@/lib/auth";
  import HomePageClient from "@/components/HomePageClient";
  import "./globals.css";
  import prisma from "@/libs/prisma"


  export default async function HomePage() {
    // const user = await userSession();
    const session = await auth();

    let user = null;
    if (session) {
      user = await prisma?.user.findUnique({
        where: {
          id: session.user?.id,
        },
      });
    }

    return <HomePageClient user={user} session={session} />;
  }
