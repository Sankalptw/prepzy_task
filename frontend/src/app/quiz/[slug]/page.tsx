'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { quizAPI } from '@/lib/api';
import { Question } from '@/lib/types';

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const topicSlug = params.slug as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<{ question_id: string; selected_answer: number; time_taken: number }>>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStartTime, setQuizStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topicName, setTopicName] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await quizAPI.start(topicSlug, 10);
        
        if (!response.questions || response.questions.length === 0) {
          setError('No questions available for this quiz');
          return;
        }
        
        setQuestions(response.questions);
        setTopicName(response.topic?.name || topicSlug);
        setQuizStartTime(Date.now());
        setQuestionStartTime(Date.now());
      } catch (error: any) {
        console.error('Failed to fetch quiz:', error);
        setError(error.message || 'Failed to load quiz. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [user, topicSlug, router]);

  // Timer
  useEffect(() => {
    if (isLoading || error || questions.length === 0) return;
    
    if (timeLeft === 0) {
      handleNextQuestion();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isLoading, error, questions.length]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    
    const answer = {
      question_id: questions[currentQuestionIndex].id,
      selected_answer: selectedAnswer ?? 0,
      time_taken: timeTaken,
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
      setQuestionStartTime(Date.now());
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers: typeof answers) => {
    const totalTime = Math.floor((Date.now() - quizStartTime) / 1000);
    
    try {
      const response = await quizAPI.submit(topicSlug, finalAnswers, totalTime);
      sessionStorage.setItem('quizResult', JSON.stringify(response.result));
      router.push(`/results/${response.result.attempt_id}`);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      alert('Failed to submit quiz');
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem', color: '#dc2626' }}>⚠️ Error Loading Quiz</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>{error}</p>
          <Link href="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>No Questions Available</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            This quiz doesn't have any questions yet.
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-surface)' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{topicName} Quiz</h2>
            <Link href="/dashboard" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
              Exit Quiz
            </Link>
          </div>
          
          {/* Progress Bar */}
          <div style={{ background: 'var(--border-color)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ 
              background: 'var(--blue-500)', 
              height: '100%', 
              width: `${progress}%`,
              transition: 'width 0.3s'
            }}></div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>⏱️ {timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem', maxWidth: '800px' }}>
        <div className="quiz-question-card">
          <div className="quiz-difficulty-badge">{currentQuestion?.difficulty || 'Medium'}</div>
          
          <h3 className="quiz-question">{currentQuestion?.question || 'Loading question...'}</h3>

          <div className="quiz-options">
            {currentQuestion?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`quiz-option ${selectedAnswer === index ? 'selected' : ''}`}
                suppressHydrationWarning
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="btn btn-primary btn-large"
            style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }}
            suppressHydrationWarning
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}