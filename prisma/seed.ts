import { PrismaClient, Difficulty, Role } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import signsData from "../src/data/signs.json";
import categoriesData from "../src/data/categories.json";
import { importPublicSigns } from "./import-public-signs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

function isNonBlockingPublicImportError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");

  return message.includes("Permission denied") || message.includes("EACCES");
}

function shouldSkipPublicImport(): boolean {
  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  const optimizedDir = path.join(process.cwd(), "public", "signs", "optimized");
  return existsSync(optimizedDir) && readdirSync(optimizedDir).length > 0;
}

async function main() {
  // 1. Seed categories (skip "all" pseudo-category)
  for (const cat of categoriesData) {
    if (cat.id === "all") continue;
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { labelEn: cat.labelEn, labelAr: cat.labelAr },
      create: { id: cat.id, labelEn: cat.labelEn, labelAr: cat.labelAr },
    });
  }

  // 2. Seed signs
  for (const sign of signsData) {
    await prisma.sign.upsert({
      where: { id: sign.id },
      update: {
        word: sign.word,
        wordAr: sign.wordAr,
        wordFr: sign.wordFr,
        categoryId: sign.category,
        difficulty: sign.difficulty as Difficulty,
        difficultyStars: sign.difficultyStars,
        thumbnail: sign.thumbnail,
        videoUrl: sign.videoUrl,
        videoDuration: sign.videoDuration,
      },
      create: {
        id: sign.id,
        word: sign.word,
        wordAr: sign.wordAr,
        wordFr: sign.wordFr,
        categoryId: sign.category,
        difficulty: sign.difficulty as Difficulty,
        difficultyStars: sign.difficultyStars,
        thumbnail: sign.thumbnail,
        videoUrl: sign.videoUrl,
        videoDuration: sign.videoDuration,
      },
    });
  }

  // 3. Import and optimize signs from the public folder.
  if (shouldSkipPublicImport()) {
    console.log("Skipping public sign import because optimized assets already exist.");
  } else {
    try {
      await importPublicSigns(prisma);
    } catch (error) {
      if (!isNonBlockingPublicImportError(error)) {
        throw error;
      }

      console.warn(
        "Skipping public sign import because the optimized asset directory is not writable in this environment."
      );
    }
  }

  // 4. Seed admin user
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: { email: adminEmail.toLowerCase() },
      update: {
        hashedPassword,
        role: Role.admin,
      },
      create: {
        name: "Admin",
        email: adminEmail.toLowerCase(),
        hashedPassword,
        role: Role.admin,
      },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
