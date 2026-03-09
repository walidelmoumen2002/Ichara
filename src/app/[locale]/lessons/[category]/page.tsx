import { getSigns } from "@/lib/actions/signs";
import { getCategories } from "@/lib/actions/categories";
import { LessonDetailClient } from "@/components/lessons/lesson-detail-client";

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const [signs, categories] = await Promise.all([
    getSigns(),
    getCategories(),
  ]);

  return (
    <LessonDetailClient
      categoryId={category}
      allSigns={signs}
      categories={categories}
    />
  );
}
