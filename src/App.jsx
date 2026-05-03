import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { supabase } from './supabase';
import {
  LEVELS, SECTIONS, TOPICS, TEST_DATE,
  getDaysUntilTest, getLevel, getNextLevel, calcXP, XP,
  getTopic, getTopicsBySection,
} from './content';
import { MODULES } from './test-smarts';
import { ShellGame } from './components/ShellGame';
import { SpaceInvadersOverlay } from './components/SpaceInvaders';
import './App.css';

// ─── Sound Effects ───
let audioCtx = null;
function getAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  }
  return audioCtx;
}

function sfxCorrect() {
  const ac = getAudio(); if (!ac) return;
  [523, 659, 784].forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.type = 'sine';
    const t = ac.currentTime + i * 0.08;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.start(t); osc.stop(t + 0.15);
  });
}

function sfxWrong() {
  const ac = getAudio(); if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain); gain.connect(ac.destination);
  osc.type = 'square';
  osc.frequency.setValueAtTime(200, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(120, ac.currentTime + 0.2);
  gain.gain.setValueAtTime(0.06, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.2);
  osc.start(ac.currentTime); osc.stop(ac.currentTime + 0.2);
}

function sfxLevelUp() {
  const ac = getAudio(); if (!ac) return;
  [440, 554, 659, 880].forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.type = 'triangle';
    const t = ac.currentTime + i * 0.1;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.start(t); osc.stop(t + 0.2);
  });
}

// ─── Streak Messages ───
function getStreakMessage(streak) {
  if (streak >= 20) return 'UNSTOPPABLE!';
  if (streak >= 15) return 'On fire!';
  if (streak >= 10) return 'Incredible streak!';
  if (streak >= 7) return 'You\'re locked in!';
  if (streak >= 5) return 'Five in a row!';
  if (streak >= 3) return 'Nice streak!';
  return '';
}

// ─── State Management ───
const STORAGE_KEY = 'erb_prep_progress_v2';
const SESSION_KEY = 'erb_prep_session_v2';

function defaultProgress() {
  return {
    xp: 0,
    modulesCompleted: [],          // strategy modules done
    topicsStarted: [],             // topic ids the user opened
    topicsCompleted: [],           // topic ids where user finished real practice
    topicStats: {},                // { topicId: { total, correct } }
    sessionCount: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    totalTimeSeconds: 0,
    sessionBonusAwarded: false,
  };
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultProgress(), ...JSON.parse(raw) };
  } catch {}
  return defaultProgress();
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      const now = Date.now();
      if (now - s.startedAt < 4 * 60 * 60 * 1000) return s;
    }
  } catch {}
  return { startedAt: Date.now(), questionsAnswered: 0, questionsCorrect: 0, xpEarned: 0 };
}

// ─── App Context ───
const AppContext = createContext(null);
function useApp() { return useContext(AppContext); }

