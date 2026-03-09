export interface Sign {
  id: string;
  word: string;
  wordAr: string;
  wordFr: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  difficultyStars: number;
  thumbnail: string;
  videoUrl: string;
  videoDuration: string;
}
