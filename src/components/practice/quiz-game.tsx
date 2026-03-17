"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MaterialIcon } from "@/components/shared/material-icon";
import { fetchQuizSigns, saveQuizResult } from "@/lib/actions/quiz";
import { markSignAsLearned } from "@/lib/actions/progress";
import type { Sign } from "@/types/sign";
import type { Category } from "@/types/category";

// ─── Types ───────────────────────────────────────────────────

interface QuizMatch {
  signId: string;
  assignedWord: string | null;
  isCorrect: boolean | null;
}

type GamePhase = "setup" | "playing" | "checking" | "roundResult" | "finished";

// ─── Draggable Word Component ────────────────────────────────

function DraggableWord({
  id,
  word,
  isPlaced,
  disabled,
}: {
  id: string;
  word: string;
  isPlaced: boolean;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: disabled || isPlaced,
  });

  if (isPlaced) {
    return (
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 p-4 rounded-lg opacity-40">
        <span className="font-bold text-lg text-slate-400">{word}</span>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`group cursor-grab active:cursor-grabbing bg-white dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md p-4 rounded-lg transition-all flex items-center justify-between ${isDragging ? "opacity-50 scale-95" : ""
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      <span className="font-bold text-lg text-slate-800 dark:text-white">
        {word}
      </span>
      <MaterialIcon
        name="drag_indicator"
        className="text-slate-300 group-hover:text-primary transition-colors"
      />
    </div>
  );
}

// ─── Drop Zone Component ─────────────────────────────────────

function DropZone({
  id,
  sign,
  locale,
  assignedWord,
  isCorrect,
  checked,
  onRemove,
  t,
  disabled,
}: {
  id: string;
  sign: Sign;
  locale: string;
  assignedWord: string | null;
  isCorrect: boolean | null;
  checked: boolean;
  onRemove: (signId: string) => void;
  t: ReturnType<typeof useTranslations>;
  disabled: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({ id, disabled });

  const borderColor = checked
    ? isCorrect
      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
      : "border-red-500 bg-red-50 dark:bg-red-900/20"
    : isOver
      ? "border-primary bg-primary/5"
      : assignedWord
        ? "border-primary/40 bg-primary/5"
        : "border-slate-300 dark:border-slate-600 hover:border-primary hover:bg-primary/5";

  return (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-soft border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
      {/* Thumbnail */}
      <div className="w-full sm:w-48 aspect-video sm:aspect-[4/3] rounded-lg overflow-hidden relative bg-slate-200 dark:bg-slate-700 group shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url('${sign.thumbnail}')` }}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          {sign.videoUrl && sign.videoUrl !== "#" ? (
            <a
              href={sign.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MaterialIcon name="play_arrow" />
            </a>
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              <MaterialIcon name="image" />
            </div>
          )}
        </div>
      </div>

      {/* Drop target */}
      <div ref={setNodeRef} className="flex-1 flex flex-col justify-center">
        {assignedWord ? (
          <div
            className={`h-16 w-full border-2 ${borderColor} rounded-lg flex items-center justify-between px-4 transition-all`}
          >
            <span
              className={`font-bold text-lg ${checked
                ? isCorrect
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-700 dark:text-red-400"
                : "text-primary"
                }`}
            >
              {assignedWord}
            </span>
            <div className="flex items-center gap-2">
              {checked && (
                <MaterialIcon
                  name={isCorrect ? "check_circle" : "cancel"}
                  className={`text-xl ${isCorrect ? "text-green-500" : "text-red-500"}`}
                />
              )}
              {!disabled && (
                <button
                  onClick={() => onRemove(id)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <MaterialIcon name="close" className="text-lg" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`h-16 w-full border-2 border-dashed ${borderColor} rounded-lg flex items-center justify-center text-slate-400 transition-all ${isOver ? "animate-pulse" : ""
              }`}
          >
            <span className="text-sm font-medium">
              {isOver ? t("dropActive") : t("dropHere")}
            </span>
          </div>
        )}
        {/* Show correct answer after checking if wrong */}
        {checked && !isCorrect && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
            <MaterialIcon name="lightbulb" className="text-sm" />
            {locale === "ar" ? sign.wordAr : sign.word}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Drag Overlay Word ───────────────────────────────────────

function DragOverlayWord({ word }: { word: string }) {
  return (
    <div className="cursor-grabbing bg-white dark:bg-slate-700 border-2 border-primary shadow-lifted p-4 rounded-lg transform -rotate-2 scale-105 flex items-center justify-between opacity-90 min-w-[120px]">
      <span className="font-bold text-lg text-primary dark:text-white">
        {word}
      </span>
      <MaterialIcon name="drag_indicator" className="text-primary" />
    </div>
  );
}

// ─── Timer Component ─────────────────────────────────────────

function Timer({ seconds }: { seconds: number }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (
    <div className="flex items-center gap-1.5 text-primary font-mono font-medium bg-primary/5 px-3 py-1 rounded-full">
      <MaterialIcon name="timer" className="text-[18px]" />
      <span>
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
    </div>
  );
}

// ─── Results Screen ──────────────────────────────────────────

function QuizResults({
  totalCorrect,
  totalQuestions,
  t,
  onPlayAgain,
  onExit,
}: {
  totalCorrect: number;
  totalQuestions: number;
  t: ReturnType<typeof useTranslations>;
  onPlayAgain: () => void;
  onExit: () => void;
}) {
  const percentage = Math.round((totalCorrect / totalQuestions) * 100);
  const getMessage = () => {
    if (percentage === 100) return t("perfectScore");
    if (percentage >= 75) return t("greatJob");
    if (percentage >= 50) return t("goodEffort");
    return t("keepPracticing");
  };

  const getIcon = () => {
    if (percentage === 100) return "emoji_events";
    if (percentage >= 75) return "stars";
    if (percentage >= 50) return "thumb_up";
    return "fitness_center";
  };

  const getColor = () => {
    if (percentage === 100) return "text-amber-500";
    if (percentage >= 75) return "text-green-500";
    if (percentage >= 50) return "text-blue-500";
    return "text-primary";
  };

  return (
    <div className="flex-1 flex items-center justify-center py-6">
      <Card className="w-full max-w-lg text-center">
        <CardContent className="pt-8 pb-6 px-6 sm:px-8 flex flex-col items-center gap-5">
          <div
            className={`w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center ${getColor()}`}
          >
            <MaterialIcon name={getIcon()} className="text-5xl" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {t("quizComplete")}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {getMessage()}
            </p>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl p-6 space-y-3">
            <div className="text-4xl font-extrabold text-primary">
              {t("finalScore", { score: percentage })}
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              {t("totalCorrect", {
                correct: totalCorrect,
                total: totalQuestions,
              })}
            </p>
            {/* Score bar */}
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button onClick={onPlayAgain} className="flex-1 font-bold" size="lg">
              <MaterialIcon name="replay" className="me-2" />
              {t("playAgain")}
            </Button>
            <Button
              onClick={onExit}
              variant="outline"
              className="flex-1 font-bold"
              size="lg"
            >
              {t("backToPractice")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Setup Screen ────────────────────────────────────────────

function QuizSetup({
  categories,
  t,
  tc,
  onStart,
}: {
  categories: Category[];
  t: ReturnType<typeof useTranslations>;
  tc: ReturnType<typeof useTranslations>;
  onStart: (category: string | null, signsPerRound: number, rounds: number) => void;
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [signsPerRound, setSignsPerRound] = useState(5);
  const [rounds, setRounds] = useState(3);

  return (
    <div className="flex-1 flex items-center justify-center py-6">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-8 pb-6 px-6 sm:px-8 flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <MaterialIcon name="quiz" className="text-3xl" />
          </div>

          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {t("title")}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("subtitle")}
            </p>
          </div>

          <div className="w-full space-y-4">
            {/* Category selector */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {t("selectCategory")}
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => setCategory(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${category === null
                    ? "bg-primary text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10"
                    }`}
                >
                  {t("allCategories")}
                </button>
                {categories
                  .filter((c) => c.id !== "all")
                  .map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${category === c.id
                        ? "bg-primary text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10"
                        }`}
                    >
                      {tc(c.id)}
                    </button>
                  ))}
              </div>
            </div>

            {/* Signs per round */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {t("signsPerRound")}
              </label>
              <div className="flex gap-2 mt-2">
                {[3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSignsPerRound(n)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${signsPerRound === n
                      ? "bg-primary text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10"
                      }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of rounds */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {t("numberOfRounds")}
              </label>
              <div className="flex gap-2 mt-2">
                {[2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRounds(n)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${rounds === n
                      ? "bg-primary text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10"
                      }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={() => onStart(category, signsPerRound, rounds)}
            className="w-full font-bold text-lg"
            size="lg"
          >
            <MaterialIcon name="play_arrow" className="me-2 text-xl" />
            {t("startQuiz")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Quiz Game ──────────────────────────────────────────

export function QuizGame({ categories }: { categories: Category[] }) {
  const t = useTranslations("Quiz");
  const tc = useTranslations("Categories");
  const locale = useLocale();
  const router = useRouter();

  // Game state
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(3);
  const [signsPerRound, setSignsPerRound] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [roundSigns, setRoundSigns] = useState<Sign[]>([]);
  const [shuffledWords, setShuffledWords] = useState<
    { id: string; word: string }[]
  >([]);
  const [matches, setMatches] = useState<QuizMatch[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalTimeRef = useRef(0);

  // Sensors for drag
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 5 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  // Timer
  useEffect(() => {
    if (phase === "playing") {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Start a round
  const startRound = useCallback(
    async (
      cat: string | null,
      count: number,
      roundNum: number
    ) => {
      setLoading(true);
      setError(null);
      try {
        const signs = await fetchQuizSigns(cat, count);
        if (signs.length < 2) {
          setError(t("notEnoughSigns"));
          setPhase("setup");
          setLoading(false);
          return;
        }

        setRoundSigns(signs);

        // Shuffle words for the word bank
        const words = signs.map((s) => ({
          id: s.id,
          word: locale === "ar" ? s.wordAr : s.word,
        }));
        // Fisher-Yates shuffle
        for (let i = words.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [words[i], words[j]] = [words[j], words[i]];
        }
        setShuffledWords(words);

        // Init matches
        setMatches(
          signs.map((s) => ({
            signId: s.id,
            assignedWord: null,
            isCorrect: null,
          }))
        );

        setCurrentRound(roundNum);
        setTimer(0);
        setPhase("playing");
      } catch {
        setError(t("notEnoughSigns"));
        setPhase("setup");
      }
      setLoading(false);
    },
    [locale, t]
  );

  // Handle quiz start
  const handleStart = useCallback(
    (category: string | null, spr: number, rounds: number) => {
      setSelectedCategory(category);
      setSignsPerRound(spr);
      setTotalRounds(rounds);
      setTotalCorrect(0);
      setTotalQuestions(0);
      totalTimeRef.current = 0;
      startRound(category, spr, 1);
    },
    [startRound]
  );

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const wordId = active.id as string;
    const dropSignId = over.id as string;

    const wordEntry = shuffledWords.find((w) => w.id === wordId);
    if (!wordEntry) return;

    setMatches((prev) => {
      // Remove this word from any previous assignment
      const cleaned = prev.map((m) =>
        m.assignedWord === wordEntry.word
          ? { ...m, assignedWord: null, isCorrect: null }
          : m
      );
      // Assign to the target
      return cleaned.map((m) =>
        m.signId === dropSignId
          ? { ...m, assignedWord: wordEntry.word, isCorrect: null }
          : m
      );
    });
  };

  // Remove assignment
  const handleRemove = (signId: string) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.signId === signId
          ? { ...m, assignedWord: null, isCorrect: null }
          : m
      )
    );
  };

  // Check answers
  const handleCheck = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    totalTimeRef.current += timer;

    const checked = matches.map((m) => {
      const sign = roundSigns.find((s) => s.id === m.signId);
      if (!sign || !m.assignedWord) return { ...m, isCorrect: false };
      const correctWord = locale === "ar" ? sign.wordAr : sign.word;
      return { ...m, isCorrect: m.assignedWord === correctWord };
    });

    setMatches(checked);
    setPhase("checking");

    const roundCorrect = checked.filter((m) => m.isCorrect).length;
    setTotalCorrect((prev) => prev + roundCorrect);
    setTotalQuestions((prev) => prev + roundSigns.length);

    // Mark correctly matched signs as learned
    for (const m of checked) {
      if (m.isCorrect) {
        await markSignAsLearned(m.signId);
      }
    }

    // Show round result after a short delay
    setTimeout(() => {
      setPhase("roundResult");
    }, 1500);
  };

  // Save result and transition to finished
  const finishQuiz = useCallback(
    async (correct: number, questions: number) => {
      const score = questions > 0 ? Math.round((correct / questions) * 100) : 0;
      setPhase("finished");
      await saveQuizResult({
        category: selectedCategory,
        totalRounds,
        totalQuestions: questions,
        totalCorrect: correct,
        score,
        timeSpent: totalTimeRef.current,
      });
    },
    [selectedCategory, totalRounds]
  );

  // Next round or finish
  const handleNext = () => {
    if (currentRound >= totalRounds) {
      finishQuiz(totalCorrect, totalQuestions);
    } else {
      startRound(selectedCategory, signsPerRound, currentRound + 1);
    }
  };

  // Skip round
  const handleSkip = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    totalTimeRef.current += timer;
    const newQuestions = totalQuestions + roundSigns.length;
    setTotalQuestions(newQuestions);
    if (currentRound >= totalRounds) {
      finishQuiz(totalCorrect, newQuestions);
    } else {
      startRound(selectedCategory, signsPerRound, currentRound + 1);
    }
  };

  // Reset current round
  const handleReset = () => {
    setMatches(
      roundSigns.map((s) => ({
        signId: s.id,
        assignedWord: null,
        isCorrect: null,
      }))
    );
  };

  // Play again
  const handlePlayAgain = () => {
    setPhase("setup");
    setTotalCorrect(0);
    setTotalQuestions(0);
  };

  // Get word for active drag
  const activeWord = activeId
    ? shuffledWords.find((w) => w.id === activeId)?.word
    : null;

  // Which words are placed
  const placedWords = new Set(
    matches.filter((m) => m.assignedWord).map((m) => m.assignedWord)
  );

  const allPlaced = matches.every((m) => m.assignedWord !== null);
  const progressPercent =
    totalRounds > 0 ? ((currentRound - 1) / totalRounds) * 100 + (allPlaced ? (1 / totalRounds) * 50 : 0) : 0;

  // ─── Render ────────────────────────────────────────────────

  if (phase === "setup") {
    return (
      <div className="w-full">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive text-center mb-4">
            {error}
          </div>
        )}
        <QuizSetup
          categories={categories}
          t={t}
          tc={tc}
          onStart={handleStart}
        />
      </div>
    );
  }

  if (phase === "finished") {
    return (
      <QuizResults
        totalCorrect={totalCorrect}
        totalQuestions={totalQuestions}
        t={t}
        onPlayAgain={handlePlayAgain}
        onExit={() => router.push("/practice")}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20" />
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  const isDisabled = phase === "checking" || phase === "roundResult";

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <header className="w-full flex flex-col md:flex-row items-center justify-between gap-4 border-b border-primary/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <MaterialIcon name="quiz" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t("title")}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-1 flex items-center gap-6 w-full max-w-2xl mx-auto">
          <div className="flex flex-col w-full gap-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-primary dark:text-primary">
                {t("roundOf", { current: currentRound, total: totalRounds })}
              </span>
              <Timer seconds={timer} />
            </div>
            <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Exit button */}
        <Button
          variant="outline"
          onClick={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            setPhase("setup");
          }}
          className="hidden md:flex items-center gap-2 font-bold"
        >
          <MaterialIcon name="logout" className="text-[20px]" />
          {t("exit")}
        </Button>
      </header>

      {/* Instruction */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {t("matchInstruction")}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {t("matchDescription")}
        </p>
      </div>

      {/* Game Board */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Words Panel */}
          <div className="lg:col-span-4 order-2 lg:order-1 flex flex-col gap-4 sticky top-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-soft border border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                <MaterialIcon name="format_quote" className="text-primary" />
                {t("words")}
              </h3>
              <div className="flex flex-col gap-3">
                {shuffledWords.map((w) => (
                  <DraggableWord
                    key={w.id}
                    id={w.id}
                    word={w.word}
                    isPlaced={placedWords.has(w.word)}
                    disabled={isDisabled}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Video Targets */}
          <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col gap-6">
            {roundSigns.map((sign) => {
              const match = matches.find((m) => m.signId === sign.id);
              return (
                <DropZone
                  key={sign.id}
                  id={sign.id}
                  sign={sign}
                  locale={locale}
                  assignedWord={match?.assignedWord ?? null}
                  isCorrect={match?.isCorrect ?? null}
                  checked={phase === "checking" || phase === "roundResult"}
                  onRemove={handleRemove}
                  t={t}
                  disabled={isDisabled}
                />
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {activeWord ? <DragOverlayWord word={activeWord} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 -mx-4 sm:-mx-6 lg:-mx-8 border-t border-slate-200 dark:border-slate-700 flex justify-center mt-auto">
        <div className="w-full max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleReset}
            disabled={isDisabled}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-40"
          >
            <MaterialIcon name="restart_alt" />
            <span className="hidden sm:inline">{t("reset")}</span>
          </button>

          {phase === "roundResult" ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-bold text-primary">
                {t("roundScore", {
                  correct: matches.filter((m) => m.isCorrect).length,
                  total: roundSigns.length,
                })}
              </p>
              <Button
                onClick={handleNext}
                className="font-bold text-lg py-3 px-12 rounded-xl shadow-lg shadow-primary/20"
              >
                {currentRound >= totalRounds ? t("score") : t("nextRound")}
                <MaterialIcon
                  name={
                    currentRound >= totalRounds
                      ? "emoji_events"
                      : "arrow_forward"
                  }
                  className="ms-2"
                />
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleCheck}
              disabled={!allPlaced || isDisabled}
              className="font-bold text-lg py-3 px-12 rounded-xl shadow-lg shadow-primary/20"
            >
              {t("checkAnswers")}
              <MaterialIcon name="check_circle" className="ms-2" />
            </Button>
          )}

          <button
            onClick={handleSkip}
            disabled={isDisabled}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-40"
          >
            <span className="hidden sm:inline">{t("skip")}</span>
            <MaterialIcon name="skip_next" />
          </button>
        </div>
      </div>
    </div>
  );
}
