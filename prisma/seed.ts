import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing takes
  await prisma.take.deleteMany();

  // Seed sample takes
  await prisma.take.createMany({
    data: [
      {
        author: "alex",
        text: "Lakers win the Western Conference this year",
        confidence: "BOLD",
        result: "OPEN"
      },
      {
        author: "alex",
        text: "Mahomes throws 4+ TDs this Sunday",
        confidence: "NORMAL",
        result: "HIT"
      },
      {
        author: "demo",
        text: "Yankees make the playoffs",
        confidence: "HUNCH",
        result: "MISS"
      },
      {
        author: "demo",
        text: "Ohtani hits 50 HRs this season",
        confidence: "BOLD",
        result: "HIT"
      },
      {
        author: "alex",
        text: "Chiefs go undefeated in the regular season",
        confidence: "HUNCH",
        result: "OPEN"
      }
    ]
  });

  console.log("✅ Seeded 5 sample takes!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

