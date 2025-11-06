import React, { useState } from 'react';
import { Question } from '../types/quiz';
import { QuestionCard } from './QuestionCard';
import { EditQuestionModal } from './EditQuestionModal';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ChevronDown, FileDown, PlayCircle, RotateCcw, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ReviewScreenProps {
  questions: Question[];
  onUpdateQuestion: (question: Question) => void;
  onStartQuiz: () => void;
  onStartOver: () => void;
}

export function ReviewScreen({ questions, onUpdateQuestion, onStartQuiz, onStartOver }: ReviewScreenProps) {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleExport = (format: 'pdf' | 'text') => {
    // Mock export functionality
    console.log(`Exporting quiz as ${format}`);
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-slate-900 mb-1 flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                Review Questions
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-slate-600"
              >
                {questions.length} questions generated
              </motion.p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-2 sm:gap-3"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={onStartOver}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <RotateCcw className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Start Over</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-slate-300">
                      <FileDown className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Export</span>
                      <ChevronDown className="h-4 w-4 sm:ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExport('pdf')}>
                      Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('text')}>
                      Export as Text
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: ["0px 0px 0px rgba(147, 51, 234, 0)", "0px 0px 20px rgba(147, 51, 234, 0.4)", "0px 0px 0px rgba(147, 51, 234, 0)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Button onClick={onStartQuiz} className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 shadow-lg">
                  <PlayCircle className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Take Quiz</span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.header>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <QuestionCard
                question={question}
                index={index}
                onEdit={setEditingQuestion}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <EditQuestionModal
        question={editingQuestion}
        isOpen={editingQuestion !== null}
        onClose={() => setEditingQuestion(null)}
        onSave={onUpdateQuestion}
      />
    </div>
  );
}
