import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MaterialIcon } from "@/components/shared/material-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSigns } from "@/lib/actions/signs";
import { getCategories } from "@/lib/actions/categories";

const categoryIcons: Record<string, string> = {
  greetings: "waving_hand",
  family: "family_restroom",
  numbers: "pin",
  verbs: "directions_run",
  colors: "palette",
};

export default async function LessonsPage() {
  const t = await getTranslations("Lessons");
  const tCat = await getTranslations("Categories");
  const locale = await getLocale();

  const [signs, categories] = await Promise.all([
    getSigns(),
    getCategories(),
  ]);

  const realCategories = categories.filter((c) => c.id !== "all");

  const lessonsWithData = realCategories.map((cat) => {
    const categorySigns = signs.filter((s) => s.category === cat.id);
    const previewSigns = categorySigns.slice(0, 3);
    return {
      ...cat,
      signCount: categorySigns.length,
      previewSigns,
    };
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="space-y-2 mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessonsWithData.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/lessons/${lesson.id}`}
            className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/40"
          >
            {/* Preview thumbnails */}
            <div className="relative h-40 bg-muted overflow-hidden">
              {lesson.previewSigns.length > 0 ? (
                <div className="flex h-full">
                  {lesson.previewSigns.map((sign, i) => (
                    <div key={sign.id} className="relative flex-1 overflow-hidden">
                      <Image
                        src={sign.thumbnail}
                        alt={sign.word}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      {i < lesson.previewSigns.length - 1 && (
                        <div className="absolute inset-y-0 end-0 w-px bg-background/50 z-10" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <MaterialIcon name={categoryIcons[lesson.id] ?? "category"} className="text-4xl text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 start-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur text-white">
                  <MaterialIcon name={categoryIcons[lesson.id] ?? "category"} className="text-base" />
                </div>
                <span className="text-white font-bold text-lg drop-shadow">
                  {locale === "ar" ? lesson.labelAr : lesson.labelEn}
                </span>
              </div>
            </div>

            {/* Card body */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary">
                  <MaterialIcon name="sign_language" className="text-xs me-1" />
                  {t("signsCount", { count: lesson.signCount })}
                </Badge>
              </div>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">
                {t("startLesson")}
                <MaterialIcon name="arrow_forward" className="text-base ms-1 rtl:rotate-180" />
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
