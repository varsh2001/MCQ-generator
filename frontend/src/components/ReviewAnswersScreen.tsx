import React from 'react';
import { Question, UserAnswer } from '../types/quiz';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Check, X, ArrowLeft, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface ReviewAnswersScreenProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onBack: () => void;
}

export function ReviewAnswersScreen({ questions, userAnswers, onBack }: ReviewAnswersScreenProps) {
  const getUserAnswer = (questionId: string) => {
    return userAnswers.find(a => a.questionId === questionId);
  };

  const isAnswerCorrect = (questionId: string, answerId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return false;
    const correctAnswer = question.answers.find(a => a.isCorrect);
    return correctAnswer?.id === answerId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-5xl">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-4 text-slate-600 hover:text-purple-600 hover:bg-purple-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Results
            </Button>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-900 mb-1 flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent"
          >
            <BookOpen className="w-8 h-8 text-purple-600" />
            Answer Review
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-600"
          >
            Review your answers and see the correct solutions
          </motion.p>
        </motion.header>

        <div className="space-y-6">
          {questions.map((question, index) => {
            const userAnswer = getUserAnswer(question.id);
            const correctAnswer = question.answers.find(a => a.isCorrect);
            const wasCorrect = userAnswer && isAnswerCorrect(question.id, userAnswer.answerId);

            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.01 }}
              >
                <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: index * 0.1 + 0.2 }}
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          wasCorrect ? 'bg-gradient-to-br from-green-100 to-emerald-100' : 'bg-gradient-to-br from-red-100 to-rose-100'
                        }`}
                      >
                        {wasCorrect ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-slate-900 mb-4">
                          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{index + 1}.</span> {question.text}
                        </h3>

                        <div className="space-y-2">
                          {question.answers.map((answer, idx) => {
                            const isUserAnswer = userAnswer?.answerId === answer.id;
                            const isCorrectAnswer = answer.isCorrect;

                            let className = 'p-3 rounded-lg border-2 transition-all duration-200 ';
                            if (isCorrectAnswer) {
                              className += 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300';
                            } else if (isUserAnswer && !isCorrectAnswer) {
                              className += 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300';
                            } else {
                              className += 'bg-slate-50 border-slate-200';
                            }

                            return (
                              <motion.div 
                                key={answer.id} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + idx * 0.05 }}
                                className={className}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-slate-600">
                                    {String.fromCharCode(65 + idx)}.
                                  </span>
                                  <span className={
                                    isCorrectAnswer ? 'text-green-900' :
                                    isUserAnswer ? 'text-red-900' :
                                    'text-slate-700'
                                  }>
                                    {answer.text}
                                  </span>
                                  {isCorrectAnswer && (
                                    <motion.span 
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", delay: 0.2 }}
                                      className="ml-auto text-green-600"
                                    >
                                      <Check className="h-4 w-4" />
                                    </motion.span>
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <motion.span 
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", delay: 0.2 }}
                                      className="ml-auto text-red-600"
                                    >
                                      <X className="h-4 w-4" />
                                    </motion.span>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        {!wasCorrect && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg"
                          >
                            <p className="text-blue-900 text-sm sm:text-base">
                              <strong>Correct answer:</strong> {correctAnswer?.text}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={onBack} variant="outline" size="lg" className="border-2 border-purple-300 hover:bg-purple-50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Results
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
