export interface MCQQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface GenerateQuizRequest {
  paragraph: string;
  num_questions?: number;
  qtype?: 'fill_blank' | 'wh_question';
}

export interface GenerateQuizResponse {
  ok: boolean;
  quiz?: MCQQuestion[];
  error?: string;
}