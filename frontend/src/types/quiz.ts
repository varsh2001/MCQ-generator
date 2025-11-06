export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

export interface QuizConfig {
  numberOfQuestions: number;
  difficulty: Difficulty;
}

export interface UserAnswer {
  questionId: string;
  answerId: string;
}
