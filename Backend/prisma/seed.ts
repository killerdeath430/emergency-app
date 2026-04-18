import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashed = await bcrypt.hash("123456", 10);
  
  const existing = await prisma.user.findUnique({ 
    where: { email: "aiims@test.com" } 
  });
  
  if (existing) {
    console.log("Hospital already exists ✅");
    return;
  }

  const user = await prisma.user.create({
    data: {
      name: "AIIMS Patna",
      email: "aiims@test.com",
      password: hashed,
      role: "HOSPITAL",
    },
  });

  await prisma.hospital.create({
    data: {
      name: "AIIMS Patna",
      address: "Patna, Bihar",
      lat: 25.5941,
      lng: 85.1376,
      phone: "9999999999",
      userId: user.id,
    },
  });

  console.log("Seeded successfully ✅");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());