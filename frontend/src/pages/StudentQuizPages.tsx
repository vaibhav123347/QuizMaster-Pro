import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle2, Send } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ConfirmModal } from '../components/ConfirmModal';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { QuestionNavigation } from '../components/QuestionNavigation';
import { QuizTimer } from '../components/QuizTimer';
import {
  attemptService,
  dashboardService,
  quizService,
} from '../services/quizPlatformService';
import { extractApiError } from '../services/apiClient';
import {
  AttemptAnswerState,
  LeaderboardEntry,
  Quiz,
  QuizAttemptSummary,
  StartAttemptPayload,
} from '../types';
import { formatDateTime, formatDuration } from '../utils/formatters';

export const QuizInstructionsPage: React.FC = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (quizId) {
      quizService.getById(quizId).then(setQuiz).catch((err) =>
        setError(extractApiError(err, 'Unable to load quiz instructions'))
      );
    }
  }, [quizId]);

  if (error) return <ErrorBanner message={error} />;
  if (!quiz) return <LoadingSpinner message="Loading assessment..." />;

  return (
    <div className="mx-auto" style={{ maxWidth: 920 }}>
      <Link to="/student/quizzes" className="btn btn-cyber-outline btn-sm mb-3">
        <ArrowLeft size={15} className="me-2" /> Back to quizzes
      </Link>
      <div className="qm-card p-4 p-md-5">
        <div className="text-info small fw-semibold text-uppercase mb-2">Quiz Instructions</div>
        <h1 className="h2 text-white mb-3">{quiz.title}</h1>
        <p className="text-secondary">{quiz.description}</p>
        <div className="row g-3 my-3">
          <div className="col-6 col-md-3"><div className="qm-surface p-3"><div className="text-muted small">Duration</div><b>{quiz.durationMinutes} min</b></div></div>
          <div className="col-6 col-md-3"><div className="qm-surface p-3"><div className="text-muted small">Questions</div><b>{quiz.questionCount}</b></div></div>
          <div className="col-6 col-md-3"><div className="qm-surface p-3"><div className="text-muted small">Marks</div><b>{quiz.totalMarks}</b></div></div>
          <div className="col-6 col-md-3"><div className="qm-surface p-3"><div className="text-muted small">Passing</div><b>{quiz.passingPercentage}%</b></div></div>
        </div>
        <ul className="text-secondary small lh-lg">
          <li>The timer starts immediately after you begin.</li>
          <li>Answers are saved periodically and on submission.</li>
          <li>The quiz submits automatically when time expires.</li>
        </ul>
        <Link to={`/student/quizzes/${quiz._id}/take`} className="btn btn-cyber px-4">
          Start Quiz <ArrowRight size={16} className="ms-2" />
        </Link>
      </div>
    </div>
  );
};

export const QuizTakePage: React.FC = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<StartAttemptPayload | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AttemptAnswerState>>({});
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!quizId) return;
    attemptService.start(quizId).then((data) => {
      setAttempt(data);
      setRemaining(data.attempt.remainingSeconds);
      setAnswers(Object.fromEntries(data.attempt.answers.map((answer) => [answer.questionId, answer])));
    }).catch((err) => setError(extractApiError(err, 'Unable to start quiz')));
  }, [quizId]);

  useEffect(() => {
    if (!attempt) return;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [attempt]);

  useEffect(() => {
    if (remaining === 0 && attempt) void submit(true);
  }, [remaining]);

  const answerList = () => Object.values(answers);

  const updateAnswer = (selectedOptionIndex: number | null, markedForReview?: boolean) => {
    if (!attempt) return;
    const question = attempt.questions[current];
    const previous = answers[question._id] || {
      questionId: question._id,
      selectedOptionIndex: null,
      markedForReview: false,
    };
    const next = {
      ...previous,
      selectedOptionIndex,
      markedForReview: markedForReview ?? previous.markedForReview,
    };
    setAnswers((state) => ({ ...state, [question._id]: next }));
  };

  const submit = async (autoSubmitted = false) => {
    if (!attempt || submitting) return;
    setSubmitting(true);
    try {
      await attemptService.saveProgress(attempt.attempt._id, answerList());
      await attemptService.submit(attempt.attempt._id, answerList(), autoSubmitted);
      navigate(`/student/results/${attempt.attempt._id}`, { replace: true });
    } catch (err) {
      setError(extractApiError(err, 'Unable to submit quiz'));
      setSubmitting(false);
    }
  };

  if (error) return <ErrorBanner message={error} />;
  if (!attempt) return <LoadingSpinner fullScreen message="Starting secure assessment..." />;

  const question = attempt.questions[current];
  const answer = answers[question._id];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div><div className="text-info small fw-semibold">{attempt.quiz.title}</div><h1 className="h5 text-white mb-0">Question {current + 1} of {attempt.questions.length}</h1></div>
        <QuizTimer remainingSeconds={remaining} />
      </div>
      <div className="row g-3">
        <div className="col-lg-8">
          <div className="qm-card p-4">
            <div className="text-secondary small mb-2">{question.difficulty} · {question.marks} marks</div>
            <h2 className="h5 text-white lh-base mb-4">{question.text}</h2>
            <div className="d-grid gap-3">
              {question.options.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  className={`btn text-start p-3 ${answer?.selectedOptionIndex === index ? 'btn-cyber' : 'btn-cyber-outline'}`}
                  onClick={() => updateAnswer(index)}
                >
                  <b className="me-2">{String.fromCharCode(65 + index)}.</b>{option}
                </button>
              ))}
            </div>
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button type="button" className="btn btn-cyber-outline" onClick={() => updateAnswer(answer?.selectedOptionIndex ?? null, !answer?.markedForReview)}>
                <Bookmark size={16} className="me-2" /> {answer?.markedForReview ? 'Unmark review' : 'Mark for review'}
              </button>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-cyber-outline" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)}>Previous</button>
                {current < attempt.questions.length - 1
                  ? <button type="button" className="btn btn-cyber" onClick={() => setCurrent((value) => value + 1)}>Next <ArrowRight size={15} className="ms-1" /></button>
                  : <button type="button" className="btn btn-cyber" onClick={() => setConfirm(true)}><Send size={15} className="me-2" />Submit</button>}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <QuestionNavigation questions={attempt.questions} answersMap={answers} currentIndex={current} onSelect={setCurrent} />
        </div>
      </div>
      <ConfirmModal isOpen={confirm} title="Submit assessment" message="Once submitted, answers cannot be changed." confirmLabel="Submit Quiz" variant="primary" isLoading={submitting} onConfirm={() => void submit(false)} onCancel={() => setConfirm(false)} />
    </div>
  );
};

