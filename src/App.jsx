import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { supabase } from './supabase';
import { LEVELS, SECTIONS, TEST_DATE, getDaysUntilTest, getLevel, getNextLevel, calcXP, XP, getQuestions, READING_PASSAGES } from './content';
import { MODULES, REQUIRED_MODULES } from './test-smarts';
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
const STORAGE_KEY = 'erb_prep_progress';
const SESSION_KEY = 'erb_prep_session';

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultProgress();
}

function defaultProgress() {
  return {
    xp: 0,
    testSmartsCompleted: [],
    sectionStats: {},
    streak: 0,
    lastSessionDate: null,
    sessionCount: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    totalTimeSeconds: 0,
    sessionBonusAwarded: false,
  };
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
  return { startedAt: Date.now(), questionsAnswered: 0, questionsCorrect: 0, xpEarned: 0, sections: [] };
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

  // Session timer
  useEffect(() => {
    sessionTimerRef.current = setInterval(() => {
      setSessionSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(sessionTimerRef.current);
  }, []);

  // 15-minute session bonus
  useEffect(() => {
    if (sessionSeconds >= 900 && !progress.sessionBonusAwarded) {
      addXP(XP.SESSION_15_MIN, true);
      setProgress(p => {
        const next = { ...p, sessionBonusAwarded: true };
        saveProgress(next);
        return next;
      });
    }
  }, [sessionSeconds, progress.sessionBonusAwarded]);

  // Persist
  function saveProgress(p) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    supabase.from('erb_live').upsert({
      id: 'max',
      xp: p.xp,
      level_name: getLevel(p.xp).name,
      current_screen: screen,
      test_smarts_completed: p.testSmartsCompleted,
      practice_unlocked: isPracticeUnlocked(p),
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

  function isPracticeUnlocked(p = progress) {
    return REQUIRED_MODULES.every(id => p.testSmartsCompleted.includes(id));
  }

  function addXP(amount, isBonus = false) {
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

  function completeTestSmarts(moduleId) {
    setProgress(prev => {
      if (prev.testSmartsCompleted.includes(moduleId)) return prev;
      const next = {
        ...prev,
        testSmartsCompleted: [...prev.testSmartsCompleted, moduleId],
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

  function logAnswer(section, topic, questionId, questionText, correctAnswer, givenAnswer, correct, firstTry, timeMs) {
    supabase.from('erb_answers').insert({
      section, topic, question_id: questionId, question_text: questionText,
      correct_answer: correctAnswer, given_answer: givenAnswer,
      correct, first_try: firstTry, time_spent_ms: timeMs,
    }).then(() => {});

    setProgress(prev => {
      const stats = { ...prev.sectionStats };
      if (!stats[section]) stats[section] = { total: 0, correct: 0 };
      stats[section] = {
        total: stats[section].total + 1,
        correct: stats[section].correct + (correct ? 1 : 0),
      };
      const next = {
        ...prev,
        sectionStats: stats,
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

    // Shell game trigger
    if (newStreak >= gameThreshold) {
      setShowShellGame(true);
      setStreak(0);
      setGameThreshold(prev => prev + 5);
      return 0;
    }

    // Space invaders at 20 streak
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
    addXP, completeTestSmarts, logAnswer, isPracticeUnlocked,
    handleCorrectAnswer, handleWrongAnswer, sessionSeconds,
    showShellGame, setShowShellGame, showSpaceInvaders, setShowSpaceInvaders,
  };

  return (
    <AppContext.Provider value={ctx}>
      <div className="app">
        {/* XP Float */}
        {xpFloat && (
          <div className="xp-float" key={xpFloat.id}>+{xpFloat.amount} XP</div>
        )}

        {/* Level Up */}
        {levelUp && (
          <div className="level-up-overlay">
            <div className="level-up-card">
              <div className="level-up-icon">{levelUp.icon}</div>
              <div className="level-up-text">LEVEL UP!</div>
              <div className="level-up-name">{levelUp.name}</div>
            </div>
          </div>
        )}

        {/* Shell Game */}
        {showShellGame && (
          <div className="game-overlay">
            <ShellGame onComplete={() => setShowShellGame(false)} />
          </div>
        )}

        {/* Space Invaders */}
        {showSpaceInvaders && (
          <div className="game-overlay">
            <SpaceInvadersOverlay onClose={() => setShowSpaceInvaders(false)} />
          </div>
        )}

        {/* Screens */}
        {screen === 'home' && <HomeScreen />}
        {screen === 'test-smarts' && <TestSmartsMenu />}
        {screen.startsWith('module:') && <ModuleScreen moduleId={screen.split(':')[1]} />}
        {screen === 'practice' && <PracticeMenu />}
        {screen.startsWith('practice:') && <PracticeScreen sectionId={screen.split(':')[1]} />}
        {screen.startsWith('reading:') && <ReadingScreen passageIndex={parseInt(screen.split(':')[1])} />}
      </div>
    </AppContext.Provider>
  );
}

// ─── Home Screen ───
function HomeScreen() {
  const { progress, setScreen, isPracticeUnlocked, sessionSeconds } = useApp();
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
  const unlocked = isPracticeUnlocked();

  return (
    <div className="screen home-screen">
      <header className="home-header">
        <h1 className="app-title">ERB Prep</h1>
        <div className="countdown">
          <span className="countdown-num">{daysLeft}</span>
          <span className="countdown-label">days until test</span>
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
        <button className="home-card test-smarts-card" onClick={() => setScreen('test-smarts')}>
          <div className="card-icon">🧠</div>
          <div className="card-title">Test Smarts</div>
          <div className="card-desc">Learn strategies that work on any test</div>
          <div className="card-progress">
            {progress.testSmartsCompleted.length}/{MODULES.length} modules
          </div>
        </button>

        <button
          className={`home-card practice-card ${!unlocked ? 'locked' : ''}`}
          onClick={() => unlocked ? setScreen('practice') : null}
          disabled={!unlocked}
        >
          <div className="card-icon">{unlocked ? '📝' : '🔒'}</div>
          <div className="card-title">Practice</div>
          <div className="card-desc">
            {unlocked
              ? 'Practice all 7 ERB sections'
              : `Complete ${REQUIRED_MODULES.length - progress.testSmartsCompleted.filter(id => REQUIRED_MODULES.includes(id)).length} more required Test Smarts modules to unlock`
            }
          </div>
          {unlocked && progress.totalQuestions > 0 && (
            <div className="card-progress">{progress.totalQuestions} questions · {accuracy}% accuracy</div>
          )}
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

// ─── Test Smarts Menu ───
function TestSmartsMenu() {
  const { progress, setScreen } = useApp();

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => setScreen('home')}>← Back</button>
        <h2>Test Smarts</h2>
      </div>
      <p className="screen-desc">Learn strategies that help on any standardized test. Complete the required modules to unlock Practice.</p>

      <div className="module-list">
        {MODULES.map((mod, i) => {
          const done = progress.testSmartsCompleted.includes(mod.id);
          const prevDone = i === 0 || progress.testSmartsCompleted.includes(MODULES[i - 1].id);
          const locked = !prevDone && !done;

          return (
            <button
              key={mod.id}
              className={`module-item ${done ? 'done' : ''} ${locked ? 'locked' : ''} ${mod.required ? 'required' : ''}`}
              onClick={() => !locked && setScreen(`module:${mod.id}`)}
              disabled={locked}
            >
              <span className="module-icon">{done ? '✅' : mod.icon}</span>
              <div className="module-info">
                <div className="module-name">
                  {mod.name}
                  {mod.required && !done && <span className="required-badge">Required</span>}
                </div>
                <div className="module-desc">{mod.desc}</div>
              </div>
              {locked && <span className="lock-icon">🔒</span>}
              {done && <span className="done-check">Done</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Module Screen (Test Smarts) ───
function ModuleScreen({ moduleId }) {
  const { setScreen, completeTestSmarts, progress, handleCorrectAnswer, handleWrongAnswer, logAnswer } = useApp();
  const mod = MODULES.find(m => m.id === moduleId);
  const [phase, setPhase] = useState('intro'); // intro, practice, complete
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
  const isAlreadyDone = progress.testSmartsCompleted.includes(moduleId);

  function handleSelect(idx) {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const correct = idx === currentQ.answer;
    const newScore = { ...score, total: score.total + 1, correct: score.correct + (correct ? 1 : 0) };
    setScore(newScore);

    logAnswer('test-smarts', mod.id, currentQ.id, currentQ.scenario, String(currentQ.answer), String(idx), correct, true, 0);

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
      if (!isAlreadyDone) {
        completeTestSmarts(moduleId);
      }
    }
  }

  // Intro slides
  if (phase === 'intro') {
    const slide = slides[slideIndex];
    return (
      <div className="screen module-screen">
        <div className="screen-header">
          <button className="back-btn" onClick={() => setScreen('test-smarts')}>← Back</button>
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

  // Practice
  if (phase === 'practice') {
    return (
      <div className="screen module-screen">
        <div className="screen-header">
          <button className="back-btn" onClick={() => setScreen('test-smarts')}>← Back</button>
          <h2>{mod.name}</h2>
          <span className="q-counter">{practiceIndex + 1}/{questions.length}</span>
        </div>
        <div className="question-container">
          <p className="question-text">{currentQ.scenario}</p>
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
                {practiceIndex < questions.length - 1 ? 'Next Question' : 'Finish'}
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

  // Complete
  return (
    <div className="screen module-screen complete-screen">
      <div className="complete-card">
        <div className="complete-icon">🎉</div>
        <h2>Module Complete!</h2>
        <p className="complete-name">{mod.name}</p>
        <div className="complete-stats">
          <div>{score.correct}/{score.total} correct</div>
          {!isAlreadyDone && <div className="bonus-xp">+{XP.TEST_SMARTS_MODULE} XP bonus!</div>}
        </div>
        <button className="primary-btn" onClick={() => setScreen('test-smarts')}>Continue</button>
      </div>
    </div>
  );
}

// ─── Practice Menu ───
function PracticeMenu() {
  const { setScreen, progress } = useApp();

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => setScreen('home')}>← Back</button>
        <h2>Practice</h2>
      </div>
      <p className="screen-desc">Practice all 7 ERB sections. Questions match real CTP5 format.</p>

      <div className="section-grid">
        {SECTIONS.map(section => {
          const stats = progress.sectionStats[section.id];
          const accuracy = stats ? Math.round((stats.correct / stats.total) * 100) : null;

          return (
            <button
              key={section.id}
              className="section-card"
              onClick={() => {
                if (section.id === 'reading') {
                  setScreen('reading:0');
                } else {
                  setScreen(`practice:${section.id}`);
                }
              }}
              style={{ '--section-color': section.color }}
            >
              <div className="section-icon">{section.icon}</div>
              <div className="section-name">{section.name}</div>
              <div className="section-desc">{section.desc}</div>
              {stats && (
                <div className="section-stats">
                  {stats.total} done · {accuracy}%
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Practice Screen (non-reading sections) ───
function PracticeScreen({ sectionId }) {
  const { setScreen, handleCorrectAnswer, handleWrongAnswer, logAnswer } = useApp();
  const section = SECTIONS.find(s => s.id === sectionId);
  const allQuestions = getQuestions(sectionId);
  const [questions] = useState(() => shuffleArray([...allQuestions]));
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreakLocal] = useState(0);
  const [sessionScore, setSessionScore] = useState({ total: 0, correct: 0 });
  const [eliminated, setEliminated] = useState([]);
  const [done, setDone] = useState(false);
  const startTime = useRef(Date.now());

  if (!section || questions.length === 0) return null;

  const q = questions[qIndex];

  function handleSelect(idx) {
    if (selected !== null) return;
    if (eliminated.includes(idx)) return;
    setSelected(idx);
    setShowExplanation(true);
    const correct = idx === q.answer;
    const timeMs = Date.now() - startTime.current;

    logAnswer(sectionId, q.type || q.topic || '', q.id, q.question, String(q.answer), String(idx), correct, true, timeMs);

    const newScore = { ...sessionScore, total: sessionScore.total + 1, correct: sessionScore.correct + (correct ? 1 : 0) };
    setSessionScore(newScore);

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
    if (idx === q.answer) return; // can't eliminate correct answer (silent)
    if (eliminated.includes(idx)) {
      setEliminated(eliminated.filter(e => e !== idx));
    } else if (eliminated.length < 2) {
      setEliminated([...eliminated, idx]);
    }
  }

  function nextQuestion() {
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
      setSelected(null);
      setShowExplanation(false);
      setEliminated([]);
      startTime.current = Date.now();
    } else {
      setDone(true);
    }
  }

  if (done) {
    const accuracy = sessionScore.total > 0 ? Math.round((sessionScore.correct / sessionScore.total) * 100) : 0;
    return (
      <div className="screen complete-screen">
        <div className="complete-card">
          <div className="complete-icon">{section.icon}</div>
          <h2>Section Complete!</h2>
          <p className="complete-name">{section.name}</p>
          <div className="complete-stats">
            <div>{sessionScore.correct}/{sessionScore.total} correct ({accuracy}%)</div>
          </div>
          <button className="primary-btn" onClick={() => setScreen('practice')}>Back to Sections</button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen practice-screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => setScreen('practice')}>← Back</button>
        <h2>{section.name}</h2>
        <span className="q-counter">{qIndex + 1}/{questions.length}</span>
      </div>
      <div className="question-progress">
        <div className="question-progress-fill" style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }} />
      </div>
      <div className="score-bar">
        <span>{sessionScore.correct} correct</span>
        <span className="score-accuracy">
          {sessionScore.total > 0 ? Math.round((sessionScore.correct / sessionScore.total) * 100) : 0}%
        </span>
      </div>

      <div className="question-container">
        {q.context && <div className="question-context">{q.context}</div>}
        <p className="question-text">{q.question}</p>

        <div className="choices">
          {q.choices.map((choice, i) => (
            <div key={i} className="choice-row">
              <button
                className={`choice-btn ${
                  eliminated.includes(i) ? 'eliminated' : ''
                } ${
                  selected !== null
                    ? i === q.answer
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
                  title="Eliminate this choice"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {selected === null && eliminated.length > 0 && (
          <div className="eliminate-hint">
            {eliminated.length} eliminated — {4 - eliminated.length} remaining ({Math.round(100 / (4 - eliminated.length))}% chance!)
          </div>
        )}

        {showExplanation && (
          <div className={`explanation ${selected === q.answer ? 'correct' : 'wrong'}`}>
            <div className="explanation-icon">{selected === q.answer ? '✓' : '✗'}</div>
            <p>{q.explanation}</p>
            <button className="primary-btn" onClick={nextQuestion}>
              {qIndex < questions.length - 1 ? 'Next Question' : 'Finish Section'}
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

// ─── Reading Comprehension Screen ───
function ReadingScreen({ passageIndex }) {
  const { setScreen, handleCorrectAnswer, handleWrongAnswer, logAnswer } = useApp();
  const passages = READING_PASSAGES;
  const passage = passages[passageIndex];
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreakLocal] = useState(0);
  const [score, setScore] = useState({ total: 0, correct: 0 });
  const [showPassage, setShowPassage] = useState(true);
  const [eliminated, setEliminated] = useState([]);
  const startTime = useRef(Date.now());

  if (!passage) return null;

  const q = passage.questions[qIndex];

  function handleSelect(idx) {
    if (selected !== null) return;
    if (eliminated.includes(idx)) return;
    setSelected(idx);
    setShowExplanation(true);
    const correct = idx === q.answer;
    const timeMs = Date.now() - startTime.current;

    logAnswer('reading', passage.id, q.id, q.question, String(q.answer), String(idx), correct, true, timeMs);

    const newScore = { ...score, total: score.total + 1, correct: score.correct + (correct ? 1 : 0) };
    setScore(newScore);

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
    if (idx === q.answer) return;
    if (eliminated.includes(idx)) {
      setEliminated(eliminated.filter(e => e !== idx));
    } else if (eliminated.length < 2) {
      setEliminated([...eliminated, idx]);
    }
  }

  function nextQuestion() {
    if (qIndex < passage.questions.length - 1) {
      setQIndex(qIndex + 1);
      setSelected(null);
      setShowExplanation(false);
      setEliminated([]);
      startTime.current = Date.now();
    } else if (passageIndex < passages.length - 1) {
      setScreen(`reading:${passageIndex + 1}`);
    } else {
      setScreen('practice');
    }
  }

  return (
    <div className="screen reading-screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => setScreen('practice')}>← Back</button>
        <h2>Reading: {passage.title}</h2>
        <span className="q-counter">Q{qIndex + 1}/{passage.questions.length}</span>
      </div>

      <div className="reading-layout">
        <button
          className="toggle-passage-btn"
          onClick={() => setShowPassage(!showPassage)}
        >
          {showPassage ? 'Hide Passage' : 'Show Passage'}
        </button>

        {showPassage && (
          <div className="passage-container">
            {passage.text.split('\n\n').map((para, i) => (
              <p key={i} className="passage-para">{para}</p>
            ))}
          </div>
        )}

        <div className="question-container">
          <p className="question-text">{q.question}</p>

          <div className="choices">
            {q.choices.map((choice, i) => (
              <div key={i} className="choice-row">
                <button
                  className={`choice-btn ${
                    eliminated.includes(i) ? 'eliminated' : ''
                  } ${
                    selected !== null
                      ? i === q.answer
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
                    title="Eliminate"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {selected === null && eliminated.length > 0 && (
            <div className="eliminate-hint">
              {eliminated.length} eliminated — {4 - eliminated.length} remaining
            </div>
          )}

          {showExplanation && (
            <div className={`explanation ${selected === q.answer ? 'correct' : 'wrong'}`}>
              <div className="explanation-icon">{selected === q.answer ? '✓' : '✗'}</div>
              <p>{q.explanation}</p>
              <button className="primary-btn" onClick={nextQuestion}>
                {qIndex < passage.questions.length - 1
                  ? 'Next Question'
                  : passageIndex < passages.length - 1
                    ? 'Next Passage'
                    : 'Finish'
                }
              </button>
            </div>
          )}
        </div>
      </div>

      {streak >= 3 && (
        <div className="streak-display">
          {'🔥'.repeat(Math.min(Math.floor(streak / 5) + 1, 3))} {getStreakMessage(streak)}
        </div>
      )}
    </div>
  );
}

// ─── Utility ───
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
