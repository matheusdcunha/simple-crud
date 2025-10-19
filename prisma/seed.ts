import { prisma } from "@/database/prisma";
import { Roles } from "@/generated/prisma";

async function seed(){
  await prisma.role.createMany({
    data:[
      {name: Roles.ADMIN},
      {name: Roles.USER},
      {name: Roles.GUEST}
    ]
  })
}

seed().then(()=>{
  prisma.$disconnect();
}).catch((error) => {
  console.error("⚠️ Error seeding database:", error);
  prisma.$disconnect();
});
