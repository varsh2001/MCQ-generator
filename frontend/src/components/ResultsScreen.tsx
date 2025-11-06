import React from 'react';
import { Question, UserAnswer } from '../types/quiz';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Check, X, Trophy, RotateCcw, Eye, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ResultsScreenProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onGenerateNew: () => void;
  onReviewAnswers: () => void;
}

export function ResultsScreen({ questions, userAnswers, onGenerateNew, onReviewAnswers }: ResultsScreenProps) {
  const calculateScore = () => {
    let correct = 0;
    userAnswers.forEach(userAnswer => {
      const question = questions.find(q => q.id === userAnswer.questionId);
      if (question) {
        const correctAnswer = question.answers.find(a => a.isCorrect);
        if (correctAnswer?.id === userAnswer.answerId) {
          correct++;
        }
      }
    });
    return correct;
  };

  const correctAnswers = calculateScore();
  const totalQuestions = questions.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return 'Excellent work!';
    if (percentage >= 60) return 'Good job!';
    if (percentage >= 40) return 'Not bad!';
    return 'Keep practicing!';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-2 border-purple-200 shadow-2xl hover:shadow-purple-200/50 transition-shadow duration-500">
          <CardContent className="p-8 sm:p-12 text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <motion.div 
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1.1, 1.1, 1]
                }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 mb-6 relative"
              >
                <Trophy className="w-10 h-10 text-yellow-600" />
                <motion.div
                  animate={{ 
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="absolute inset-0 rounded-full bg-yellow-400"
                />
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-900 mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent"
              >
                Quiz Complete!
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-600 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                {getScoreMessage()}
              </motion.p>
            </motion.div>

            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
              className="mb-8"
            >
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`text-5xl sm:text-6xl mb-4 ${getScoreColor()}`}
              >
                {percentage}%
              </motion.div>
              <p className="text-slate-600">
                Correct: {correctAnswers}/{totalQuestions}
              </p>
            </motion.div>

            {/* Score Breakdown */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="text-slate-900 text-xl">{correctAnswers}</div>
                  <div className="text-slate-500">Correct</div>
                </div>
              </motion.div>
              <div className="hidden sm:block w-px h-12 bg-slate-200" />
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-100 to-rose-100">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-left">
                  <div className="text-slate-900 text-xl">{totalQuestions - correctAnswers}</div>
                  <div className="text-slate-500">Incorrect</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onReviewAnswers}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-purple-300 hover:bg-purple-50"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Review Answers
                </Button>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: ["0px 0px 0px rgba(147, 51, 234, 0)", "0px 0px 20px rgba(147, 51, 234, 0.5)", "0px 0px 0px rgba(147, 51, 234, 0)"]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              >
                <Button
                  onClick={onGenerateNew}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 shadow-lg"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Generate New Quiz
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
