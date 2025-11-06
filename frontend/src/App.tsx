import React, { useState } from 'react';
import { InputScreen } from './components/InputScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ReviewAnswersScreen } from './components/ReviewAnswersScreen';
import { Question, QuizConfig, UserAnswer } from './types/quiz';
import { generateQuiz } from './utils/mockQuizGenerator';

type Screen = 'input' | 'review' | 'quiz' | 'results' | 'review-answers';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('input');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (text: string, config: QuizConfig) => {
    setIsLoading(true);
    try {
      const generatedQuestions = await generateQuiz(text, config);
      setQuestions(generatedQuestions);
      setCurrentScreen('review');
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    ));
  };

  const handleStartQuiz = () => {
    setUserAnswers([]);
    setCurrentScreen('quiz');
  };

  const handleSubmitQuiz = (answers: UserAnswer[]) => {
    setUserAnswers(answers);
    setCurrentScreen('results');
  };

  const handleStartOver = () => {
    setQuestions([]);
    setUserAnswers([]);
    setCurrentScreen('input');
  };

  const handleReviewAnswers = () => {
    setCurrentScreen('review-answers');
  };

  const handleBackToResults = () => {
    setCurrentScreen('results');
  };

  return (
    <>
      {currentScreen === 'input' && (
        <InputScreen onGenerate={handleGenerate} isLoading={isLoading} />
      )}
      {currentScreen === 'review' && (
        <ReviewScreen
          questions={questions}
          onUpdateQuestion={handleUpdateQuestion}
          onStartQuiz={handleStartQuiz}
          onStartOver={handleStartOver}
        />
      )}
      {currentScreen === 'quiz' && (
        <QuizScreen questions={questions} onSubmit={handleSubmitQuiz} />
      )}
      {currentScreen === 'results' && (
        <ResultsScreen
          questions={questions}
          userAnswers={userAnswers}
          onGenerateNew={handleStartOver}
          onReviewAnswers={handleReviewAnswers}
        />
      )}
      {currentScreen === 'review-answers' && (
        <ReviewAnswersScreen
          questions={questions}
          userAnswers={userAnswers}
          onBack={handleBackToResults}
        />
      )}
    </>
  );
}
