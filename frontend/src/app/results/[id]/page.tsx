'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const attemptId = params.id as string;

  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const storedResult = sessionStorage.getItem('quizResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
      sessionStorage.removeItem('quizResult');
    }
    setIsLoading(false);
  }, [user, router]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <p>No results found</p>
        <Link href="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return '#10b981';
    if (grade.startsWith('B')) return '#3b82f6';
    if (grade.startsWith('C')) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      {/* Header */}
      <nav>
        <div className="nav-container">
          <Link href="/dashboard" className="nav-logo">
            <span>🧠</span>
            <span>Smart Quiz Arena</span>
          </Link>
          <Link href="/dashboard" className="btn btn-secondary">Dashboard</Link>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem', maxWidth: '900px' }}>
        {/* Score Card */}
        <div className="result-card">
          <div className="result-header">
            <div className="result-grade" style={{ color: getGradeColor(result.grade) }}>
              {result.grade}
            </div>
            <div className="result-score">
              <div className="result-score-number">{result.score}/{result.total_questions}</div>
              <div className="result-percentage">{result.percentage}%</div>
            </div>
          </div>

          <p className="result-feedback">{result.feedback}</p>

          <div className="result-stats">
            <div className="result-stat">
              <span className="stat-label">Correct</span>
              <span className="stat-value" style={{ color: '#10b981' }}>{result.score}</span>
            </div>
            <div className="result-stat">
              <span className="stat-label">Wrong</span>
              <span className="stat-value" style={{ color: '#ef4444' }}>{result.total_questions - result.score}</span>
            </div>
            <div className="result-stat">
              <span className="stat-label">Time</span>
              <span className="stat-value">{result.time_taken}s</span>
            </div>
          </div>
        </div>

        {/* Topic Analysis */}
        {/* Enhanced Topic Analysis */}
<div className="analysis-card">
  <h3 className="analysis-title">📊 Performance Analysis</h3>
  
  <div className="analysis-grid">
    {/* Overall Performance */}
    <div className="analysis-box">
      <div className="analysis-box-header">
        <span className="analysis-icon">🎯</span>
        <span className="analysis-box-title">Overall Score</span>
      </div>
      <div className="analysis-box-content">
        <div className="analysis-big-number">{result.percentage.toFixed(1)}%</div>
        <div className="analysis-subtitle">{result.score} out of {result.total_questions} correct</div>
      </div>
    </div>

    {/* Topic Performance */}
    <div className="analysis-box">
      <div className="analysis-box-header">
        <span className="analysis-icon">📚</span>
        <span className="analysis-box-title">Topic</span>
      </div>
      <div className="analysis-box-content">
        <div className="analysis-topic-name">{result.topic_analysis.topic}</div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${result.topic_analysis.percentage}%` }}
          ></div>
        </div>
        <div className="analysis-subtitle">{result.topic_analysis.percentage.toFixed(1)}% accuracy</div>
      </div>
    </div>

    {/* Time Performance */}
    <div className="analysis-box">
      <div className="analysis-box-header">
        <span className="analysis-icon">⏱️</span>
        <span className="analysis-box-title">Time Taken</span>
      </div>
      <div className="analysis-box-content">
        <div className="analysis-big-number">{result.time_taken}s</div>
        <div className="analysis-subtitle">
          {(result.time_taken / result.total_questions).toFixed(1)}s per question
        </div>
      </div>
    </div>
  </div>

  {/* Difficulty Breakdown */}
  <div className="difficulty-breakdown">
    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
      Performance by Difficulty
    </h4>
    <div className="difficulty-stats">
      {['easy', 'medium', 'hard'].map((difficulty) => {
        const difficultyQuestions = result.answers.filter((a: any) => 
          a.difficulty.toLowerCase() === difficulty
        );
        const correct = difficultyQuestions.filter((a: any) => a.is_correct).length;
        const total = difficultyQuestions.length;
        const percentage = total > 0 ? (correct / total) * 100 : 0;

        if (total === 0) return null;

        return (
          <div key={difficulty} className="difficulty-stat-item">
            <div className="difficulty-stat-header">
              <span className="difficulty-label" style={{ textTransform: 'capitalize' }}>
                {difficulty}
              </span>
              <span className="difficulty-score">{correct}/{total}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${percentage}%`,
                  background: percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444'
                }}
              ></div>
            </div>
            <div className="difficulty-percentage">{percentage.toFixed(0)}%</div>
          </div>
        );
      })}
    </div>
  </div>

  {/* Recommendations */}
  <div className="recommendations">
    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>
      💡 Recommendations
    </h4>
    <div className="recommendation-list">
      {result.percentage >= 90 && (
        <div className="recommendation-item recommendation-excellent">
          <span className="recommendation-icon">🌟</span>
          <span>Excellent work! You've mastered this topic. Try a harder topic to challenge yourself.</span>
        </div>
      )}
      {result.percentage >= 70 && result.percentage < 90 && (
        <div className="recommendation-item recommendation-good">
          <span className="recommendation-icon">👍</span>
          <span>Good job! Review the questions you missed to reach mastery level.</span>
        </div>
      )}
      {result.percentage >= 50 && result.percentage < 70 && (
        <div className="recommendation-item recommendation-practice">
          <span className="recommendation-icon">📖</span>
          <span>Keep practicing! Focus on understanding the concepts behind wrong answers.</span>
        </div>
      )}
      {result.percentage < 50 && (
        <div className="recommendation-item recommendation-review">
          <span className="recommendation-icon">🎯</span>
          <span>Review the basics and try again. Don't worry, practice makes perfect!</span>
        </div>
      )}
      
      {(() => {
        const wrongAnswers = result.answers.filter((a: any) => !a.is_correct);
        const hardWrong = wrongAnswers.filter((a: any) => a.difficulty === 'hard').length;
        const mediumWrong = wrongAnswers.filter((a: any) => a.difficulty === 'medium').length;
        const easyWrong = wrongAnswers.filter((a: any) => a.difficulty === 'easy').length;

        if (hardWrong > mediumWrong && hardWrong > easyWrong) {
          return (
            <div className="recommendation-item">
              <span className="recommendation-icon">📈</span>
              <span>You struggled with hard questions. Practice more challenging problems.</span>
            </div>
          );
        } else if (easyWrong > 0) {
          return (
            <div className="recommendation-item">
              <span className="recommendation-icon">🔧</span>
              <span>Review the fundamentals - you missed some easy questions.</span>
            </div>
          );
        }
        return null;
      })()}
    </div>
  </div>