export const QuizResultPage: React.FC = () => {
  const { attemptId } = useParams();
  const [result, setResult] = useState<{ attempt: QuizAttemptSummary; review: import('../types').AttemptReviewItem[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (attemptId) attemptService.getResult(attemptId).then(setResult).catch((err) => setError(extractApiError(err)));
  }, [attemptId]);

  if (error) return <ErrorBanner message={error} />;
  if (!result) return <LoadingSpinner message="Loading results..." />;
  const { attempt, review } = result;

  return (
    <div>
      <div className="qm-card p-4 p-md-5 text-center mb-4">
        <CheckCircle2 size={48} className={attempt.passed ? 'text-success' : 'text-danger'} />
        <h1 className="h3 text-white mt-3">{attempt.passed ? 'Assessment Passed' : 'Assessment Completed'}</h1>
        <p className="text-secondary">{attempt.quiz.title}</p>
        <div className="display-5 fw-bold text-info">{attempt.percentage.toFixed(1)}%</div>
        <div className="text-secondary">{attempt.scoredMarks} / {attempt.totalMarks} marks · {formatDuration(attempt.timeTakenSeconds)}</div>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Link to="/student/history" className="btn btn-cyber-outline">View History</Link>
          <Link to="/student/quizzes" className="btn btn-cyber">Try Another Quiz</Link>
        </div>
      </div>
      <h2 className="h5 text-white mb-3">Answer Review</h2>
      {review.map((item) => (
        <div key={item.questionId} className={`qm-card p-3 mb-3 border ${item.isCorrect ? 'border-success' : 'border-danger'} border-opacity-25`}>
          <div className="d-flex justify-content-between gap-3"><b className="text-white">{item.questionNumber}. {item.text}</b><span className={item.isCorrect ? 'text-success' : 'text-danger'}>{item.marksAwarded}/{item.marks}</span></div>
          {item.selectedOptionIndex !== null && <div className="small text-secondary mt-2">Your answer: {item.options[item.selectedOptionIndex]}</div>}
          <div className="small text-info mt-1">Correct answer: {item.correctOptionIndex !== null ? item.options[item.correctOptionIndex] : 'Unavailable'}</div>
          {item.explanation && <div className="small text-secondary mt-2">{item.explanation}</div>}
        </div>
      ))}
    </div>
  );
};

export const QuizHistoryPage: React.FC = () => {
  const [attempts, setAttempts] = useState<QuizAttemptSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { attemptService.getMyHistory(1, 50).then((data) => setAttempts(data.attempts)).catch((err) => setError(extractApiError(err))); }, []);
  if (error) return <ErrorBanner message={error} />;
  return (
    <div>
      <h1 className="h3 text-white mb-4">Quiz History</h1>
      {attempts.length === 0 ? <div className="qm-card p-5 text-center text-secondary">No quiz attempts yet.</div> : attempts.map((attempt) => (
        <div key={attempt._id} className="qm-card p-3 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div><b className="text-white">{attempt.quiz.title}</b><div className="text-muted small">{formatDateTime(attempt.submittedAt)} · {formatDuration(attempt.timeTakenSeconds)}</div></div>
          <div className="d-flex align-items-center gap-3"><b className={attempt.passed ? 'text-success' : 'text-danger'}>{attempt.percentage.toFixed(1)}%</b><Link to={`/student/results/${attempt._id}`} className="btn btn-cyber-outline btn-sm">Review</Link></div>
        </div>
      ))}
    </div>
  );
};

export const LeaderboardPage: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { dashboardService.getLeaderboard({ limit: 50 }).then(setEntries).catch((err) => setError(extractApiError(err))); }, []);
  if (error) return <ErrorBanner message={error} />;
  return (
    <div>
      <h1 className="h3 text-white mb-4">Leaderboard</h1>
      <div className="qm-card overflow-hidden">
        <div className="table-responsive"><table className="table table-dark table-hover align-middle mb-0">
          <thead><tr><th>#</th><th>Student</th><th>Attempts</th><th>Passed</th><th>Average</th><th>Best</th></tr></thead>
          <tbody>{entries.map((entry) => <tr key={entry.userId}><td><b>{entry.rank}</b></td><td><div className="text-white fw-semibold">{entry.name}</div><div className="text-muted small">{entry.department || 'Student'}</div></td><td>{entry.attemptsCount}</td><td>{entry.passedCount}</td><td>{entry.avgPercentage.toFixed(1)}%</td><td className="text-info fw-semibold">{entry.bestPercentage.toFixed(1)}%</td></tr>)}</tbody>
        </table></div>
      </div>
    </div>
  );
};
