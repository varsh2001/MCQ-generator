import { GenerateQuizRequest, GenerateQuizResponse } from '../types/api';

const API_BASE = '/api';

export async function generateQuiz(params: GenerateQuizRequest): Promise<GenerateQuizResponse> {
  try {
    const response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating quiz:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}