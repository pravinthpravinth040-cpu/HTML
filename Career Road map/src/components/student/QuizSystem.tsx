import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Clock,
  Award,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Quiz, QuizQuestion } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { triggerConfetti } from '../common/Confetti';

export const QuizSystem: React.FC = () => {
  const { quizzes, submitQuizAttempt, quizAttempts, topics } = useData();

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);

  // Show only published quizzes
  const publishedQuizzes = quizzes.filter(q => q.status === 'published');

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setQuizScore(0);
    setQuizPassed(false);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || !activeQuiz.questions || activeQuiz.questions.length === 0) return;

    let correctCount = 0;
    activeQuiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const total = activeQuiz.questions.length;
    const scorePct = Math.round((correctCount / total) * 100);
    const passed = scorePct >= (activeQuiz.passingScore || 70);

    setQuizScore(scorePct);
    setQuizPassed(passed);
    setIsSubmitted(true);

    if (passed) {
      triggerConfetti();
    }

    // Save attempt in database
    await submitQuizAttempt(
      activeQuiz.id,
      scorePct,
      total,
      passed,
      selectedAnswers
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Interactive Assessment Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Knowledge Quizzes</h1>
          <p className="text-xs text-slate-400 mt-1">
            Test and verify your conceptual retention across roadmap topics. Every attempt is stored in the database.
          </p>
        </div>

        {quizAttempts.length > 0 && (
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs">
            <span className="text-slate-400">Total Attempts:</span>
            <span className="font-bold text-slate-200">{quizAttempts.length} Recorded</span>
          </div>
        )}
      </div>

      {/* Active Quiz Taking Modal / View */}
      {activeQuiz ? (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl max-w-2xl mx-auto">
          {/* Quiz Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                Assessing: {activeQuiz.title}
              </span>
              <h2 className="text-lg font-bold text-slate-100 mt-0.5">
                {activeQuiz.questions && activeQuiz.questions.length > 0
                  ? `Question ${currentQuestionIndex + 1} of ${activeQuiz.questions.length}`
                  : 'Quiz'}
              </h2>
            </div>
            <button
              onClick={() => setActiveQuiz(null)}
              className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1 rounded-lg bg-slate-800"
            >
              Exit Quiz
            </button>
          </div>

          {/* Quiz Questions */}
          {!activeQuiz.questions || activeQuiz.questions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No questions found in this quiz.
            </div>
          ) : isSubmitted ? (
            /* Results Screen */
            <div className="text-center py-6 space-y-4">
              <div
                className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center ${
                  quizPassed
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {quizPassed ? <Award className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-100">{quizScore}%</h3>
                <p className="text-xs font-semibold mt-1">
                  {quizPassed ? (
                    <span className="text-emerald-400">Passed! Congratulations!</span>
                  ) : (
                    <span className="text-rose-400">
                      Did not meet passing score of {activeQuiz.passingScore}%. Keep studying!
                    </span>
                  )}
                </p>
              </div>

              {/* Review answers */}
              <div className="mt-6 text-left space-y-3 max-h-80 overflow-y-auto">
                {activeQuiz.questions.map((q, idx) => {
                  const studentAnswer = selectedAnswers[q.id];
                  const isCorrect = studentAnswer === q.correctOptionIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-3.5 rounded-xl border text-xs ${
                        isCorrect
                          ? 'bg-emerald-950/20 border-emerald-800/40'
                          : 'bg-rose-950/20 border-rose-800/40'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-semibold text-slate-200">
                            {idx + 1}. {q.questionText}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Your answer: {q.options[studentAnswer] || 'None'}
                          </p>
                          {!isCorrect && (
                            <p className="text-[11px] text-emerald-400 mt-0.5">
                              Correct answer: {q.options[q.correctOptionIndex]}
                            </p>
                          )}
                          {q.explanation && (
                            <p className="text-[10px] text-slate-400 italic mt-1 bg-slate-900/60 p-2 rounded-lg">
                              Explanation: {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => startQuiz(activeQuiz)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retake Quiz
                </button>
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Active Question Screen */
            <div>
              {(() => {
                const question = activeQuiz.questions[currentQuestionIndex];
                return (
                  <div>
                    <p className="text-sm font-semibold text-slate-100 mb-4 leading-relaxed">
                      {question.questionText}
                    </p>

                    <div className="space-y-2.5">
                      {question.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[question.id] === optIdx;

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(question.id, optIdx)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-brand-600/20 border-brand-500 text-brand-200 ring-1 ring-brand-500'
                                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                            }`}
                          >
                            <span className="inline-block w-5 text-slate-500 font-mono">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Navigation between questions */}
                    <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800">
                      <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs disabled:opacity-40"
                      >
                        Previous
                      </button>

                      {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                        <button
                          onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                          className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5"
                        >
                          Next <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitQuiz}
                          className="px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20"
                        >
                          Submit Quiz
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      ) : (
        /* Quiz Catalog */
        <div>
          {publishedQuizzes.length === 0 ? (
            <EmptyState
              icon="quiz"
              title="No Quizzes Available"
              description="No quizzes have been published yet. Your administrator will publish topic quizzes to test your understanding."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publishedQuizzes.map(quiz => {
                const parentTopic = topics.find(t => t.id === quiz.topicId);
                const attemptsForQuiz = quizAttempts.filter(qa => qa.quizId === quiz.id);
                const bestAttempt =
                  attemptsForQuiz.length > 0
                    ? attemptsForQuiz.reduce((max, a) => (a.score > max.score ? a : max))
                    : null;

                return (
                  <div
                    key={quiz.id}
                    className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">
                          Passing: {quiz.passingScore}%
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {quiz.difficulty}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-100">{quiz.title}</h3>
                      {parentTopic && (
                        <span className="text-[11px] text-brand-400 font-medium block mt-0.5">
                          Topic: {parentTopic.name}
                        </span>
                      )}

                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                        {quiz.description || 'Topic verification multiple choice questions.'}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                        <span>{quiz.questions?.length || 0} Questions</span>
                        {bestAttempt && (
                          <span
                            className={`font-semibold ${
                              bestAttempt.passed ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            Best: {bestAttempt.score}%
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => startQuiz(quiz)}
                      className="mt-4 w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      {bestAttempt ? 'Retake Quiz' : 'Start Quiz'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
