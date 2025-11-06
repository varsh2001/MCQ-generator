import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Difficulty, QuizConfig } from '../types/quiz';
import { Loader2, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputScreenProps {
  onGenerate: (text: string, config: QuizConfig) => void;
  isLoading: boolean;
}

interface QuestionsSliderProps {
  id: string;
  min: number;
  max: number;
  step: number;
  value: [number];
  onValueChange: (values: [number]) => void;
  className?: string;
}

const QuestionsSlider = ({
  id,
  min,
  max,
  step,
  value,
  onValueChange,
  className,
}: QuestionsSliderProps) => (
  <Slider
    id={id}
    min={min}
    max={max}
    step={step}
    value={value}
    onValueChange={onValueChange}
    className={className}
  />
);

export function InputScreen({ onGenerate, isLoading }: InputScreenProps) {
  const [text, setText] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

  const handleDifficultyChange = (value: string) => {
    if (value === 'Easy' || value === 'Medium' || value === 'Hard') {
      setDifficulty(value as Difficulty);
    }
  };

  const handleGenerate = () => {
    if (text.trim()) {
      onGenerate(text, { numberOfQuestions, difficulty });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center mb-4"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-8 h-8 text-purple-600 mr-2" />
            </motion.div>
            <h1 className="text-slate-900 mb-0 text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              MCQ Generator
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-600 text-lg"
          >
            Transform your text into interactive quizzes
          </motion.p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg border-2 border-purple-100 p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your article, notes, or text here..."
                className="min-h-[300px] sm:min-h-[400px] resize-none border-slate-200 focus:border-purple-500 focus:ring-purple-500"
              />
              <div className="mt-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleGenerate}
                    disabled={!text.trim() || isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing and creating questions...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-5 w-5" />
                        Generate Quiz
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border-2 border-purple-100 p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="space-y-6">
              <motion.div className="space-y-3">
                <Label htmlFor="questions-slider" className="text-slate-700">
                  Number of Questions
                </Label>
                <div className="space-y-2">
                  <QuestionsSlider
                    id="questions-slider"
                    min={5}
                    max={20}
                    step={1}
                    value={[numberOfQuestions]}
                    onValueChange={(values) => setNumberOfQuestions(values[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-slate-500">
                    <span>5</span>
                    <span>20</span>
                  </div>
                </div>
              </motion.div>

              <motion.div className="space-y-3">
                <Label htmlFor="difficulty-select" className="text-slate-700">
                  Difficulty
                </Label>
                <Select value={difficulty} onValueChange={handleDifficultyChange}>
                  <SelectTrigger id="difficulty-select" className="border-slate-200">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">🟢 Easy</SelectItem>
                    <SelectItem value="Medium">🟡 Medium</SelectItem>
                    <SelectItem value="Hard">🔴 Hard</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <div className="pt-4 border-t border-slate-200">
                <div className="space-y-3 text-slate-600">
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                    AI-powered question generation
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
                    Multiple choice format
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-full" />
                    Editable and customizable
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {isLoading && (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-indigo-900/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-xl p-8 shadow-2xl max-w-sm mx-4 text-center border-2 border-purple-100"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-slate-900 mb-2">Analyzing and creating questions...</h3>
              <p className="text-slate-600">This may take a few moments</p>
              <motion.div 
                className="mt-4 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}