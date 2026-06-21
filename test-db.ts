import { PrismaClient } from "./prisma/generated/index.js";

const prisma = new PrismaClient();

async function main() {
  const countPangandaran = await prisma.aws_pangandaran.count();
  const countBali = await prisma.aws_bali.count();
  const countPadang = await prisma.aws_bungus.count();
  
  console.log("Pangandaran rows:", countPangandaran);
  console.log("Bali rows:", countBali);
  console.log("Padang rows:", countPadang);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
