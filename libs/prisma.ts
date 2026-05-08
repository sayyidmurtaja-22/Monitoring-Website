import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/prisma/generated/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const createClient = () =>
  new PrismaClient({ adapter: new PrismaMariaDb(process.env.DATABASE_URL!) });

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = createClient();
} else {
  if (!global.prisma) {
    global.prisma = createClient();
  }
  prisma = global.prisma;
}

export default prisma;