// ─── Main App ───
export default function App() {
  const [screen, setScreen] = useState('home');
  const [progress, setProgress] = useState(loadProgress);
  const [session, setSession] = useState(loadSession);
  const [showShellGame, setShowShellGame] = useState(false);
  const [showSpaceInvaders, setShowSpaceInvaders] = useState(false);
  const [streak, setStreak] = useState(0);
  const [gameThreshold, setGameThreshold] = useState(10);
  const [xpFloat, setXpFloat] = useState(null);
  const [levelUp, setLevelUp] = useState(null);
  const spaceInvadersPlayed = useRef(false);
  const sessionTimerRef = useRef(null);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  useEffect(() => {
    sessionTimerRef.current = setInterval(() => {
      setSessionSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(sessionTimerRef.current);
  }, []);

  useEffect(() => {
    if (sessionSeconds >= 900 && !progress.sessionBonusAwarded) {
      addXP(XP.SESSION_15_MIN, true);
      setProgress(p => {
        const next = { ...p, sessionBonusAwarded: true };
        saveProgress(next);
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionSeconds, progress.sessionBonusAwarded]);

  function saveProgress(p) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    supabase.from('erb_live').upsert({
      id: 'max',
      xp: p.xp,
      level_name: getLevel(p.xp).name,
      current_screen: screen,
      test_smarts_completed: p.modulesCompleted,
      practice_unlocked: true,
      session_count: p.sessionCount,
      total_questions: p.totalQuestions,
      total_correct: p.totalCorrect,
      total_time_seconds: p.totalTimeSeconds,
      full_progress: p,
      updated_at: new Date().toISOString(),
    }).then(() => {});
  }

  function saveSession(s) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  }

  function addXP(amount) {
    setProgress(prev => {
      const oldLevel = getLevel(prev.xp);
      const newXP = prev.xp + amount;
      const newLevel = getLevel(newXP);
      const next = { ...prev, xp: newXP };
      if (newLevel.name !== oldLevel.name) {
        setLevelUp(newLevel);
        sfxLevelUp();
        setTimeout(() => setLevelUp(null), 3000);
      }
      saveProgress(next);
      return next;
    });
    setXpFloat({ amount, id: Date.now() });
    setTimeout(() => setXpFloat(null), 1200);
  }

  function completeModule(moduleId) {
    setProgress(prev => {
      if (prev.modulesCompleted.includes(moduleId)) return prev;
      const next = {
        ...prev,
        modulesCompleted: [...prev.modulesCompleted, moduleId],
        xp: prev.xp + XP.TEST_SMARTS_MODULE,
      };
      const oldLevel = getLevel(prev.xp);
      const newLevel = getLevel(next.xp);
      if (newLevel.name !== oldLevel.name) {
        setLevelUp(newLevel);
        setTimeout(() => setLevelUp(null), 3000);
      }
      saveProgress(next);
      return next;
    });
    setXpFloat({ amount: XP.TEST_SMARTS_MODULE, id: Date.now() });
    setTimeout(() => setXpFloat(null), 1200);
  }

  function markTopicStarted(topicId) {
    setProgress(prev => {
      if (prev.topicsStarted.includes(topicId)) return prev;
      const next = {
        ...prev,
        topicsStarted: [...prev.topicsStarted, topicId],
        xp: prev.xp + XP.TOPIC_LESSON,
      };
      saveProgress(next);
      return next;
    });
    setXpFloat({ amount: XP.TOPIC_LESSON, id: Date.now() });
    setTimeout(() => setXpFloat(null), 1200);
  }

  function markTopicCompleted(topicId) {
    setProgress(prev => {
      if (prev.topicsCompleted.includes(topicId)) return prev;
      const next = {
        ...prev,
        topicsCompleted: [...prev.topicsCompleted, topicId],
        xp: prev.xp + XP.TOPIC_COMPLETE,
      };
      const oldLevel = getLevel(prev.xp);
      const newLevel = getLevel(next.xp);
      if (newLevel.name !== oldLevel.name) {
        setLevelUp(newLevel);
        sfxLevelUp();
        setTimeout(() => setLevelUp(null), 3000);
      }
      saveProgress(next);
      return next;
    });
    setXpFloat({ amount: XP.TOPIC_COMPLETE, id: Date.now() });
    setTimeout(() => setXpFloat(null), 1200);
  }

  function logAnswer(topicId, questionId, questionText, correctAnswer, givenAnswer, correct, firstTry, timeMs) {
    supabase.from('erb_answers').insert({
      section: topicId,
      topic: topicId,
      question_id: questionId,
      question_text: questionText,
      correct_answer: correctAnswer,
      given_answer: givenAnswer,
      correct, first_try: firstTry, time_spent_ms: timeMs,
    }).then(() => {});

    setProgress(prev => {
      const stats = { ...prev.topicStats };
      if (!stats[topicId]) stats[topicId] = { total: 0, correct: 0 };
      stats[topicId] = {
        total: stats[topicId].total + 1,
        correct: stats[topicId].correct + (correct ? 1 : 0),
      };
      const next = {
        ...prev,
        topicStats: stats,
        totalQuestions: prev.totalQuestions + 1,
        totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
      };
      saveProgress(next);
      return next;
    });

    setSession(prev => {
      const next = {
        ...prev,
        questionsAnswered: prev.questionsAnswered + 1,
        questionsCorrect: prev.questionsCorrect + (correct ? 1 : 0),
      };
      saveSession(next);
      return next;
    });
  }

  function handleCorrectAnswer(firstTry, currentStreak) {
    const newStreak = currentStreak + 1;
    const xp = calcXP(true, firstTry, newStreak);
    addXP(xp);
    sfxCorrect();

    if (newStreak >= gameThreshold) {
      setShowShellGame(true);
      setStreak(0);
      setGameThreshold(prev => prev + 5);
      return 0;
    }

    if (newStreak >= 20 && !spaceInvadersPlayed.current) {
      spaceInvadersPlayed.current = true;
      setShowSpaceInvaders(true);
      return newStreak;
    }

    return newStreak;
  }

  function handleWrongAnswer() {
    addXP(XP.WRONG);
    sfxWrong();
    setStreak(0);
    return 0;
  }

  const ctx = {
    screen, setScreen, progress, session, streak, setStreak,
    addXP, completeModule, markTopicStarted, markTopicCompleted,
    logAnswer, handleCorrectAnswer, handleWrongAnswer, sessionSeconds,
    showShellGame, setShowShellGame, showSpaceInvaders, setShowSpaceInvaders,
  };

  return (
    <AppContext.Provider value={ctx}>
      <div className="app">
        {xpFloat && (
          <div className="xp-float" key={xpFloat.id}>+{xpFloat.amount} XP</div>
        )}

        {levelUp && (
          <div className="level-up-overlay">
            <div className="level-up-card">
              <div className="level-up-icon">{levelUp.icon}</div>
              <div className="level-up-text">LEVEL UP!</div>
              <div className="level-up-name">{levelUp.name}</div>
            </div>
          </div>
        )}

        {showShellGame && (
          <div className="game-overlay">
            <ShellGame onComplete={() => setShowShellGame(false)} />
          </div>
        )}

        {showSpaceInvaders && (
          <div className="game-overlay">
            <SpaceInvadersOverlay onClose={() => setShowSpaceInvaders(false)} />
          </div>
        )}

        {screen === 'home' && <HomeScreen />}
        {screen === 'strategy' && <ModuleScreen moduleId="eliminate" />}
        {screen === 'topics' && <TopicMenu />}
        {screen.startsWith('topic:') && <TopicScreen topicId={screen.split(':')[1]} />}
      </div>
    </AppContext.Provider>
  );
}

// ─── Home Screen ───
function HomeScreen() {
  const { progress, setScreen, sessionSeconds } = useApp();
  const level = getLevel(progress.xp);
  const nextLevel = getNextLevel(progress.xp);
  const daysLeft = getDaysUntilTest();
  const pct = nextLevel
    ? Math.round(((progress.xp - level.xp) / (nextLevel.xp - level.xp)) * 100)
    : 100;
  const accuracy = progress.totalQuestions > 0
    ? Math.round((progress.totalCorrect / progress.totalQuestions) * 100)
    : 0;
  const sessionMin = Math.floor(sessionSeconds / 60);
  const strategyDone = progress.modulesCompleted.includes('eliminate');
  const topicsDone = progress.topicsCompleted.length;
  const topicsTotal = TOPICS.length;

  return (
    <div className="screen home-screen">
      <header className="home-header">
        <h1 className="app-title">ERB Prep</h1>
        <div className="countdown">
          <span className="countdown-num">{daysLeft}</span>
          <span className="countdown-label">{daysLeft === 1 ? 'day' : 'days'} until test</span>
        </div>
      </header>

      <div className="level-bar">
        <div className="level-info">
          <span className="level-icon">{level.icon}</span>
          <span className="level-name">{level.name}</span>
          <span className="xp-count">{progress.xp} XP</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        {nextLevel && (
          <div className="next-level">{nextLevel.xp - progress.xp} XP to {nextLevel.name}</div>
        )}
      </div>

      <div className="session-banner">
        <span>Session: {sessionMin} min</span>
        {sessionMin >= 15 && <span className="session-target">Daily target hit!</span>}
        {sessionMin < 15 && <span className="session-remaining">{15 - sessionMin} min to daily target</span>}
      </div>

      <div className="home-cards">
        <button className="home-card test-smarts-card" onClick={() => setScreen('strategy')}>
          <div className="card-icon">{strategyDone ? '✅' : '✂️'}</div>
          <div className="card-title">Strategy</div>
          <div className="card-desc">How to eliminate wrong answers — the only test-taking strategy that matters</div>
          <div className="card-progress">
            {strategyDone ? 'Done — review anytime' : '8 questions · ~5 min'}
          </div>
        </button>

        <button className="home-card practice-card" onClick={() => setScreen('topics')}>
          <div className="card-icon">📝</div>
          <div className="card-title">Practice by Question Type</div>
          <div className="card-desc">
            Each type teaches the format, then drills it until it sticks
          </div>
          <div className="card-progress">
            {topicsDone}/{topicsTotal} types complete
            {progress.totalQuestions > 0 && ` · ${accuracy}% accuracy`}
          </div>
        </button>
      </div>

      {progress.totalQuestions > 0 && (
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-num">{progress.totalQuestions}</div>
            <div className="stat-label">Questions</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">{accuracy}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">{Math.round(progress.totalTimeSeconds / 60) || 0}</div>
            <div className="stat-label">Minutes</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Module Screen (the one strategy module) ───
function ModuleScreen({ moduleId }) {
  const { setScreen, completeModule, progress, handleCorrectAnswer, handleWrongAnswer, logAnswer } = useApp();
  const mod = MODULES.find(m => m.id === moduleId);
  const [phase, setPhase] = useState('intro');
  const [slideIndex, setSlideIndex] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreakLocal] = useState(0);
  const [score, setScore] = useState({ total: 0, correct: 0 });

  if (!mod) return null;

  const slides = mod.intro.slides;
  const questions = mod.practice;
  const currentQ = questions[practiceIndex];
  const isAlreadyDone = progress.modulesCompleted.includes(moduleId);

  function handleSelect(idx) {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const correct = idx === currentQ.answer;
    const newScore = { ...score, total: score.total + 1, correct: score.correct + (correct ? 1 : 0) };
    setScore(newScore);

    logAnswer('strategy', currentQ.id, currentQ.scenario, String(currentQ.answer), String(idx), correct, true, 0);

    if (correct) {
      const ns = handleCorrectAnswer(true, streak);
      setStreakLocal(ns);
    } else {
      handleWrongAnswer();
      setStreakLocal(0);
    }
  }

  function nextQuestion() {
    if (practiceIndex < questions.length - 1) {
      setPracticeIndex(practiceIndex + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setPhase('complete');
      if (!isAlreadyDone) completeModule(moduleId);
    }
  }

  if (phase === 'intro') {
    const slide = slides[slideIndex];
    return (
      <div className="screen module-screen">
        <div className="screen-header">
          <button className="back-btn" onClick={() => setScreen('home')}>← Home</button>
          <h2>{mod.intro.title}</h2>
        </div>
        <div className="slide-container">
          <div className="slide-progress">
            {slides.map((_, i) => (
              <div key={i} className={`slide-dot ${i === slideIndex ? 'active' : ''} ${i < slideIndex ? 'done' : ''}`} />
            ))}
          </div>
          <div className="slide-content">
            <p className="slide-text">{slide.text}</p>
            <div className="slide-highlight">{slide.highlight}</div>
            {slide.example && (
              <div className="slide-example">{slide.example}</div>
            )}
          </div>
          <div className="slide-nav">
            {slideIndex > 0 && (
              <button className="secondary-btn" onClick={() => setSlideIndex(slideIndex - 1)}>Back</button>
            )}
            {slideIndex < slides.length - 1 ? (
              <button className="primary-btn" onClick={() => setSlideIndex(slideIndex + 1)}>Next</button>
            ) : (
              <button className="primary-btn" onClick={() => setPhase('practice')}>Start Practice</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'practice') {
    return (
      <div className="screen module-screen">
        <div className="screen-header">
          <button className="back-btn" onClick={() => setScreen('home')}>← Home</button>
          <h2>{mod.name}</h2>
          <span className="q-counter">{practiceIndex + 1}/{questions.length}</span>
        </div>
        <div className="question-container">
          <p className="question-text" style={{ whiteSpace: 'pre-wrap' }}>{currentQ.scenario}</p>
          <div className="choices">
            {currentQ.choices.map((choice, i) => (
              <button
                key={i}
                className={`choice-btn ${
                  selected !== null
                    ? i === currentQ.answer
                      ? 'correct'
                      : i === selected
                        ? 'wrong'
                        : 'dimmed'
                    : ''
                }`}
                onClick={() => handleSelect(i)}
                disabled={selected !== null}
              >
                <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
                <span className="choice-text">{choice}</span>
              </button>
            ))}
          </div>
          {showExplanation && (
            <div className={`explanation ${selected === currentQ.answer ? 'correct' : 'wrong'}`}>
              <div className="explanation-icon">{selected === currentQ.answer ? '✓' : '✗'}</div>
              <p>{currentQ.explanation}</p>
              <button className="primary-btn" onClick={nextQuestion}>
                {practiceIndex < questions.length - 1 ? 'Next' : 'Finish'}
              </button>
            </div>
          )}
        </div>
        {streak >= 3 && (
          <div className="streak-display">
            {'🔥'.repeat(Math.min(Math.floor(streak / 5) + 1, 3))} {streak} in a row!
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="screen module-screen complete-screen">
      {!isAlreadyDone && <Confetti />}
      <div className="complete-card">
        <div className="complete-icon">🎉</div>
        <h2>Strategy Done!</h2>
        <p className="complete-name">{mod.name}</p>
        <div className="complete-stats">
          <div className="complete-score">{score.correct}/{score.total} correct</div>
          {!isAlreadyDone && <div className="bonus-xp">+{XP.TEST_SMARTS_MODULE} XP bonus!</div>}
        </div>
        <p className="complete-message">Now use these moves on every practice question.</p>
        <div className="complete-actions">
          <button className="primary-btn" onClick={() => setScreen('topics')}>Practice Question Types</button>
          <button className="secondary-btn" onClick={() => setScreen('home')}>Home</button>
        </div>
      </div>
    </div>
  );
}

// ─── Topic Menu ───
function TopicMenu() {
  const { setScreen, progress } = useApp();

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => setScreen('home')}>← Home</button>
        <h2>Question Types</h2>
      </div>
      <p className="screen-desc">Pick a question type. Each one starts with a quick lesson, then warmup questions, then real practice.</p>

      {SECTIONS.map(section => {
        const topics = getTopicsBySection(section.id);
        if (topics.length === 0) return null;
        return (
          <div key={section.id} className="topic-section-group" style={{ '--section-color': section.color }}>
            <div className="topic-section-header">
              <span className="topic-section-icon">{section.icon}</span>
              <span className="topic-section-name">{section.name}</span>
            </div>
            <div className="topic-list">
              {topics.map(topic => {
                const stats = progress.topicStats[topic.id];
                const accuracy = stats && stats.total > 0
                  ? Math.round((stats.correct / stats.total) * 100)
                  : null;
                const completed = progress.topicsCompleted.includes(topic.id);
                const started = progress.topicsStarted.includes(topic.id);

                return (
                  <button
                    key={topic.id}
                    className={`topic-card ${completed ? 'completed' : ''} ${started ? 'started' : ''}`}
                    onClick={() => setScreen(`topic:${topic.id}`)}
                  >
                    <div className="topic-card-icon">
                      {completed ? '✅' : topic.icon}
                    </div>
                    <div className="topic-card-info">
                      <div className="topic-card-name">
                        {topic.name}
                        {topic.priority === 'critical' && (
                          <span className="critical-badge" title="School doesn't teach this — biggest score gain">★</span>
                        )}
                      </div>
                      <div className="topic-card-meta">
                        {!started && 'New — start with the lesson'}
                        {started && !completed && stats && `In progress · ${stats.correct}/${stats.total} (${accuracy}%)`}
                        {started && !completed && !stats && 'Lesson done — start practice'}
                        {completed && stats && `Done · ${stats.correct}/${stats.total} (${accuracy}%)`}
                      </div>
                    </div>
                    {accuracy !== null && (
                      <div className="topic-card-accuracy">
                        <div
                          className="topic-accuracy-bar"
                          style={{
                            width: `${accuracy}%`,
                            background: accuracy >= 80 ? 'var(--correct)' : accuracy >= 60 ? 'var(--accent)' : 'var(--wrong)',
                          }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Topic Screen (Lesson → Warmups → Practice → Done) ───
function TopicScreen({ topicId }) {
  const {
    setScreen, progress,
    handleCorrectAnswer, handleWrongAnswer, logAnswer,
    markTopicStarted, markTopicCompleted,
  } = useApp();
  const topic = getTopic(topicId);

  // Phase: lesson | warmup | practice | done
  const [phase, setPhase] = useState('lesson');
  const [lessonIndex, setLessonIndex] = useState(0);

  // Reading topics use passages instead of flat questions
  const isReading = topic && topic.passages && topic.passages.length > 0;
  const allItems = isReading
    ? topic.passages.flatMap(p => p.questions.map(q => ({ ...q, passageId: p.id, passageTitle: p.title, passageText: p.text })))
    : (topic ? topic.questions : []);
  const warmups = (topic && topic.warmups) || [];

  const [warmupIndex, setWarmupIndex] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreakLocal] = useState(0);
  const [warmupScore, setWarmupScore] = useState({ total: 0, correct: 0 });
  const [practiceScore, setPracticeScore] = useState({ total: 0, correct: 0 });
  const [eliminated, setEliminated] = useState([]);
  const [showPassage, setShowPassage] = useState(true);
  const startTime = useRef(Date.now());

  if (!topic) return null;

  const currentQ = phase === 'warmup' ? warmups[warmupIndex] : allItems[practiceIndex];

  function startPractice() {
    if (!progress.topicsStarted.includes(topicId)) {
      markTopicStarted(topicId);
    }
    if (warmups.length > 0) {
      setPhase('warmup');
    } else {
      setPhase('practice');
    }
    startTime.current = Date.now();
  }

  function handleSelect(idx) {
    if (selected !== null) return;
    if (eliminated.includes(idx)) return;
    setSelected(idx);
    setShowExplanation(true);
    const correct = idx === currentQ.answer;
    const timeMs = Date.now() - startTime.current;

    if (phase === 'practice') {
      logAnswer(
        topicId, currentQ.id, currentQ.question || currentQ.scenario || '',
        String(currentQ.answer), String(idx), correct, true, timeMs
      );
      setPracticeScore(s => ({ total: s.total + 1, correct: s.correct + (correct ? 1 : 0) }));
    } else {
      // warmup — log but don't count toward main stats
      setWarmupScore(s => ({ total: s.total + 1, correct: s.correct + (correct ? 1 : 0) }));
    }

    if (correct) {
      const ns = handleCorrectAnswer(true, streak);
      setStreakLocal(ns);
    } else {
      handleWrongAnswer();
      setStreakLocal(0);
    }
  }

  function handleEliminate(idx) {
    if (selected !== null) return;
    if (idx === currentQ.answer) return;
    if (eliminated.includes(idx)) {
      setEliminated(eliminated.filter(e => e !== idx));
    } else if (eliminated.length < 2) {
      setEliminated([...eliminated, idx]);
    }
  }

  function nextQuestion() {
    if (phase === 'warmup') {
      if (warmupIndex < warmups.length - 1) {
        setWarmupIndex(warmupIndex + 1);
        setSelected(null);
        setShowExplanation(false);
        setEliminated([]);
        startTime.current = Date.now();
      } else {
        setPhase('practice');
        setSelected(null);
        setShowExplanation(false);
        setEliminated([]);
        startTime.current = Date.now();
      }
    } else {
      if (practiceIndex < allItems.length - 1) {
        setPracticeIndex(practiceIndex + 1);
        setSelected(null);
        setShowExplanation(false);
        setEliminated([]);
        startTime.current = Date.now();
      } else {
        setPhase('done');
        if (!progress.topicsCompleted.includes(topicId)) {
          markTopicCompleted(topicId);
        }
      }
    }
  }

  // ─── LESSON PHASE ───
  if (phase === 'lesson') {
    const sec = topic.lesson.sections[lessonIndex];
    const isLast = lessonIndex >= topic.lesson.sections.length - 1;
    return (
      <div className="screen lesson-screen">
        <div className="screen-header">
          <button className="back-btn" onClick={() => setScreen('topics')}>← All Types</button>
          <h2>{topic.name}</h2>
        </div>
        <div className="lesson-container">
          <div className="lesson-progress">
            {topic.lesson.sections.map((_, i) => (
              <div key={i} className={`slide-dot ${i === lessonIndex ? 'active' : ''} ${i < lessonIndex ? 'done' : ''}`} />
            ))}
          </div>
          <div className="lesson-content">
            <h3 className="lesson-heading">{sec.heading}</h3>
            <p className="lesson-body" style={{ whiteSpace: 'pre-wrap' }}>{sec.body}</p>
            {sec.example && (
              <div className="lesson-example">
                <div className="lesson-example-label">Example</div>
                <pre className="lesson-example-text">{sec.example}</pre>
              </div>
            )}
          </div>
          <div className="slide-nav">
            {lessonIndex > 0 && (
              <button className="secondary-btn" onClick={() => setLessonIndex(lessonIndex - 1)}>Back</button>
            )}
            {!isLast ? (
              <button className="primary-btn" onClick={() => setLessonIndex(lessonIndex + 1)}>Next</button>
            ) : (
              <button className="primary-btn" onClick={startPractice}>
                {warmups.length > 0 ? 'Start Easy Warmups' : 'Start Practice'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── WARMUP / PRACTICE PHASE ───
  if (phase === 'warmup' || phase === 'practice') {
    const isWarmup = phase === 'warmup';
    const total = isWarmup ? warmups.length : allItems.length;
    const idx = isWarmup ? warmupIndex : practiceIndex;
    const score = isWarmup ? warmupScore : practiceScore;
    const passageText = !isWarmup && currentQ.passageText;
    const passageTitle = !isWarmup && currentQ.passageTitle;

    // Use wrong-answer specific explanation if available
    const wrongExp = !isWarmup && currentQ.wrongExplanations && currentQ.wrongExplanations[selected];
    const explanationToShow = (selected !== currentQ.answer && wrongExp)
      ? `${wrongExp}\n\n→ Correct: ${currentQ.explanation}`
      : currentQ.explanation;

    return (
      <div className="screen practice-screen">
        <div className="screen-header">
          <button className="back-btn" onClick={() => setScreen('topics')}>← All Types</button>
          <h2>
            {topic.name}
            {isWarmup && <span className="phase-tag warmup-tag"> · WARMUP</span>}
          </h2>
          <span className="q-counter">{idx + 1}/{total}</span>
        </div>
        <div className="question-progress">
          <div className="question-progress-fill" style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
        <div className="score-bar">
          <span>{score.correct} correct</span>
          <span className="score-accuracy">
            {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
          </span>
        </div>

        {passageText && (
          <div className="reading-layout">
            <button
              className="toggle-passage-btn"
              onClick={() => setShowPassage(!showPassage)}
            >
              {showPassage ? 'Hide Passage' : 'Show Passage'}
            </button>
            {showPassage && (
              <div className="passage-container">
                <div className="passage-title">{passageTitle}</div>
                {passageText.split('\n\n').map((para, i) => (
                  <p key={i} className="passage-para">{para}</p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="question-container">
          {currentQ.context && <div className="question-context">{currentQ.context}</div>}
          <p className="question-text" style={{ whiteSpace: 'pre-wrap' }}>{currentQ.question || currentQ.scenario}</p>

          <div className="choices">
            {currentQ.choices.map((choice, i) => (
              <div key={i} className="choice-row">
                <button
                  className={`choice-btn ${
                    eliminated.includes(i) ? 'eliminated' : ''
                  } ${
                    selected !== null
                      ? i === currentQ.answer
                        ? 'correct'
                        : i === selected
                          ? 'wrong'
                          : 'dimmed'
                      : ''
                  }`}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null || eliminated.includes(i)}
                >
                  <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="choice-text">{choice}</span>
                </button>
                {selected === null && !eliminated.includes(i) && (
                  <button
                    className="eliminate-btn"
                    onClick={(e) => { e.stopPropagation(); handleEliminate(i); }}
                    title="Cross out this choice"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {selected === null && eliminated.length > 0 && (
            <div className="eliminate-hint">
              {eliminated.length} crossed out — {4 - eliminated.length} remaining ({Math.round(100 / (4 - eliminated.length))}% chance!)
            </div>
          )}

          {showExplanation && (
            <div className={`explanation ${selected === currentQ.answer ? 'correct' : 'wrong'}`}>
              <div className="explanation-icon">{selected === currentQ.answer ? '✓' : '✗'}</div>
              <p style={{ whiteSpace: 'pre-wrap' }}>{explanationToShow}</p>
              <button className="primary-btn" onClick={nextQuestion}>
                {idx < total - 1
                  ? 'Next Question'
                  : (isWarmup ? 'Start Real Practice' : 'Finish')}
              </button>
            </div>
          )}
        </div>

        {streak >= 3 && (
          <div className="streak-display">
            {'🔥'.repeat(Math.min(Math.floor(streak / 5) + 1, 3))} {getStreakMessage(streak)}
          </div>
        )}
      </div>
    );
  }

  // ─── DONE PHASE ───
  const accuracy = practiceScore.total > 0 ? Math.round((practiceScore.correct / practiceScore.total) * 100) : 0;
  const message = accuracy >= 90 ? 'You\'ve got this question type. Don\'t even worry about it.'
    : accuracy >= 75 ? 'Strong. You know the moves. Keep them sharp.'
    : accuracy >= 60 ? 'Solid foundation. One more pass through this type would help.'
    : 'Worth coming back to — review the lesson and try again.';
  const isFirstTime = !progress.topicsCompleted.includes(topicId);

  return (
    <div className="screen complete-screen">
      {isFirstTime && <Confetti />}
      <div className="complete-card">
        <div className="complete-icon">{accuracy >= 75 ? '🎉' : accuracy >= 60 ? '💪' : '📚'}</div>
        <h2>Type Complete!</h2>
        <p className="complete-name">{topic.name}</p>
        <div className="complete-stats">
          <div className="complete-score">{practiceScore.correct}/{practiceScore.total}</div>
          <div className="complete-accuracy" style={{ color: accuracy >= 75 ? 'var(--correct)' : accuracy >= 60 ? 'var(--accent)' : 'var(--wrong)' }}>
            {accuracy}%
          </div>
        </div>
        <p className="complete-message">{message}</p>
        <div className="complete-actions">
          <button className="secondary-btn" onClick={() => {
            setPhase('lesson');
            setLessonIndex(0);
            setWarmupIndex(0);
            setPracticeIndex(0);
            setSelected(null);
            setShowExplanation(false);
            setEliminated([]);
            setWarmupScore({ total: 0, correct: 0 });
            setPracticeScore({ total: 0, correct: 0 });
            setStreakLocal(0);
          }}>Try Again</button>
          <button className="primary-btn" onClick={() => setScreen('topics')}>Pick Another Type</button>
        </div>
      </div>
    </div>
  );
}

// ─── Confetti ───
function Confetti() {
  const pieces = useRef(Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)],
    size: 4 + Math.random() * 6,
    rotation: Math.random() * 360,
  }))).current;

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
