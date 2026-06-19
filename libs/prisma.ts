import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/prisma/generated/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const createClient = () => {
  const dbUrl = process.env.DATABASE_URL?.replace("mysql://", "mariadb://") || "";
  return new PrismaClient({ adapter: new PrismaMariaDb(dbUrl) });
};

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
