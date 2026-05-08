import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import {PrismaAdapter} from "@auth/prisma-adapter"
import prisma from "@/libs/prisma"; 


export const { handlers, auth, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),
    trustHost: true,
    providers:[
        Google({
            clientId:process.env.GOOGLE_CLIENT_ID as string,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    secret:process.env.NEXTAUTH_SECRET,
})