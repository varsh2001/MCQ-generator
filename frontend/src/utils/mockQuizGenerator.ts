import { Question, QuizConfig } from '../types/quiz';
import { generateQuiz as generateQuizAPI } from '../api/quiz';

// Convert backend API response to frontend format
export const generateQuiz = async (
  text: string,
  config: QuizConfig
): Promise<Question[]> => {
  try {
    // Call the real API
    const response = await generateQuizAPI({
      paragraph: text,
      num_questions: config.numberOfQuestions,
      qtype: 'fill_blank',
    });

    if (!response.ok || !response.quiz) {
      throw new Error(response.error || 'Failed to generate quiz');
    }

    // Convert backend format to frontend format
    const questions: Question[] = response.quiz.map((q, index) => {
      // Generate unique IDs
      const questionId = `q-${index + 1}`;
      
      // Create answer objects with IDs
      const answers = q.options.map((option, optIndex) => ({
        id: `${questionId}-a-${optIndex + 1}`,
        text: option,
        isCorrect: option === q.answer,
      }));

      return {
        id: questionId,
        text: q.question,
        answers: answers,
      };
    });

    return questions;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};