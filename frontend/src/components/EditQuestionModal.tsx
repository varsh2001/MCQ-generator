import React, { useState, useEffect } from 'react';
import { Question, Answer } from '../types/quiz';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface EditQuestionModalProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: Question) => void;
}

export function EditQuestionModal({ question, isOpen, onClose, onSave }: EditQuestionModalProps) {
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [correctAnswerId, setCorrectAnswerId] = useState('');

  useEffect(() => {
    if (question) {
      setQuestionText(question.text);
      setAnswers(question.answers);
      const correctAnswer = question.answers.find(a => a.isCorrect);
      if (correctAnswer) {
        setCorrectAnswerId(correctAnswer.id);
      }
    }
  }, [question]);

  const handleSave = () => {
    if (question) {
      const updatedQuestion: Question = {
        ...question,
        text: questionText,
        answers: answers.map(answer => ({
          ...answer,
          isCorrect: answer.id === correctAnswerId,
        })),
      };
      onSave(updatedQuestion);
      onClose();
    }
  };

  const updateAnswer = (index: number, text: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], text };
    setAnswers(newAnswers);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
          <DialogDescription>
            Modify the question text, answer options, and select the correct answer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="question-text">Question Text</Label>
            <Input
              id="question-text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter question text"
              className="border-slate-200"
            />
          </div>

          <div className="space-y-3">
            <Label>Answer Options</Label>
            <RadioGroup value={correctAnswerId} onValueChange={setCorrectAnswerId}>
              {answers.map((answer, index) => (
                <div key={answer.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <RadioGroupItem value={answer.id} id={answer.id} />
                  <Label htmlFor={answer.id} className="text-slate-600 shrink-0">
                    {String.fromCharCode(65 + index)}.
                  </Label>
                  <Input
                    value={answer.text}
                    onChange={(e) => updateAnswer(index, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="border-slate-200 bg-white"
                  />
                </div>
              ))}
            </RadioGroup>
            <p className="text-slate-500">Select the radio button to mark the correct answer</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
