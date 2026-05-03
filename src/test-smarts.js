// One strategy module — Eliminating Wrong Answers.
// Everything else is gone. Pure focus on the move that actually wins points.

export const MODULES = [
  {
    id: 'eliminate',
    name: 'How to Eliminate Wrong Answers',
    icon: '✂️',
    desc: 'The one strategy that actually works: spot wrong answers and cross them out.',
    required: false,
    intro: {
      title: 'How to Eliminate Wrong Answers',
      slides: [
        {
          text: 'On every multiple choice question, three of the four answers are wrong. Your job is not to find the right answer — it is to spot the wrong ones and cross them out. Whatever is left is your answer.',
          highlight: 'Don\'t hunt for the right answer. Hunt for wrong ones.',
        },
        {
          text: 'Why this matters: if you guess from 4 choices, you have a 25% chance. If you eliminate 1 wrong answer, that jumps to 33%. Eliminate 2 and it\'s 50% — a coin flip. Eliminate 3 and you have the answer.',
          highlight: '4 → 3 → 2 → 1. Each cross-out doubles your odds.',
        },
        {
          text: 'TRAP 1 — OFF-TOPIC. Some answers have nothing to do with the question. They\'re sneaky because they sound smart, but they don\'t answer what was asked. If an answer doesn\'t connect to the question, cross it out.',
          highlight: 'Off-topic = doesn\'t answer the question. Cross it out.',
          example: 'Q: Why did the author write this passage about whales?\n(A) To inform readers about whale migration\n(B) To convince readers to go vegan ← OFF-TOPIC. The passage is about whales, not diet.',
        },
        {
          text: 'TRAP 2 — EXTREME WORDS. Words like ALWAYS, NEVER, ALL, NONE, ONLY, EVERY, IMPOSSIBLE are almost always in wrong answers. Real life isn\'t that absolute. Cross out anything with extreme words first.',
          highlight: 'See ALWAYS, NEVER, ALL, ONLY, EVERY → probably wrong.',
          example: 'Q: What can we conclude about pyramids?\n(B) They are the ONLY ancient structures still standing. ← EXTREME. Cross it out.',
        },
        {
          text: 'TRAP 3 — TRAP WORDS IN THE QUESTION. Watch for NOT, EXCEPT, LEAST, BEST, MOST. They flip what the question is asking. "Which is NOT a mammal?" means three answers ARE mammals — pick the one that isn\'t. Miss the trap word and you pick the opposite of what\'s right.',
          highlight: 'NOT, EXCEPT, LEAST, BEST, MOST flip the question. Underline them.',
          example: 'Q: All of the following are mammals EXCEPT:\n(A) Whale (B) Bat (C) Penguin (D) Dolphin\n→ Three ARE mammals. The answer is the ONE that isn\'t (C, penguin).',
        },
        {
          text: 'TRAP 4 — REVERSED MEANING. The wrong answer takes the right idea and flips one word. The passage says "rose"; the wrong answer says "dropped." If two answers are opposites, one of them is probably right and the other is the trap.',
          highlight: 'Watch for one flipped word — "rose" vs. "dropped," "more" vs. "fewer."',
        },
        {
          text: 'TRAP 5 — RIGHT ANSWER, WRONG QUESTION. The answer is a TRUE statement, but it doesn\'t answer what was asked. Test-makers know your brain wants to pick true things. Always re-read the question after you pick.',
          highlight: 'True ≠ right. The answer must match the question.',
        },
        {
          text: 'THE PROCESS: Read the question. Underline trap words (NOT, EXCEPT, BEST). Read all four choices. Cross out anything off-topic, anything with extreme words, anything that doesn\'t match the question. Pick from what\'s left. If you\'re still stuck between two, pick one and move on — never leave it blank.',
          highlight: 'Read → underline → cross out → pick from what\'s left.',
        },
      ],
    },
    practice: [
      {
        id: 'el1',
        scenario: 'A passage describes how ancient Egyptians built pyramids. Question: "What was the MAIN purpose of the pyramids?"\n\n(A) To store grain during famine\n(B) To serve as tombs for pharaohs\n(C) Pyramids were built by thousands of workers\n(D) The pyramids are the ONLY remaining ancient wonder\n\nWhich one is the EXTREME WORDS trap?',
        choices: ['A', 'B', 'C', 'D'],
        answer: 3,
        explanation: 'D uses "ONLY" — an extreme word. There are many ancient wonders. Cross D out for being extreme. (C is the right-answer-wrong-question trap — true that workers built them, but not the purpose. B is correct.)',
      },
      {
        id: 'el2',
        scenario: 'You\'re stuck on this vocabulary question. The word is "abundant" — you know it means "having a lot of something."\n\nThe blank: "After the rain, mushrooms were ______ in the forest."\n(A) rare\n(B) plentiful\n(C) heavy\n(D) tiny\n\nWhich TWO can you eliminate just from knowing what "abundant" means?',
        choices: [
          'A and D — they mean having very little',
          'B and C — they look too obvious',
          'A and C — they don\'t fit forests',
          'C and D — they\'re both about size',
        ],
        answer: 0,
        explanation: 'If "abundant" means having a lot, then "rare" (very little) and "tiny" (very small amounts) are opposites. Cross both out. Now you\'re between B (plentiful = a lot ✓) and C (heavy = weight, not amount). B is right. You went from 25% odds to 50% just by spotting opposites.',
      },
      {
        id: 'el3',
        scenario: 'Reading question: "What is the author\'s main purpose?"\n(A) To inform readers about rainforest animals\n(B) To prove that rainforests are the only important ecosystem on Earth\n(C) To entertain readers with a funny story about monkeys\n(D) To convince readers to become vegetarians\n\nWithout reading the passage, which TWO can you safely eliminate?',
        choices: [
          'B and D — extreme word + off-topic',
          'A and C — too narrow',
          'C and D — both opinion-based',
          'You can\'t eliminate without the passage',
        ],
        answer: 0,
        explanation: 'B has "the ONLY important ecosystem" — extreme. Cross out. D talks about vegetarianism, which has nothing to do with rainforests — off-topic. Cross out. Even without reading, you\'ve cut to A vs. C. That\'s elimination doing real work.',
      },
      {
        id: 'el4',
        scenario: 'Question: "Which of the following is NOT a mammal?"\n(A) Whale\n(B) Bat\n(C) Dolphin\n(D) Penguin\n\nWhat is the question REALLY asking?',
        choices: [
          'Which one IS a mammal?',
          'Which one is NOT a mammal?',
          'Which one lives in water?',
          'Which one can fly?',
        ],
        answer: 1,
        explanation: 'The trap word is "NOT." Three of these ARE mammals. You\'re looking for the ONE that isn\'t. (Penguin = bird.) Kids who miss "NOT" pick a mammal and get it wrong. Underline trap words every time.',
      },
      {
        id: 'el5',
        scenario: 'Math word problem: "Sarah has 15 apples. Tom has 9 apples. How many MORE apples does Sarah have than Tom?"\n\n(A) 24\n(B) 6\n(C) 15\n(D) 9\n\nWhich answers are TRAPS using numbers from the problem?',
        choices: [
          'A only — it\'s the sum',
          'C and D only — they\'re Sarah\'s and Tom\'s numbers',
          'A, C, and D — sum + each kid\'s count',
          'None of them are traps',
        ],
        answer: 2,
        explanation: 'Test-makers love using numbers from the problem as wrong answers. A (24) is a trap for kids who add. C (15) and D (9) are traps for kids who pick a number from the problem without doing math. The answer (B = 6) is the one number that isn\'t already on the page. Watch for this on every word problem.',
      },
      {
        id: 'el6',
        scenario: 'Question: "Which BEST describes the main idea of the passage?"\n\nYou read choice A and it sounds pretty good. What should you do?',
        choices: [
          'Pick A — first instinct is usually right',
          'Read all four choices, then pick the one that\'s BEST',
          'Pick the longest choice — it has the most detail',
          'Skip it and come back later',
        ],
        answer: 1,
        explanation: '"BEST" means more than one might be okay, but only one is the strongest answer. You have to read all four to compare. If you stop at A, you might miss B which is even better. "BEST" = read all four, every time.',
      },
      {
        id: 'el7',
        scenario: 'You\'ve eliminated two answers and you\'re stuck between the last two. Time is running short. What do you do?',
        choices: [
          'Spend another minute trying to figure it out',
          'Leave it blank — you\'re not sure',
          'Pick one and move on. 50% odds is way better than 0%.',
          'Pick the longer answer — it\'s usually right',
        ],
        answer: 2,
        explanation: 'You did the work — you got to 50%. That\'s a coin flip in your favor compared to a blank (0%). Pick one, move on, come back if there\'s time at the end. Never leave it blank.',
      },
      {
        id: 'el8',
        scenario: 'Question: "Which can we conclude from the passage?"\n(A) The author thinks bees are interesting\n(B) Bees ALWAYS pollinate every flower they visit\n(C) Most bees produce honey\n(D) NO bee can survive without flowers\n\nWhich TWO have extreme words you can cross out?',
        choices: ['A and C', 'B and D', 'A and B', 'C and D'],
        answer: 1,
        explanation: 'B has "ALWAYS... every" (double extreme). D has "NO... without" (extreme negative). Both cross out. You\'re left with A and C — pick the one supported by the passage. Two extreme-word eliminations took you from 25% to 50%.',
      },
    ],
  },
];

export const REQUIRED_MODULES = [];
