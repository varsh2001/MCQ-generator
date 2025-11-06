import { Question, QuizConfig } from '../types/quiz';

// Mock function to simulate quiz generation
export const generateQuiz = async (
  text: string,
  config: QuizConfig
): Promise<Question[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const questions: Question[] = [];
  
  for (let i = 0; i < config.numberOfQuestions; i++) {
    questions.push({
      id: `q-${i + 1}`,
      text: `Sample question ${i + 1} based on your text (${config.difficulty} difficulty)`,
      answers: [
        {
          id: `q-${i + 1}-a-1`,
          text: `Option A for question ${i + 1}`,
          isCorrect: true,
        },
        {
          id: `q-${i + 1}-a-2`,
          text: `Option B for question ${i + 1}`,
          isCorrect: false,
        },
        {
          id: `q-${i + 1}-a-3`,
          text: `Option C for question ${i + 1}`,
          isCorrect: false,
        },
        {
          id: `q-${i + 1}-a-4`,
          text: `Option D for question ${i + 1}`,
          isCorrect: false,
        },
      ],
    });
  }

  return questions;
};
