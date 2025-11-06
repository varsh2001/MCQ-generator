import React from 'react';
import { Question } from '../types/quiz';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Check, Pencil } from 'lucide-react';
import { motion } from 'motion/react';

interface QuestionCardProps {
  question: Question;
  index: number;
  onEdit: (question: Question) => void;
}

export function QuestionCard({ question, index, onEdit }: QuestionCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3 className="text-slate-900 flex-1">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{index + 1}.</span> {question.text}
            </h3>
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(question)}
                className="text-slate-600 hover:text-purple-600 hover:bg-purple-50"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>

        <div className="space-y-2">
          {question.answers.map((answer, idx) => (
            <motion.div
              key={answer.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 5 }}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                answer.isCorrect
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 hover:border-green-400'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-600">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className={answer.isCorrect ? 'text-green-900' : 'text-slate-700'}>
                  {answer.text}
                </span>
                {answer.isCorrect && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                  >
                    <Check className="h-4 w-4 text-green-600 ml-auto" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
