import { prisma } from "@/database/prisma";
import { Roles } from "@prisma/client";

export async function seed() {
  await prisma.role.createMany({
    data: [
      { name: Roles.ADMIN },
      { name: Roles.USER },
      { name: Roles.GUEST }
    ]
  })
}

seed().then(() => {
  console.log("🌱  The seed command has been executed.")
  prisma.$disconnect();
}).catch((error) => {
  console.error("⚠️ Error seeding database:", error);
  prisma.$disconnect();
});
