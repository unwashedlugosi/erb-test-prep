// Test Smarts — Interactive Strategy Modules
// Each module has: intro (Watch), guided practice (Try Together), independent practice (Your Turn)

export const MODULES = [
  {
    id: 'never-blank',
    name: 'Never Leave a Blank',
    icon: '✅',
    desc: 'Why you should ALWAYS answer every question — even if you\'re guessing.',
    required: true,
    intro: {
      title: 'The #1 Rule: Never Leave a Blank',
      slides: [
        {
          text: 'On the ERB, there is NO penalty for wrong answers. Zero. None. Nada.',
          highlight: 'A blank answer scores 0 points. A guess might score points!',
        },
        {
          text: 'Even a random guess gives you a 25% chance of getting it right (1 out of 4 choices).',
          highlight: 'That means if you guess on 4 questions, you\'ll probably get 1 right!',
        },
        {
          text: 'Pro tip: Pick a "Letter of the Day" for your blind guesses. If you always pick C when you\'re stuck, you\'ll score better than if you randomly pick different letters.',
          highlight: 'Consistent guessing beats random guessing.',
        },
        {
          text: 'But before you guess blindly, try to eliminate wrong answers first. Even eliminating ONE wrong answer bumps your odds from 25% to 33%.',
          highlight: 'Eliminate first, THEN guess.',
        },
      ],
    },
    practice: [
      {
        id: 'nb1',
        scenario: 'You\'re running out of time and have 3 questions left. You have NO idea about any of them. What should you do?',
        choices: [
          'Leave them blank — guessing is a waste of time',
          'Pick the same letter for all 3 and move on',
          'Spend all your remaining time on the first one',
          'Close your eyes and pick random letters for each',
        ],
        answer: 1,
        explanation: 'Pick the same letter for all 3! Consistent guessing gives you the best odds. Each guess has a 25% chance — that\'s likely 1 out of 3 correct. Leaving them blank guarantees 0.',
      },
      {
        id: 'nb2',
        scenario: 'You can eliminate 2 of the 4 answer choices but genuinely can\'t decide between the remaining 2. What are your odds?',
        choices: ['10%', '25%', '33%', '50%'],
        answer: 3,
        explanation: 'If you\'ve narrowed it to 2 choices, you have a 50% chance — a coin flip! That\'s way better than leaving it blank (0%).',
      },
      {
        id: 'nb3',
        scenario: 'You just realized you skipped a question 10 questions ago and time is almost up. What should you do?',
        choices: [
          'Leave it blank — it\'s too late',
          'Go back, read the question carefully, and try your best',
          'Go back and quickly pick any answer',
          'Either B or C — just don\'t leave it blank',
        ],
        answer: 3,
        explanation: 'Either reading it carefully (if you have time) or guessing quickly (if you don\'t) is better than leaving it blank. The WORST thing is a blank answer.',
      },
    ],
  },
  {
    id: 'elimination',
    name: 'Process of Elimination',
    icon: '❌',
    desc: 'How to find the right answer by crossing out the wrong ones.',
    required: true,
    intro: {
      title: 'Cross Out the Wrong Answers',
      slides: [
        {
          text: 'It\'s often easier to spot WRONG answers than to spot the right one. Your brain is better at recognizing "that\'s definitely not it" than "that\'s it!"',
          highlight: 'Don\'t look for the right answer — look for the wrong ones.',
        },
        {
          text: 'When you eliminate a wrong answer, physically cross it out (or mentally X it). This reduces what you have to think about and frees up brain space.',
          highlight: 'Crossing out = less to think about = better thinking.',
        },
        {
          text: 'Look for answers that are: obviously wrong, too extreme (always, never, all, none), off-topic, or the opposite of what the question asks.',
          highlight: 'Extreme words like "always" and "never" are usually wrong.',
        },
        {
          text: 'After eliminating what you can, choose from what\'s left. Even if you\'re not sure, you\'ve dramatically improved your odds!',
          highlight: 'Eliminate 1 = 33% chance. Eliminate 2 = 50% chance.',
        },
      ],
    },
    practice: [
      {
        id: 'el1',
        scenario: 'Which answer choice can you DEFINITELY eliminate?\n\nQuestion: "The main character in the story felt sad because..."\n\n(A) her friend moved away\n(B) she was ALWAYS unhappy about everything\n(C) she lost her favorite book\n(D) her pet was sick',
        choices: ['A — her friend moved away', 'B — she was ALWAYS unhappy', 'C — she lost her favorite book', 'D — her pet was sick'],
        answer: 1,
        explanation: '"ALWAYS unhappy about EVERYTHING" is extreme language. Real characters in stories have complex emotions — they\'re not ALWAYS unhappy about EVERYTHING. This is likely a distractor.',
      },
      {
        id: 'el2',
        scenario: 'You\'re stuck on a vocabulary question. The word is "abundant." You know it has something to do with having a lot of something. Which answers can you eliminate?\n\n(A) rare\n(B) plentiful\n(C) heavy\n(D) tiny',
        choices: [
          'Eliminate A and D — they mean having very little',
          'Eliminate B and C — they seem too obvious',
          'Eliminate nothing — they all could work',
          'Eliminate C only — "heavy" has nothing to do with amount',
        ],
        answer: 0,
        explanation: 'If "abundant" means having a lot, then "rare" (very little) and "tiny" (very small) are the opposite. Eliminate both! Now you choose between B and C — and "plentiful" clearly means having a lot.',
      },
      {
        id: 'el3',
        scenario: 'A reading question asks: "What is the author\'s main purpose?"\n\n(A) To inform readers about rainforest animals\n(B) To prove that rainforests are the only important ecosystem on Earth\n(C) To entertain readers with a funny story about monkeys\n(D) To convince readers to become vegetarians',
        choices: [
          'Eliminate B — "only important ecosystem" is extreme',
          'Eliminate D — vegetarianism isn\'t related to rainforest animals',
          'Eliminate both B and D',
          'Can\'t eliminate any without reading the passage',
        ],
        answer: 2,
        explanation: 'B uses extreme language ("only important") which is almost never the author\'s purpose. D is completely off-topic. You can safely eliminate both even without reading the passage!',
      },
      {
        id: 'el4',
        scenario: 'In this elimination practice, cross out the answers that are clearly wrong.\n\nQuestion: "Which best describes water at 100°C at sea level?"\n\n(A) Frozen solid\n(B) Boiling\n(C) Room temperature\n(D) Slightly warm',
        choices: ['A — Frozen solid', 'B — Boiling', 'C — Room temperature', 'D — Slightly warm'],
        answer: 1,
        explanation: '100°C is the boiling point of water. You can eliminate A (frozen = 0°C), C (room temp ≈ 20-25°C), and D (slightly warm ≈ 30-40°C). Only B remains: Boiling.',
      },
    ],
  },
  {
    id: 'spot-trap',
    name: 'Spot the Trap',
    icon: '🪤',
    desc: 'Learn the tricks test-makers use to create tempting wrong answers.',
    required: false,
    intro: {
      title: 'How Wrong Answers Are Designed',
      slides: [
        {
          text: 'Wrong answers on the ERB aren\'t random. They\'re carefully designed to attract students who make common mistakes. Once you know the tricks, you can spot them!',
          highlight: 'Test-makers BUILD traps. You can learn to SEE them.',
        },
        {
          text: 'Trap #1: The "Partially Right" answer. It mentions something from the passage or problem, but doesn\'t fully answer the question. It\'s tempting because it sounds familiar.',
          highlight: 'Just because it mentions something from the passage doesn\'t make it the BEST answer.',
        },
        {
          text: 'Trap #2: The "Reversed Meaning" answer. It takes a real concept and flips it. If the passage says "the population increased," the wrong answer might say "the population declined."',
          highlight: 'Read carefully — one wrong word can flip the entire meaning.',
        },
        {
          text: 'Trap #3: The "Right Answer to the Wrong Question." It\'s a true statement, but it doesn\'t answer what was actually asked. Always re-read the question after picking your answer.',
          highlight: 'True ≠ correct. The answer must match the QUESTION.',
        },
        {
          text: 'Trap #4: Extreme language — "always," "never," "all," "none," "impossible," "only." Real answers are usually more moderate: "often," "sometimes," "many," "might."',
          highlight: 'Extreme words = almost always wrong.',
        },
      ],
    },
    practice: [
      {
        id: 'st1',
        scenario: 'A passage describes how ancient Egyptians built pyramids. The question asks: "What was the MAIN purpose of the pyramids?"\n\n(A) To store grain during famine\n(B) To serve as tombs for pharaohs\n(C) Pyramids were built by thousands of workers\n(D) The pyramids are the ONLY remaining ancient wonder',
        choices: ['A — Partially right trap', 'B — The correct answer', 'C — Right answer to wrong question', 'D — Extreme language trap'],
        answer: 2,
        explanation: 'C is the "Right Answer to Wrong Question" trap. It\'s TRUE that workers built pyramids — but the question asks about PURPOSE, not construction. D uses "ONLY" (extreme). B correctly answers the question.',
      },
      {
        id: 'st2',
        scenario: 'A passage says: "Recycling aluminum saves 95% of the energy needed to make new aluminum." The question asks what you can conclude.\n\n(A) Recycling aluminum saves a significant amount of energy\n(B) Recycling aluminum saves ALL the world\'s energy\n(C) Making new aluminum uses no energy at all\n(D) Energy is never wasted when recycling',
        choices: [
          'A — correct conclusion',
          'B — extreme language trap ("ALL")',
          'C — reversed meaning trap',
          'D — extreme language trap ("never")',
        ],
        answer: 0,
        explanation: 'A is correct — 95% IS significant. B uses "ALL" (extreme). C reverses the meaning (making aluminum DOES use energy). D uses "never" (extreme). Three traps, one right answer!',
      },
      {
        id: 'st3',
        scenario: 'Which type of trap is this wrong answer?\n\nPassage says: "The temperature rose steadily throughout the day."\nWrong answer: "The temperature dropped throughout the day."',
        choices: [
          'Partially right — mentions temperature',
          'Reversed meaning — "rose" became "dropped"',
          'Right answer to wrong question',
          'Extreme language',
        ],
        answer: 1,
        explanation: 'This is the Reversed Meaning trap. The wrong answer takes the real concept (temperature changing throughout the day) but flips "rose" to "dropped." Always watch for one key word being swapped.',
      },
      {
        id: 'st4',
        scenario: 'A math word problem asks: "How many MORE apples does Sarah have than Tom?"\nSarah has 15 apples. Tom has 9 apples.\n\n(A) 24\n(B) 6\n(C) 15\n(D) 9',
        choices: [
          'A — used addition instead of subtraction',
          'B — the correct answer',
          'C — picked Sarah\'s number (partially right)',
          'D — picked Tom\'s number (partially right)',
        ],
        answer: 1,
        explanation: 'A is a trap for students who add instead of subtract. C and D are traps using numbers FROM the problem. B is correct: 15 - 9 = 6. Test-makers use the actual numbers from the problem as wrong answers!',
      },
    ],
  },
  {
    id: 'confidence',
    name: 'Confidence Buckets',
    icon: '🪣',
    desc: 'Learn to sort your answers into "I Know," "I Think," and "I\'m Guessing."',
    required: false,
    intro: {
      title: 'Know What You Know',
      slides: [
        {
          text: 'Not all answers feel the same. Some you KNOW are right. Some you THINK are right. Some you\'re just guessing. Learning to tell the difference is a superpower.',
          highlight: 'Good test-takers know when they\'re guessing and when they\'re sure.',
        },
        {
          text: '"I KNOW" — You\'re confident. You understand the question, you can explain why your answer is right, and you can explain why the others are wrong.',
          highlight: 'If you can explain it, you know it.',
        },
        {
          text: '"I THINK" — You have a good reason for your answer, but you\'re not 100% sure. Maybe you eliminated 2 choices and picked between the remaining 2.',
          highlight: 'This is where most answers land — and that\'s totally okay.',
        },
        {
          text: '"I\'M GUESSING" — You have no idea. You can\'t eliminate any choices. This is where your Letter of the Day comes in!',
          highlight: 'Even pure guesses score 25% — way better than blank.',
        },
        {
          text: 'Why does this matter? If you finish early, go back to your "I Think" answers first — those are the ones most likely to improve with a second look.',
          highlight: 'Use review time on "I Think" answers, not "I Know" answers.',
        },
      ],
    },
    practice: [
      {
        id: 'cf1',
        scenario: 'You answered a math question and got 42. You\'re sure because you checked your work twice and the math adds up. Which bucket?',
        choices: ['I Know', 'I Think', 'I\'m Guessing'],
        answer: 0,
        explanation: 'You checked your work, the math adds up, you\'re confident. This is an "I Know" — don\'t waste review time on this one.',
      },
      {
        id: 'cf2',
        scenario: 'You read a vocabulary question and the word is completely unfamiliar. You eliminated one answer that was clearly wrong and picked from the remaining three based on gut feeling. Which bucket?',
        choices: ['I Know', 'I Think', 'I\'m Guessing'],
        answer: 2,
        explanation: 'You eliminated one answer (good!) but picked based on gut feeling from three remaining options. That\'s still mostly guessing. If you have review time, come back to this one.',
      },
      {
        id: 'cf3',
        scenario: 'A reading question asks about the author\'s purpose. You eliminated 2 choices and picked between the remaining 2. You feel pretty good about your choice but aren\'t certain. Which bucket?',
        choices: ['I Know', 'I Think', 'I\'m Guessing'],
        answer: 1,
        explanation: 'You narrowed it to 2 and made a reasonable choice. That\'s "I Think" — you have a basis for your answer but aren\'t certain. Good candidate for a second look during review.',
      },
      {
        id: 'cf4',
        scenario: 'You finished a section with 5 minutes left. You marked 3 questions as "I Think" and 2 as "I\'m Guessing." Which should you revisit first?',
        choices: [
          'The "I\'m Guessing" ones — they need the most help',
          'The "I Think" ones — they\'re most likely to improve',
          'Go back to the beginning and re-read everything',
          'Don\'t change anything — first instinct is always right',
        ],
        answer: 1,
        explanation: '"I Think" answers are your best investment — you already have partial knowledge, so a second look might push you to certainty. "I\'m Guessing" answers are harder to improve without new insight.',
      },
    ],
  },
  {
    id: 'two-pass',
    name: 'Two-Pass Strategy',
    icon: '⏱️',
    desc: 'How to manage your time: easy questions first, hard ones second.',
    required: false,
    intro: {
      title: 'First Pass, Second Pass',
      slides: [
        {
          text: 'Don\'t get stuck! If a question is hard, mark it and move on. Come back to it after you\'ve answered all the easy ones.',
          highlight: 'Easy questions are worth the same points as hard questions.',
        },
        {
          text: 'FIRST PASS: Go through all questions. Answer the ones you know. If one takes more than about a minute and you\'re stuck, mark it and skip ahead.',
          highlight: 'First pass = grab all the easy points.',
        },
        {
          text: 'SECOND PASS: Go back to the marked questions. Now you\'ve answered the easy ones, your brain has had time to process. You might see the hard ones differently.',
          highlight: 'Second pass = tackle the tough ones with a fresh perspective.',
        },
        {
          text: 'Important: ALWAYS leave at least 2 minutes at the end to fill in any blanks. Remember — never leave a blank!',
          highlight: '2 minutes before time\'s up: fill in ALL blanks.',
        },
      ],
    },
    practice: [
      {
        id: 'tp1',
        scenario: 'You\'re on question 8 of 30. The question is really confusing and you\'ve been staring at it for over a minute. What should you do?',
        choices: [
          'Keep working on it until you figure it out',
          'Mark it, pick your best guess, and move on',
          'Skip it entirely and leave it blank',
          'Go back to question 1 and start over',
        ],
        answer: 1,
        explanation: 'Mark it, pick a reasonable guess (so it\'s not blank), and move on. You can come back on your second pass. Don\'t let one tough question eat up time for the 22 questions you haven\'t seen yet.',
      },
      {
        id: 'tp2',
        scenario: 'You finished your first pass through 40 questions. You answered 32 confidently and marked 8 as difficult. You have 10 minutes left. What\'s your plan?',
        choices: [
          'Spend all 10 minutes on the 8 hard ones',
          'Spend 8 minutes on the hard ones, save 2 minutes to check blanks',
          'Go back and double-check the 32 you answered',
          'Relax — you answered most of them',
        ],
        answer: 1,
        explanation: 'Spend most of your remaining time on the marked questions, but ALWAYS save 2 minutes at the end to make sure nothing is blank. Don\'t waste time re-checking answers you\'re confident about.',
      },
      {
        id: 'tp3',
        scenario: 'On your second pass, you look at a marked question again and still can\'t figure it out. There are 3 minutes left. What do you do?',
        choices: [
          'Keep trying until time runs out',
          'Leave it blank',
          'Make your best guess and move to the next marked question',
          'Erase all your answers and start over',
        ],
        answer: 2,
        explanation: 'Make your best guess and use your remaining time on other marked questions. With 3 minutes left, you can\'t afford to spend it all on one question. Every guess is a 25%+ chance!',
      },
    ],
  },
  {
    id: 'read-question',
    name: 'Read the Question',
    icon: '👀',
    desc: 'The most common mistake on standardized tests — and how to avoid it.',
    required: false,
    intro: {
      title: 'Read. The. Actual. Question.',
      slides: [
        {
          text: 'The #1 source of avoidable errors on the ERB is misreading the question. Students answer a DIFFERENT question than the one that was asked.',
          highlight: 'Misreading = wrong answer even when you KNOW the material.',
        },
        {
          text: 'Watch for these signal words that change what\'s being asked: NOT, EXCEPT, LEAST, BEST, MOST, MAINLY, PRIMARILY.',
          highlight: 'One word can flip the entire question.',
        },
        {
          text: '"Which is NOT true?" means 3 answers ARE true and 1 is false. You\'re looking for the FALSE one. Students who miss "NOT" pick a true answer — and get it wrong.',
          highlight: 'When you see NOT or EXCEPT, underline it!',
        },
        {
          text: '"Which BEST describes..." means multiple answers might be partially right, but only one is the BEST. Read ALL four choices before picking.',
          highlight: 'BEST means "read all choices" — don\'t stop at the first decent one.',
        },
      ],
    },
    practice: [
      {
        id: 'rq1',
        scenario: 'The question says: "All of the following are mammals EXCEPT:"\n(A) Whale\n(B) Bat\n(C) Dolphin\n(D) Penguin\n\nWhat is the question REALLY asking?',
        choices: [
          'Which one IS a mammal?',
          'Which one is NOT a mammal?',
          'Which one lives in water?',
          'Which one can fly?',
        ],
        answer: 1,
        explanation: '"EXCEPT" means you\'re looking for the one that does NOT fit. Three are mammals; one is not. (Penguin is a bird, not a mammal!)',
      },
      {
        id: 'rq2',
        scenario: 'The question says: "Which BEST describes the main idea of the passage?"\nYou read choice A and it sounds pretty good. What should you do?',
        choices: [
          'Pick A — it sounds right',
          'Read ALL four choices, then decide which is BEST',
          'Pick whichever is longest',
          'Pick the first one that mentions something from the passage',
        ],
        answer: 1,
        explanation: '"BEST" means you need to compare ALL choices. A might be good, but B, C, or D might be better. Always read every choice when the question says "best."',
      },
      {
        id: 'rq3',
        scenario: 'What signal word should you underline in this question?\n"Which statement is LEAST supported by the passage?"',
        choices: ['Which', 'statement', 'LEAST', 'passage'],
        answer: 2,
        explanation: '"LEAST" flips the question. You\'re looking for the answer that has the WEAKEST support — not the strongest. If you miss "LEAST," you\'ll pick the most supported answer (the exact opposite of what\'s asked).',
      },
    ],
  },
  {
    id: 'change-answer',
    name: 'Should I Change My Answer?',
    icon: '🔄',
    desc: 'Research says: change it when you have a reason. Here\'s why.',
    required: false,
    intro: {
      title: 'When to Change Your Answer',
      slides: [
        {
          text: 'You\'ve probably heard: "Go with your gut! Don\'t change your answer!" Here\'s the thing — that advice is WRONG. Research proves it.',
          highlight: '70+ years of research: changing answers HELPS more than it hurts.',
        },
        {
          text: 'When students change answers, the change goes from wrong-to-right MORE than twice as often as right-to-wrong. Changing usually helps!',
          highlight: '2 out of 3 changes improve your score.',
        },
        {
          text: 'So why does everyone think otherwise? Because changing from right to wrong HURTS and you remember it. Changing from wrong to right feels like luck and you forget it.',
          highlight: 'Your brain remembers the pain, not the gain.',
        },
        {
          text: 'The rule: Change your answer when you have a REASON — like "I misread the question" or "I just realized the passage says something different." Don\'t change based on pure anxiety.',
          highlight: 'Good reason to change = change it. Just nervous = keep it.',
        },
      ],
    },
    practice: [
      {
        id: 'ca1',
        scenario: 'You picked answer B, but now you\'re second-guessing yourself. You can\'t explain why — you just have a vague feeling that C might be better. Should you change?',
        choices: [
          'Yes — trust the new feeling',
          'No — you don\'t have a specific reason to change',
          'Yes — always go with the last answer you think of',
          'Flip a coin',
        ],
        answer: 1,
        explanation: 'A vague feeling isn\'t a reason. You picked B for a reason originally — stick with it unless you can point to something specific (like a word you misread or a fact you remembered).',
      },
      {
        id: 'ca2',
        scenario: 'You answered a reading question, then re-read the passage and noticed a sentence you missed the first time. This sentence supports a different answer. Should you change?',
        choices: [
          'No — always stick with your first answer',
          'Yes — you found new evidence',
          'Only change if you\'re 100% sure',
          'No — changing answers is always risky',
        ],
        answer: 1,
        explanation: 'You found new evidence! A sentence you missed that supports a different answer is a great reason to change. This is exactly the kind of change that research shows improves scores.',
      },
      {
        id: 'ca3',
        scenario: 'You realize you misread a math problem — you thought it said "sum" but it actually says "difference." Should you change your answer?',
        choices: [
          'Yes — you misread the question, which changes the answer',
          'No — your first instinct is usually right',
          'Maybe — check if your answer happens to be right anyway',
          'Yes, but only if time permits',
        ],
        answer: 0,
        explanation: 'Misreading the question is one of the BEST reasons to change your answer. If you calculated the sum when it asked for the difference, your answer is almost certainly wrong. Change it!',
      },
    ],
  },
  {
    id: 'breathe',
    name: 'Test Day Calm',
    icon: '🫁',
    desc: 'A breathing exercise and mental reset for test day.',
    required: false,
    intro: {
      title: 'Stay Calm, Think Clear',
      slides: [
        {
          text: 'Here\'s a secret: smart kids are actually MORE likely to choke under pressure. Your brain works hard during a test, and anxiety eats up the brainpower you need.',
          highlight: 'Anxiety doesn\'t mean you\'re not ready. It means your brain is working hard.',
        },
        {
          text: 'The best tool: belly breathing. Breathe in slowly for 4 counts. Hold for 4 counts. Breathe out slowly for 4 counts. Do this 3 times.',
          highlight: '4-4-4 breathing: In for 4, hold for 4, out for 4.',
        },
        {
          text: 'If you start to feel panicked during the test, try this trick: skip to a different question. Do a few easy ones to get your confidence back, then return to the hard one.',
          highlight: 'Breaking the panic cycle: switch to something easy.',
        },
        {
          text: 'Before the test starts, tell yourself: "I\'ve practiced. I know the strategies. There\'s nothing on this test that can surprise me." Because after this app, that\'s TRUE.',
          highlight: 'You are prepared. You\'ve got this.',
        },
      ],
    },
    practice: [
      {
        id: 'br1',
        scenario: 'You sit down for the test and your heart is racing. What\'s the FIRST thing you should do?',
        choices: [
          'Start the first question immediately to distract yourself',
          'Do 3 rounds of 4-4-4 belly breathing',
          'Tell the teacher you\'re not ready',
          'Read through all the questions first',
        ],
        answer: 1,
        explanation: 'Take a moment to breathe before you begin. Three rounds of 4-4-4 breathing takes about a minute and will calm your heart rate. Then start the test with a clear head.',
      },
      {
        id: 'br2',
        scenario: 'You\'re halfway through a section and you hit 3 hard questions in a row. You can feel yourself starting to panic. What should you do?',
        choices: [
          'Push through — you can\'t waste time',
          'Mark them, skip ahead to easier questions, then come back',
          'Guess on all the remaining questions and finish early',
          'Ask to stop the test',
        ],
        answer: 1,
        explanation: 'This is the Two-Pass strategy in action! Skip to easier questions to rebuild your confidence. Once you\'re calm and have some "wins" under your belt, go back to the hard ones.',
      },
      {
        id: 'br3',
        scenario: 'The night before the test, what should you do?',
        choices: [
          'Study until midnight — every minute counts',
          'Watch TV and eat candy to relax',
          'Normal bedtime, good dinner, pack your things, no studying',
          'Skip dinner and go to bed early at 6 PM',
        ],
        answer: 2,
        explanation: 'The night before should feel normal and boring. No cramming (it doesn\'t help at this point). Good dinner, normal bedtime, and pack everything so the morning is stress-free.',
      },
    ],
  },
];

// How many required modules to unlock Practice
export const REQUIRED_MODULES = MODULES.filter(m => m.required).map(m => m.id);
