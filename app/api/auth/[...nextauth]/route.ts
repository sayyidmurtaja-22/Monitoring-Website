import {handlers} from "@/lib/auth";

export const {GET, POST } = handlers;


import NextAuth from "next-auth";
import Google from "next-auth/providers/google";// import credensial dari google 

export const authOption = {// menkonfigurasi dari authentication dari google
    providers: [
        Google({
            clientId:process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret:process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],
    secret:process.env.NEXTAUTH_SECRET as string
}

const handler = NextAuth(authOption);
export {handler as GET, handler as POST};

