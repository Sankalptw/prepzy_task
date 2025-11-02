import { Request } from 'express';

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  created_at: Date;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserResponse;
  token?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

export interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data?: T;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  is_active: boolean;
  created_at: Date;
  question_count?: number;
}

// QUESTION TYPES
export interface Question {
  id: string;
  topic_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  created_at: Date;
}

export interface QuestionForQuiz {
  id: string;
  question: string;
  options: string[];
  difficulty: string;
}

// QUIZ ATTEMPT TYPES
export interface QuizAttempt {
  id: string;
  user_id: string;
  topic_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  time_taken: number;
  completed_at: Date;
}

export interface UserAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_answer: number;
  is_correct: boolean;
  time_taken: number;
  created_at: Date;
}

export interface QuizSubmission {
  topic_slug: string;
  answers: {
    question_id: string;
    selected_answer: number;
    time_taken: number;
  }[];
}

export interface QuizResult {
  attempt_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  grade: string;
  feedback: string;
  time_taken: number;
  answers: {
    question_id: string;
    question: string;
    options: string[];
    selected_answer: number;
    correct_answer: number;
    is_correct: boolean;
    explanation: string;
    difficulty: string;
  }[];
  topic_analysis: {
    topic: string;
    correct: number;
    total: number;
    percentage: number;
  };
}