</div>

        {/* Detailed Answers */}
        <div className="answers-section">
          <h3 className="section-title">📝 Detailed Review</h3>
          
          {result.answers.map((answer: any, index: number) => (
            <div key={index} className={`answer-card ${answer.is_correct ? 'correct' : 'incorrect'}`}>
              <div className="answer-header">
                <span className="answer-number">Question {index + 1}</span>
                <span className={`answer-badge ${answer.is_correct ? 'badge-correct' : 'badge-incorrect'}`}>
                  {answer.is_correct ? '✓ Correct' : '✗ Wrong'}
                </span>
              </div>

              <p className="answer-question">{answer.question}</p>

              <div className="answer-options">
                {answer.options.map((option: string, optIndex: number) => {
                  const isSelected = optIndex === answer.selected_answer;
                  const isCorrect = optIndex === answer.correct_answer;
                  
                  let className = 'answer-option';
                  if (isSelected && isCorrect) className += ' option-correct-selected';
                  else if (isSelected) className += ' option-wrong-selected';
                  else if (isCorrect) className += ' option-correct';

                  return (
                    <div key={optIndex} className={className}>
                      <span className="option-letter">{String.fromCharCode(65 + optIndex)}</span>
                      <span>{option}</span>
                      {isSelected && <span className="option-indicator">Your answer</span>}
                      {isCorrect && !isSelected && <span className="option-indicator">Correct answer</span>}
                    </div>
                  );
                })}
              </div>

              <div className="answer-explanation">
                <strong>Explanation:</strong> {answer.explanation}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <Link href="/dashboard" className="btn btn-primary btn-large">
            Back to Dashboard
          </Link>
          <Link href={`/quiz/${result.topic_analysis.topic.toLowerCase().replace(/ /g, '-')}`} className="btn btn-outline btn-large">
            Retake Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}