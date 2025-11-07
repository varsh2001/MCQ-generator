import { GenerateQuizRequest, GenerateQuizResponse } from '../types/api';

// Use environment variable or fallback
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function generateQuiz(params: GenerateQuizRequest): Promise<GenerateQuizResponse> {
  try {
    const response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
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