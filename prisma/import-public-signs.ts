import "dotenv/config";

import { createHash } from "node:crypto";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

import { PrismaPg } from "@prisma/adapter-pg";
import sharp from "sharp";

import { Difficulty, PrismaClient } from "./generated/client";

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");
const optimizedDir = path.join(publicDir, "signs", "optimized");

const IMPORT_CATEGORIES = [
  { id: "family", labelEn: "Family", labelAr: "العائلة" },
  { id: "verbs", labelEn: "Verbs", labelAr: "الأفعال" },
  { id: "places", labelEn: "Places", labelAr: "الأماكن" },
  { id: "people", labelEn: "People", labelAr: "الأشخاص" },
  { id: "general", labelEn: "General", labelAr: "عام" },
] as const;

const familyKeywords = [
  "أب",
  "أم",
  "ابن",
  "بنت",
  "أخت",
  "اخت",
  "أخ",
  "اخ",
  "جد",
  "جدة",
  "حفيد",
  "حفيدة",
  "خال",
  "خالة",
  "عم",
  "عمة",
  "عائلة",
];

const placeKeywords = ["المدينة", "مدينة", "وسط المدينة", "منزل", "الوطن"];
const peopleKeywords = ["ملك", "مواطن"];
const verbKeywords = ["عرف", "فخور"];

function sanitizeLabel(value: string) {
  return value
    .replace(/^Adobe Express\s*-\s*/i, "")
    .replace(/\(lsf\)/gi, "")
    .replace(/\(\d+\)/g, "")
    .replace(/[+_]/g, " ")
    .replace(/[()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

function inferCategory(label: string) {
  if (familyKeywords.some((keyword) => label.includes(keyword))) {
    return "family";
  }

  if (placeKeywords.some((keyword) => label.includes(keyword))) {
    return "places";
  }

  if (peopleKeywords.some((keyword) => label.includes(keyword))) {
    return "people";
  }

  if (verbKeywords.some((keyword) => label.includes(keyword))) {
    return "verbs";
  }

  return "general";
}

function inferDifficulty(label: string): Difficulty {
  if (label.includes("او") || label.includes("وسط")) {
    return "intermediate";
  }

  if (label.length >= 18) {
    return "advanced";
  }

  return "beginner";
}

function difficultyStarsFor(difficulty: Difficulty) {
  if (difficulty === "advanced") return 3;
  if (difficulty === "intermediate") return 2;
  return 1;
}

function formatDuration(totalMs: number) {
  const safeMs = Number.isFinite(totalMs) && totalMs > 0 ? totalMs : 0;
  const totalSeconds = Math.max(1, Math.round(safeMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

async function collectGifFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (fullPath === optimizedDir) {
          return [];
        }

        return collectGifFiles(fullPath);
      }

      if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".gif") {
        return [fullPath];
      }

      return [];
    })
  );

  return nestedFiles.flat();
}

export async function importPublicSigns(prisma: PrismaClient) {
  await mkdir(optimizedDir, { recursive: true });

  for (const category of IMPORT_CATEGORIES) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: { labelEn: category.labelEn, labelAr: category.labelAr },
      create: category,
    });
  }

  const inputFiles = await collectGifFiles(publicDir);
  const imported: Array<{ label: string; outputPath: string; bytesSaved: number }> = [];

  for (const inputFile of inputFiles) {
    const baseName = path.basename(inputFile, path.extname(inputFile));
    const label = sanitizeLabel(baseName);
    const hash = createHash("sha1")
      .update(path.relative(publicDir, inputFile))
      .digest("hex")
      .slice(0, 10);
    const slug = slugify(label) || "sign";
    const outputName = `${slug}-${hash}.gif`;
    const outputFile = path.join(optimizedDir, outputName);
    const publicAssetPath = `/signs/optimized/${outputName}`;

    const image = sharp(inputFile, { animated: true });
    const metadata = await image.metadata();
    const totalDelay =
      metadata.delay?.reduce((sum, frameDelay) => sum + frameDelay, 0) ?? 0;

    const optimizedBuffer = await image
      .resize({
        width: 480,
        height: 480,
        fit: "inside",
        withoutEnlargement: true,
      })
      .gif({
        colours: 64,
        effort: 10,
        dither: 0.8,
        interFrameMaxError: 8,
        interPaletteMaxError: 24,
        reuse: true,
      })
      .toBuffer();

    await sharp(optimizedBuffer, { animated: true }).toFile(outputFile);

    const difficulty = inferDifficulty(label);
    const categoryId = inferCategory(label);
    const signId = `public-sign-${hash}`;

    await prisma.sign.upsert({
      where: { id: signId },
      update: {
        word: label,
        wordAr: label,
        wordFr: label,
        categoryId,
        difficulty,
        difficultyStars: difficultyStarsFor(difficulty),
        thumbnail: publicAssetPath,
        videoUrl: publicAssetPath,
        videoDuration: formatDuration(totalDelay),
      },
      create: {
        id: signId,
        word: label,
        wordAr: label,
        wordFr: label,
        categoryId,
        difficulty,
        difficultyStars: difficultyStarsFor(difficulty),
        thumbnail: publicAssetPath,
        videoUrl: publicAssetPath,
        videoDuration: formatDuration(totalDelay),
      },
    });

    imported.push({
      label,
      outputPath: publicAssetPath,
      bytesSaved: Math.max(0, (metadata.size ?? 0) - optimizedBuffer.length),
    });
  }

  return imported;
}

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Scanning public GIFs and importing optimized signs...");
    const imported = await importPublicSigns(prisma);
    const totalSaved = imported.reduce((sum, item) => sum + item.bytesSaved, 0);

    console.log(
      `Imported ${imported.length} public sign(s) and saved ${Math.round(
        totalSaved / 1024
      )} KB after optimization.`
    );
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1]?.includes("import-public-signs.ts")) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
