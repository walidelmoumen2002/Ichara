"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MaterialIcon } from "@/components/shared/material-icon";
import { Button } from "@/components/ui/button";
import type { QuizResultRow } from "@/lib/actions/quiz";

interface QuizHistoryProps {
  results: QuizResultRow[];
}

function formatTime(
  seconds: number,
  t: ReturnType<typeof useTranslations>
): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return t("quizTime", { minutes: mins, seconds: secs });
}

function formatDate(date: string, locale: string): string {
  return new Date(date).toLocaleDateString(locale === "ar" ? "ar-MA" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getScoreColor(score: number): string {
  if (score === 100) return "text-amber-500";
  if (score >= 75) return "text-green-600 dark:text-green-400";
  if (score >= 50) return "text-blue-600 dark:text-blue-400";
  return "text-red-600 dark:text-red-400";
}

function getScoreBg(score: number): string {
  if (score === 100) return "bg-amber-50 dark:bg-amber-900/20";
  if (score >= 75) return "bg-green-50 dark:bg-green-900/20";
  if (score >= 50) return "bg-blue-50 dark:bg-blue-900/20";
  return "bg-red-50 dark:bg-red-900/20";
}

export function QuizHistory({ results }: QuizHistoryProps) {
  const t = useTranslations("Dashboard");
  const tc = useTranslations("Categories");
  const locale = useLocale();

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MaterialIcon name="quiz" className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            {t("quizHistoryTitle")}
          </h2>
        </div>
        <Button variant="outline" size="sm" className="font-bold" asChild>
          <Link href="/practice">
            <MaterialIcon name="play_arrow" className="me-1 text-base" />
            {t("startPractice")}
          </Link>
        </Button>
      </div>

      {results.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          {t("noQuizHistory")}
        </p>
      ) : (
        <div className="space-y-3">
          {results.map((result) => {
            const categoryLabel = result.category
              ? tc(result.category)
              : t("quizCategoryAll");

            return (
              <div
                key={result.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                {/* Score badge */}
                <div
                  className={`shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center ${getScoreBg(result.score)}`}
                >
                  <span
                    className={`text-lg font-extrabold leading-none ${getScoreColor(result.score)}`}
                  >
                    {result.score}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${getScoreColor(result.score)} opacity-70`}
                  >
                    %
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-foreground truncate">
                      {categoryLabel}
                    </span>
                    {result.score === 100 && (
                      <MaterialIcon
                        name="emoji_events"
                        className="text-amber-500 text-base shrink-0"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      {t("quizDetails", {
                        correct: result.totalCorrect,
                        total: result.totalQuestions,
                      })}
                    </span>
                    <span className="text-border">|</span>
                    <span>
                      {t("quizRounds", { count: result.totalRounds })}
                    </span>
                    {result.timeSpent > 0 && (
                      <>
                        <span className="text-border">|</span>
                        <span>{formatTime(result.timeSpent, t)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Date */}
                <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                  {formatDate(result.completedAt as unknown as string, locale)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
