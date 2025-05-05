import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a vehicle with one violation
  const vehicle = await prisma.vehicle.create({
    data: {
      plate: "QTR123",
      owner: "Saja Abdelmalik",
      violations: {
        create: [
          {
            category: "Speeding",
            date: new Date("2025-05-01"),
            paid: false,
          },
          {
            category: "Red Light",
            date: new Date("2025-05-03"),
            paid: true,
          },
        ],
      },
    },
  })

  console.log("🚗 Seeded vehicle with violations:", vehicle)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
