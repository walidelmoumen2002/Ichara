-- Add the enum value used when quiz runs are recorded on the activity feed.
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'quiz_completed';

-- Persist quiz summaries for the dashboard history widget.
CREATE TABLE "QuizResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT,
    "totalRounds" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "totalCorrect" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizResult_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "QuizResult_userId_idx" ON "QuizResult"("userId");
CREATE INDEX "QuizResult_userId_completedAt_idx" ON "QuizResult"("userId", "completedAt");

ALTER TABLE "QuizResult"
ADD CONSTRAINT "QuizResult_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
