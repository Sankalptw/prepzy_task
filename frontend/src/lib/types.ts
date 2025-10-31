/**
 * Frontend TypeScript Types
 * Matches backend API responses
 */

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question_count: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  difficulty: string;
}

export interface QuizSession {
  topic: {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
  };
  questions: Question[];
  total_questions: number;
  time_per_question: number;
}

export interface Answer {
  question_id: string;
  selected_answer: number;
  time_taken: number;
}

export interface DetailedAnswer {
  question_id: string;
  question: string;
  options: string[];
  selected_answer: number;
  correct_answer: number;
  is_correct: boolean;
  explanation: string;
  difficulty: string;
  time_taken: number;
}

export interface QuizResult {
  attempt_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  grade: string;
  feedback: string;
  time_taken: number;
  answers: DetailedAnswer[];
  topic_analysis: {
    topic: string;
    correct: number;
    total: number;
    percentage: number;
  };
}

export interface QuizHistory {
  id: string;
  topic_name: string;
  topic_slug: string;
  topic_icon: string;
  score: number;
  total_questions: number;
  percentage: number;
  time_taken: number;
  completed_at: string;
}

export interface UserStats {
  total_quizzes: number;
  avg_score: number;
  total_points: number;
  topics_attempted: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}