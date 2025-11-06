import React, { useState } from 'react';
import { Question, UserAnswer } from '../types/quiz';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { ChevronRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuizScreenProps {
  questions: Question[];
  onSubmit: (answers: UserAnswer[]) => void;
}

export function QuizScreen({ questions, onSubmit }: QuizScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string>('');

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (selectedAnswerId) {
      const newAnswers = [
        ...userAnswers.filter(a => a.questionId !== currentQuestion.id),
        { questionId: currentQuestion.id, answerId: selectedAnswerId },
      ];
      setUserAnswers(newAnswers);

      if (isLastQuestion) {
        onSubmit(newAnswers);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswerId('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <motion.span 
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-slate-600 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-purple-600" />
              Question {currentQuestionIndex + 1} of {questions.length}
            </motion.span>
            <motion.span 
              key={progress}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <Card className="border-2 border-purple-200 shadow-2xl hover:shadow-purple-200/50 transition-shadow duration-300">
              <CardContent className="p-6 sm:p-8">
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-slate-900 mb-6 sm:mb-8"
                >
                  {currentQuestion.text}
                </motion.h2>

                <RadioGroup value={selectedAnswerId} onValueChange={setSelectedAnswerId}>
                  <div className="space-y-3">
                    {currentQuestion.answers.map((answer, index) => (
                      <motion.div
                        key={answer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={`flex items-center space-x-3 p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            selectedAnswerId === answer.id
                              ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md'
                              : 'border-slate-200 hover:border-purple-300 bg-white'
                          }`}
                          onClick={() => setSelectedAnswerId(answer.id)}
                        >
                          <RadioGroupItem value={answer.id} id={answer.id} />
                          <Label
                            htmlFor={answer.id}
                            className="flex-1 cursor-pointer text-slate-700"
                          >
                            <span className="mr-2 sm:mr-3 font-semibold text-purple-600">{String.fromCharCode(65 + index)}.</span>
                            {answer.text}
                          </Label>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex justify-end"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleNext}
              disabled={!selectedAnswerId}
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 shadow-lg disabled:opacity-50"
            >
              {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
