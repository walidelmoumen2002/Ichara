import { getCategories } from "@/lib/actions/categories";
import { QuizGame } from "@/components/practice/quiz-game";

export default async function PracticePage() {
  const categories = await getCategories();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
      <QuizGame categories={categories} />
    </div>
  );
}
