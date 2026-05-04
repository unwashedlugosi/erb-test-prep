// Topic METADATA only — questions are lazy-loaded from /public/questions/<id>.json
// This keeps the initial JS bundle small. Each topic's full question set fetches on demand.

export const LEVELS = [
  { name: 'Beginner', xp: 0, icon: '📝' },
  { name: 'Novice', xp: 75, icon: '📖' },
  { name: 'Strategist', xp: 200, icon: '🎯' },
  { name: 'Tactician', xp: 400, icon: '🧠' },
  { name: 'Analyst', xp: 650, icon: '🔍' },
  { name: 'Test Ace', xp: 950, icon: '⭐' },
  { name: 'ERB Master', xp: 1300, icon: '🏆' },
];

export const TEST_DATE = '2026-05-05';

export function getDaysUntilTest() {
  const now = new Date();
  const test = new Date(TEST_DATE + 'T08:00:00');
  const diff = test - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getLevel(xp) {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.xp) level = l;
    else break;
  }
  return level;
}

export function getNextLevel(xp) {
  for (const l of LEVELS) {
    if (xp < l.xp) return l;
  }
  return null;
}

export const XP = {
  CORRECT: 5,
  FIRST_TRY_BONUS: 3,
  STREAK_5_BONUS: 2,
  STREAK_10_BONUS: 2,
  WRONG: 1,
  TEST_SMARTS_MODULE: 25,
  TOPIC_LESSON: 10,
  TOPIC_COMPLETE: 30,
  MIXED_SET_COMPLETE: 50,
  SESSION_15_MIN: 30,
};

export function calcXP(correct, firstTry, streak) {
  if (!correct) return XP.WRONG;
  let xp = XP.CORRECT;
  if (firstTry) xp += XP.FIRST_TRY_BONUS;
  if (streak >= 5) xp += XP.STREAK_5_BONUS;
  if (streak >= 10) xp += XP.STREAK_10_BONUS;
  return xp;
}

export const SECTIONS = [
  { id: 'verbal', name: 'Verbal Reasoning', icon: '🔤', color: '#6366f1' },
  { id: 'vocab', name: 'Vocabulary', icon: '📚', color: '#8b5cf6' },
  { id: 'reading', name: 'Reading Comprehension', icon: '📖', color: '#3b82f6' },
  { id: 'writing-mechanics', name: 'Writing Mechanics', icon: '✏️', color: '#10b981' },
  { id: 'writing-concepts', name: 'Writing Concepts', icon: '📝', color: '#14b8a6' },
  { id: 'quant', name: 'Quantitative Reasoning', icon: '🔢', color: '#f59e0b' },
  { id: 'math', name: 'Mathematics', icon: '➗', color: '#ef4444' },
];

// ─── Topic metadata: lessons + warmups + meta. Question pool lazy-loaded. ───
export const TOPICS_META = [
  // VERBAL
  {
    id: 'analogies', sectionId: 'verbal', name: 'Analogies', icon: '🔗', priority: 'critical', hasPassages: false,
    lesson: {
      title: 'How Analogies Work',
      sections: [
        { heading: 'What an analogy is', body: 'An analogy is a word puzzle: "A is to B the same way C is to ___." Your job is to figure out the RELATIONSHIP between the first pair, then find the answer with the SAME relationship.' },
        { heading: 'The four-step move', body: '1. Read the first pair.\n2. Say the relationship as a sentence.\n3. Use that sentence on each answer choice.\n4. Pick the one that fits.', example: 'BIRD : NEST :: BEE : ?\nSentence: "A BIRD lives in a NEST."\n"A BEE lives in a HIVE." ✓' },
        { heading: 'Common relationships', body: '• PART to WHOLE — petal : flower\n• YOUNG to ADULT — puppy : dog\n• TOOL to USER — hammer : carpenter\n• OPPOSITES — hot : cold\n• DEGREE — warm : hot\n• CAUSE to EFFECT — rain : flood' },
        { heading: 'The trap', body: 'Test-makers put answers that share a WORD with the original pair but not the RELATIONSHIP. Trust the relationship, not the word.' },
      ],
    },
    warmups: [
      { id: 'an-w1', question: 'PUPPY : DOG ::', choices: ['kitten : cat','cat : mouse','fish : water','tail : dog'], answer: 0, explanation: 'Young to adult.', wrongExplanations: { 1:'Predator/prey.',2:'Habitat.',3:'Part/whole.' } },
      { id: 'an-w2', question: 'HOT : COLD ::', choices: ['warm : cool','sun : moon','big : huge','up : down'], answer: 3, explanation: 'Exact opposites.', wrongExplanations: { 0:'Milder.',1:'Both sky objects.',2:'Same meaning.' } },
      { id: 'an-w3', question: 'PETAL : FLOWER ::', choices: ['bee : honey','page : book','leaf : tree','page : book and leaf : tree'], answer: 3, explanation: 'Both fit part-to-whole.', wrongExplanations: { 0:'Producer/product.',1:'Right but C also.',2:'Right but B also.' } },
    ],
  },
  {
    id: 'categorization', sectionId: 'verbal', name: 'Categorization', icon: '📂', priority: 'critical', hasPassages: false,
    lesson: {
      title: 'How Categorization Works',
      sections: [
        { heading: 'Two question shapes', body: '1. ODD ONE OUT: Three things share something. One doesn\'t.\n2. BEST HEADING: Four things share something. Pick the heading that fits.' },
        { heading: 'ODD ONE OUT move', body: 'Look at all four. Ask: "What do three have in common?" The fourth is your answer.', example: 'violin, trumpet, cello, harp\n→ Three use STRINGS. Trumpet uses BREATH. Trumpet is odd.' },
        { heading: 'BEST HEADING move', body: 'Right heading is SPECIFIC enough to fit all four — but not so broad it could fit anything. Cross out too-broad and too-narrow options.' },
        { heading: 'The trap', body: 'Some answers fit MOST but not ALL. If three are space objects and one is "spaceship," the category is "natural objects in space," not just "space stuff."' },
      ],
    },
    warmups: [
      { id: 'cat-w1', question: 'Which does NOT belong?', context: 'apple, banana, orange, carrot', choices: ['apple','banana','orange','carrot'], answer: 3, explanation: 'Carrot = vegetable, others fruits.', wrongExplanations: { 0:'Fruit.',1:'Fruit.',2:'Fruit.' } },
      { id: 'cat-w2', question: 'Which does NOT belong?', context: 'red, blue, square, green', choices: ['red','blue','square','green'], answer: 2, explanation: 'Square = shape, others colors.', wrongExplanations: { 0:'Color.',1:'Color.',3:'Color.' } },
      { id: 'cat-w3', question: 'Best heading for: dog, cat, hamster, goldfish?', choices: ['Animals','Pets','Furry creatures','Things that bark'], answer: 1, explanation: 'Pets = specific to all four.', wrongExplanations: { 0:'Too broad.',2:'Goldfish not furry.',3:'Only dogs bark.' } },
    ],
  },
  {
    id: 'logic', sectionId: 'verbal', name: 'Logical Reasoning', icon: '🧩', priority: 'critical', hasPassages: false,
    lesson: {
      title: 'How Logical Reasoning Works',
      sections: [
        { heading: 'Two question shapes', body: '1. IF-THEN: Two facts. Pick the conclusion that MUST be true.\n2. EXPERIMENT: Someone has a theory. Pick the test that would prove it.' },
        { heading: 'IF-THEN move', body: 'When the question says "ALL X are Y" and "Z is X," then Z must be Y. Don\'t add anything not in the facts.', example: 'All citrus has Vitamin C. Tangerines are citrus. → Tangerines have Vitamin C.' },
        { heading: 'Watch for "all," "most," "some," "no"', body: '• ALL = every (strong)\n• MOST = "PROBABLY"\n• SOME = at least one\n• NO = zero (strong negative)' },
        { heading: 'EXPERIMENT move', body: 'A good test has TWO groups: one with the thing being tested, one without. Without comparison, you can\'t prove cause.' },
      ],
    },
    warmups: [
      { id: 'lo-w1', question: 'All cats have whiskers. Mittens is a cat. Therefore:', choices: ['All animals with whiskers are cats','Mittens has whiskers','Mittens is named after a glove','Cats are the only animals with whiskers'], answer: 1, explanation: 'Direct from facts.', wrongExplanations: { 0:'Backwards.',2:'Off-topic.',3:'Not stated.' } },
      { id: 'lo-w2', question: 'No fish can fly. A trout is a fish. Therefore:', choices: ['Trout can fly','Trout cannot fly','All non-fliers are fish','Trout swim fast'], answer: 1, explanation: 'NO + IS = NOT.', wrongExplanations: { 0:'Opposite.',2:'Backwards.',3:'No info.' } },
      { id: 'lo-w3', question: 'Sam thinks his shirt is lucky. BEST test?', choices: ['Wear shirt every game','Wear shirt half, no shirt half — compare','Ask teammates','Wash the shirt'], answer: 1, explanation: 'Comparison.', wrongExplanations: { 0:'No control.',2:'Opinions aren\'t evidence.',3:'Doesn\'t test.' } },
    ],
  },
  // VOCAB
  {
    id: 'single-blank', sectionId: 'vocab', name: 'Single-Blank Sentence Completion', icon: '📝', priority: 'critical', hasPassages: false,
    lesson: {
      title: 'How Single-Blank Vocab Works',
      sections: [
        { heading: 'You don\'t need to know every word', body: 'Use SENTENCE CLUES to figure out what kind of word fits, then match to choices.' },
        { heading: 'Four-step move', body: '1. Read whole sentence.\n2. Cover answers. Make up your own word.\n3. Find closest choice.\n4. Plug back in. Does it work?', example: '"Brandon hides ... He remains ___ so his sister doesn\'t see him move."\nYour word: "still." → "stationary" matches.' },
        { heading: 'Signal words', body: '• ALTHOUGH/BUT/UNLIKE → contrast (opposite)\n• BECAUSE/SO → cause/effect\n• AND/ALSO → similar' },
        { heading: 'Trap', body: 'Wrong answers can sound right but mean opposite. Always plug back in.' },
      ],
    },
    warmups: [
      { id: 'sb-w1', question: 'After running a long race, Maya was very ______.', choices: ['hungry','tired','lucky','tall'], answer: 1, explanation: 'Direct effect of running.', wrongExplanations: { 0:'Maybe — but tired more direct.',2:'Off-topic.',3:'Off-topic.' } },
      { id: 'sb-w2', question: 'The library was very ______, so everyone whispered.', choices: ['loud','quiet','crowded','cold'], answer: 1, explanation: 'Whispering = quiet.', wrongExplanations: { 0:'Opposite.',2:'Doesn\'t cause whispering.',3:'Doesn\'t cause it.' } },
      { id: 'sb-w3', question: 'ALTHOUGH the soup looked good, it tasted ______.', choices: ['delicious','terrible','hot','fast'], answer: 1, explanation: 'Although = contrast.', wrongExplanations: { 0:'No contrast.',2:'Doesn\'t contrast.',3:'Not a taste.' } },
    ],
  },
  {
    id: 'two-blank', sectionId: 'vocab', name: 'Two-Blank Sentence Completion', icon: '✏️', priority: 'high', hasPassages: false,
    lesson: {
      title: 'How Two-Blank Sentences Work',
      sections: [
        { heading: 'Why tricky', body: 'Both blanks must fit. If EITHER is wrong, whole pair is wrong.' },
        { heading: 'The move', body: '1. Read whole sentence.\n2. Pick easier blank first.\n3. Cross out pairs where that word doesn\'t fit.\n4. Check second blank in remaining pairs.' },
        { heading: 'Signal words', body: 'ALTHOUGH/BUT/BECAUSE/SO/AND tell you if blanks should mean SIMILAR or OPPOSITE.', example: '"Although the evidence seemed [strong], the detective remained [skeptical]."' },
      ],
    },
    warmups: [
      { id: 'tb-w1', question: 'The day was ______, so Maya wore a ______.', choices: ['cold ... swimsuit','hot ... coat','cold ... coat','rainy ... bathing suit'], answer: 2, explanation: 'Cold day → coat.', wrongExplanations: { 0:'Mismatched.',1:'Mismatched.',3:'Mismatched.' } },
      { id: 'tb-w2', question: 'Sam was ______ to win, so he practiced ______.', choices: ['determined ... daily','sad ... loudly','tired ... never','quick ... slowly'], answer: 0, explanation: 'Match works.', wrongExplanations: { 1:'Sad/loud doesn\'t fit.',2:'Tired/never doesn\'t fit.',3:'Contradiction.' } },
      { id: 'tb-w3', question: 'ALTHOUGH the team played ______, they ______ the game.', choices: ['well ... won','badly ... won','badly ... lost','well ... cheered'], answer: 1, explanation: 'Although = contrast.', wrongExplanations: { 0:'No contrast.',2:'No contrast.',3:'No contrast.' } },
    ],
  },
  // READING
  {
    id: 'main-idea', sectionId: 'reading', name: 'Reading: Main Idea', icon: '🎯', priority: 'high', hasPassages: true,
    lesson: {
      title: 'How Main Idea Questions Work',
      sections: [
        { heading: 'What "main idea" means', body: 'Main idea = what the WHOLE passage is about. Not one paragraph, not one sentence.' },
        { heading: 'Where to find it', body: 'First sentence of each paragraph. Last sentence of the whole passage.' },
        { heading: 'Trap to watch', body: '• TOO NARROW — only one detail\n• TOO BROAD — covers more than the passage\n• OFF-TOPIC — sounds related but not stated', example: '"All planets are different" — too broad. "Earth has water" — too narrow.' },
        { heading: 'The move', body: 'Ask: "What would I tell my friend in ONE sentence?" That\'s the main idea.' },
      ],
    },
    warmups: [],
  },
  {
    id: 'inference', sectionId: 'reading', name: 'Reading: Inference', icon: '🔍', priority: 'critical', hasPassages: true,
    lesson: {
      title: 'How Inference Questions Work',
      sections: [
        { heading: 'Inference = read between lines', body: 'Passage doesn\'t SAY the answer. Figure it out from clues — but the answer must still be SUPPORTED by the passage.' },
        { heading: 'Signal words', body: '"Most likely," "probably," "implies," "suggests," "Based on the passage..."' },
        { heading: 'The move', body: 'For each choice, ask: "Where in the passage is the EVIDENCE?" If you have to use outside knowledge, it\'s wrong.', example: '"The narrator paused, hands trembling." → nervous (evidence in passage).' },
        { heading: 'Big trap', body: 'Wrong answers go TOO FAR. The passage suggests upset; the wrong answer says "furious." Stick close to evidence.' },
      ],
    },
    warmups: [],
  },
  {
    id: 'authors-purpose', sectionId: 'reading', name: 'Reading: Author\'s Purpose', icon: '✒️', priority: 'high', hasPassages: true,
    lesson: {
      title: "How Author's Purpose Works",
      sections: [
        { heading: 'Four reasons authors write', body: '• INFORM — facts (science article)\n• PERSUADE — convince you\n• ENTERTAIN — story, hold attention\n• DESCRIBE — paint picture' },
        { heading: 'Tone clues', body: '• Facts/dates/sci words = INFORM\n• "We should" / "you should" = PERSUADE\n• Characters/dialogue = ENTERTAIN\n• Adjectives/sensory = DESCRIBE' },
        { heading: 'Trap', body: 'Wrong answers are TOO STRONG. Mention of conservation in 1 paragraph doesn\'t make the whole passage PERSUADE if 90% is facts.' },
        { heading: 'Fact vs. opinion', body: '"Best," "more interesting," "should" = opinion. Anything verifiable = fact.' },
      ],
    },
    warmups: [],
  },
  // WRITING MECHANICS
  {
    id: 'grammar-usage', sectionId: 'writing-mechanics', name: 'Grammar & Usage', icon: '📐', priority: 'high', hasPassages: false,
    lesson: {
      title: 'How Grammar & Usage Works',
      sections: [
        { heading: 'Big four traps', body: '1. WRONG PRONOUN (he/me, I/me)\n2. SUBJECT-VERB DISAGREEMENT\n3. WRONG TENSE\n4. RUN-ONS' },
        { heading: 'Pronoun trick', body: 'Drop the other person. "Sarah and I/me went..." → "I went." ✓ Use I.', example: 'When in doubt, take the other person OUT.' },
        { heading: 'Subject-verb trick', body: 'Ignore middle words. "Each of the girls (have/has) her own locker." Subject is EACH (singular). HAS.' },
        { heading: 'Run-on trick', body: 'Split at comma. If both halves are complete sentences, comma alone isn\'t enough — need period or "and/but/because."' },
      ],
    },
    warmups: [
      { id: 'gu-w1', question: 'Sarah and ______ went to the movies.', choices: ['me','I','myself','her'], answer: 1, explanation: 'Drop "Sarah and": "I went." ✓', wrongExplanations: { 0:'Object form.',2:'Wrong here.',3:'Wrong role.' } },
      { id: 'gu-w2', question: 'Each student ______ a pencil.', choices: ['need','needs','are needing','were needing'], answer: 1, explanation: '"Each" is singular.', wrongExplanations: { 0:'Plural.',2:'Plural.',3:'Plural.' } },
      { id: 'gu-w3', question: 'Which is a RUN-ON?', choices: ['I love pizza, my brother loves tacos.','I love pizza, but my brother loves tacos.','I love pizza when it has cheese.','When I eat pizza, I am happy.'], answer: 0, explanation: 'Two complete sentences with just a comma.', wrongExplanations: { 1:'Has "but."',2:'One complete sentence.',3:'One complete sentence.' } },
    ],
  },
  // WRITING CONCEPTS
  {
    id: 'topic-supporting', sectionId: 'writing-concepts', name: 'Topic Sentence & Supporting Detail', icon: '🏛️', priority: 'high', hasPassages: false,
    lesson: {
      title: 'How Topic Sentences and Supporting Details Work',
      sections: [
        { heading: 'The structure', body: 'Topic sentence (what paragraph is about) + supporting details (proof or explanation).' },
        { heading: 'Good topic sentence', body: '• SPECIFIC enough to make a claim\n• BROAD enough to cover the whole paragraph\n• PREVIEWS what the paragraph will discuss', example: 'GOOD: "Pizza is the perfect meal because it\'s tasty, customizable, and easy to share."' },
        { heading: 'Good supporting detail', body: 'DIRECTLY proves the topic sentence. RELEVANT. SPECIFIC.' },
        { heading: 'Trap', body: 'Wrong answers use words from the paragraph but don\'t actually fit. ON TOPIC but not on POINT.' },
      ],
    },
    warmups: [
      { id: 'ts-w1', question: 'Topic: "Dogs make great pets." Best supporting detail?', choices: ['Dogs are animals.','My friend has a goldfish.','Dogs are loyal and provide companionship.','Some dogs eat strange things.'], answer: 2, explanation: 'Loyalty + companionship support claim.', wrongExplanations: { 0:'Too obvious.',1:'Off-topic.',3:'Hurts claim.' } },
      { id: 'ts-w2', question: 'Best topic sentence for paragraph about why students should read more?', choices: ['Books are interesting.','I read every night.','Reading regularly improves vocabulary, focus, and creativity.','There are many books in the library.'], answer: 2, explanation: 'States claim and previews three reasons.', wrongExplanations: { 0:'Vague.',1:'Personal.',3:'Off-topic.' } },
      { id: 'ts-w3', question: 'Read: "Brushing prevents cavities. ______. It also keeps breath fresh." Best fill?', choices: ['Toothbrushes come in many colors.','It also strengthens gums.','My dentist is nice.','Some people forget to brush.'], answer: 1, explanation: 'Another benefit fits pattern.', wrongExplanations: { 0:'Off-topic.',2:'Off-topic.',3:'Hurts topic.' } },
    ],
  },
  {
    id: 'sentence-ordering', sectionId: 'writing-concepts', name: 'Sentence Ordering', icon: '🔢', priority: 'high', hasPassages: false,
    lesson: {
      title: 'How Sentence Ordering Works',
      sections: [
        { heading: 'What gets ordered', body: '• CHRONOLOGICAL — by time\n• LOGICAL — by cause/effect or general → specific' },
        { heading: 'Chronological move', body: '1. Look for TIME WORDS (first, then, after, before, finally).\n2. If none, use logic: birth before death, escape before traveling.\n3. Number events: 1, 2, 3, 4. Match.', example: 'Tubman: born → escaped → Underground Railroad → Civil War.' },
        { heading: 'Logical move', body: '1. TOPIC SENTENCE first.\n2. Supporting details next.\n3. CONCLUSION last.' },
        { heading: 'Trap', body: 'Wrong answers usually have one pair right and one wrong. Check FIRST and LAST sentences in each option.' },
      ],
    },
    warmups: [
      { id: 'so-w1', question: 'Put in chronological order:\n1. Cake eaten\n2. Mom mixed batter\n3. Cake baked\n4. Mom bought ingredients', choices: ['1, 2, 3, 4','4, 2, 3, 1','2, 3, 4, 1','4, 3, 2, 1'], answer: 1, explanation: 'Buy → mix → bake → eat.', wrongExplanations: { 0:'Eat first.',2:'Mix before buying.',3:'Bake before mixing.' } },
      { id: 'so-w2', question: 'Put in chronological order:\n1. Egg hatched\n2. Chick grew\n3. Chicken laid egg\n4. Egg kept warm', choices: ['1, 2, 3, 4','3, 4, 1, 2','4, 1, 2, 3','2, 1, 4, 3'], answer: 1, explanation: 'Lay → warm → hatch → grow.', wrongExplanations: { 0:'Hatch before warm.',2:'Warm before laid.',3:'Grew before hatched.' } },
      { id: 'so-w3', question: 'Which sentence should come FIRST?\n(A) For example, you can earn coins by completing levels.\n(B) Video games can teach important skills.\n(C) These skills include problem-solving.\n(D) Many parents are surprised by this.', choices: ['A','B','C','D'], answer: 1, explanation: 'B is topic sentence.', wrongExplanations: { 0:'"For example" is for support.',2:'"These skills" assumes prior.',3:'"This" assumes prior.' } },
    ],
  },
  // QUANT
  {
    id: 'column-comparison', sectionId: 'quant', name: 'Column A vs Column B', icon: '⚖️', priority: 'critical', hasPassages: false,
    lesson: {
      title: 'How Column A vs Column B Works (Most Important Type)',
      sections: [
        { heading: 'The format', body: 'Two quantities — Column A and Column B. Pick which is bigger, equal, or cannot determine.\n\nThe four answer choices are ALWAYS:\n(A) Column A is greater\n(B) Column B is greater\n(C) They are equal\n(D) Cannot be determined' },
        { heading: 'Why this matters', body: 'BIGGEST point pool on Quant Reasoning — about 1/3. Most kids have NEVER seen this format.' },
        { heading: 'The move', body: '1. Calculate Column A.\n2. Calculate Column B.\n3. Compare. Pick A, B, or C.\n4. If unknowns/variables, TRY VALUES.', example: 'A: 25% of 80. B: 80% of 25. Both = 20. → C.' },
        { heading: 'When to pick "Cannot be determined"', body: 'ONLY when there\'s a VARIABLE that could change the answer. If both columns are FIXED numbers, never D.' },
        { heading: 'Trap', body: 'Some look uncertain but actually have one answer. Don\'t pick D just because it feels uncertain.' },
      ],
    },
    warmups: [
      { id: 'cc-w1', question: 'Column A: 5 + 5\nColumn B: 5 × 2', choices: ['Column A is greater','Column B is greater','They are equal','Cannot be determined'], answer: 2, explanation: 'Both 10.', wrongExplanations: { 0:'Both 10.',1:'Both 10.',3:'Calculable.' } },
      { id: 'cc-w2', question: 'Column A: 3 × 4\nColumn B: 2 × 6', choices: ['Column A is greater','Column B is greater','They are equal','Cannot be determined'], answer: 2, explanation: 'Both 12.', wrongExplanations: { 0:'Both 12.',1:'Both 12.',3:'Calculable.' } },
      { id: 'cc-w3', question: 'x is any whole number.\nColumn A: x + 5\nColumn B: x + 3', choices: ['Column A is greater','Column B is greater','They are equal','Cannot be determined'], answer: 0, explanation: 'A always 2 more.', wrongExplanations: { 1:'+5 always > +3.',2:'Differ by 2.',3:'A always greater.' } },
    ],
  },
  {
    id: 'patterns', sectionId: 'quant', name: 'Number Patterns', icon: '🔁', priority: 'high', hasPassages: false,
    lesson: {
      title: 'How Number Patterns Work',
      sections: [
        { heading: 'Find the DIFFERENCE', body: 'Look at differences between consecutive numbers — that tells you the rule.', example: '2, 5, 8, 11, ___ → diffs: 3, 3, 3 → +3 → next is 14.' },
        { heading: 'Common patterns', body: '• ADD constant: 3, 6, 9, 12...\n• MULTIPLY: 2, 4, 8, 16...\n• ADD GROWING NUM: 1, 2, 4, 7, 11...\n• SQUARES: 1, 4, 9, 16, 25...\n• FIBONACCI: 1, 1, 2, 3, 5, 8...' },
        { heading: 'Growing differences', body: 'If first diffs aren\'t constant, take their differences. If THOSE are constant, the rule is "add increasing amounts."', example: '2, 7, 17, 32, 52 → diffs: 5, 10, 15, 20 → second diffs: 5, 5, 5. Next first diff: 25 → next: 77.' },
        { heading: 'Trap', body: 'Wrong answers add ONE more by adding the LAST diff instead of the NEXT growing diff.' },
      ],
    },
    warmups: [
      { id: 'pa-w1', question: 'What comes next?\n2, 4, 6, 8, ___', choices: ['9','10','12','16'], answer: 1, explanation: '+2 each.', wrongExplanations: { 0:'+1 wrong.',2:'+4.',3:'×2.' } },
      { id: 'pa-w2', question: 'What comes next?\n3, 6, 12, 24, ___', choices: ['30','36','48','60'], answer: 2, explanation: '×2 each.', wrongExplanations: { 0:'+6.',1:'+12.',3:'Off.' } },
      { id: 'pa-w3', question: 'What comes next?\n1, 4, 9, 16, ___', choices: ['20','25','32','36'], answer: 1, explanation: 'Squares: 5²=25.', wrongExplanations: { 0:'+4.',2:'×2.',3:'6².' } },
    ],
  },
  // MATH
  {
    id: 'fractions', sectionId: 'math', name: 'Fraction Operations', icon: '🔪', priority: 'high', hasPassages: false,
    lesson: {
      title: 'How Fraction Questions Work',
      sections: [
        { heading: 'The four moves', body: '1. ADDING/SUBTRACTING — common denominator FIRST.\n2. MULTIPLYING — multiply tops, multiply bottoms.\n3. COMPARING — same denom or think size.\n4. FRACTION OF A NUMBER — multiply.' },
        { heading: 'Add/Subtract', body: 'Common denominator first. NEVER add tops AND bottoms. 2/3 + 1/4 ≠ 3/7.', example: '2/3 = 8/12. 1/4 = 3/12. 8/12 + 3/12 = 11/12.' },
        { heading: 'Multiply', body: 'Just multiply tops and bottoms. NO common denominator needed.', example: '3/4 × 2/5 = 6/20 = 3/10.' },
        { heading: 'Compare', body: 'Convert to same denom. 3/4 vs 7/8: 3/4 = 6/8. 6/8 < 7/8.' },
        { heading: 'Fraction of a number', body: 'Multiply. 2/3 of 30 = 20.' },
      ],
    },
    warmups: [
      { id: 'fr-w1', question: '1/2 + 1/2 = ?', choices: ['1/4','2/4','1','1/1'], answer: 2, explanation: '2/2 = 1.', wrongExplanations: { 0:'Don\'t multiply bottoms.',1:'=1/2.',3:'Same as 1.' } },
      { id: 'fr-w2', question: '1/2 × 1/2 = ?', choices: ['1/4','2/4','1/2','1'], answer: 0, explanation: '1×1=1, 2×2=4.', wrongExplanations: { 1:'Adding.',2:'Same.',3:'Way too big.' } },
      { id: 'fr-w3', question: 'Bigger: 3/4 or 1/2?', choices: ['3/4','1/2','Equal','Cannot tell'], answer: 0, explanation: '3/4 > 1/2.', wrongExplanations: { 1:'1/2 < 3/4.',2:'Different.',3:'Calculable.' } },
    ],
  },
  {
    id: 'word-problems', sectionId: 'math', name: 'Word Problem → Equation', icon: '🔣', priority: 'high', hasPassages: false,
    lesson: {
      title: 'How Word Problems Work',
      sections: [
        { heading: 'Translation move', body: 'Word problems = math hidden in words. Translate.\n\n• "more than" → ADD\n• "less than" → SUBTRACT\n• "times" / "of" → MULTIPLY\n• "per" / "divided by" → DIVIDE\n• "is" / "equals" → =\n• "what number" → x' },
        { heading: 'Four-step move', body: '1. UNDERLINE the question.\n2. WRITE numbers and meanings.\n3. TRANSLATE to equation.\n4. SOLVE.', example: '"Garden length 4× width. Perimeter 240. Length?"\n→ w + 4w (×2) = 240 → 10w = 240 → w=24. Length = 96.' },
        { heading: 'Watch "less than"', body: '"5 less than x" = x - 5 (NOT 5 - x).' },
        { heading: 'Trap', body: 'Wrong answers use numbers FROM the problem. The right answer is usually a number you have to CALCULATE.' },
      ],
    },
    warmups: [
      { id: 'wp-w1', question: 'Sarah has 15 apples. Tom has 9. How many MORE does Sarah have?', choices: ['24','6','15','9'], answer: 1, explanation: 'Subtract.', wrongExplanations: { 0:'TRAP — sum.',2:'TRAP — Sarah.',3:'TRAP — Tom.' } },
      { id: 'wp-w2', question: 'Pizza has 8 slices. 3 friends each eat 2. How many LEFT?', choices: ['2','5','6','8'], answer: 0, explanation: '8-6=2.', wrongExplanations: { 1:'8-3.',2:'Eaten.',3:'Total.' } },
      { id: 'wp-w3', question: 'Book has 200 pages. Maya read 1/4. Pages read?', choices: ['25','50','75','100'], answer: 1, explanation: '200/4=50.', wrongExplanations: { 0:'1/8.',2:'Off.',3:'1/2.' } },
    ],
  },
  {
    id: 'geometry', sectionId: 'math', name: 'Geometry: Perimeter, Area & Volume', icon: '📐', priority: 'high', hasPassages: false,
    lesson: {
      title: 'How Geometry Works',
      sections: [
        { heading: 'Memorize formulas', body: '• PERIMETER rect = 2(L+W)\n• AREA rect = L × W\n• AREA triangle = (B × H) / 2\n• VOLUME box = L × W × H\n• Triangle angles add to 180°' },
        { heading: 'The move', body: '1. Identify shape.\n2. Identify what\'s asked.\n3. Pick formula.\n4. Plug in numbers.', example: 'Triangle base 10, height 6. Area = (10×6)/2 = 30.' },
        { heading: 'Triangle trick', body: 'Two angles known? Third = 180 - sum. 65 + 75 = 140. 180 - 140 = 40.' },
        { heading: 'Trap', body: 'Don\'t mix up perimeter and area. Perimeter = around. Area = inside. Volume = inside 3D.\n\nUnits: perimeter = inches. Area = in². Volume = in³.' },
      ],
    },
    warmups: [
      { id: 'ge-w1', question: 'Rectangle 6×4. Perimeter?', choices: ['10','20','24','40'], answer: 1, explanation: '2(6+4)=20.', wrongExplanations: { 0:'L+W only.',2:'AREA.',3:'Wrong.' } },
      { id: 'ge-w2', question: 'Rectangle 6×4. Area?', choices: ['10','20','24','40'], answer: 2, explanation: '6×4=24.', wrongExplanations: { 0:'Adding.',1:'PERIMETER.',3:'Wrong.' } },
      { id: 'ge-w3', question: 'Triangle has angles 50° and 60°. Third?', choices: ['30°','70°','90°','110°'], answer: 1, explanation: '180-50-60=70.', wrongExplanations: { 0:'Off.',2:'Wrong sum.',3:'Too big.' } },
    ],
  },
];

// ─── Lazy loader for question pools ───
const _topicCache = {};
const _chunkCache = {};

export async function loadTopicQuestions(topicId) {
  if (_topicCache[topicId]) return _topicCache[topicId];
  const res = await fetch(`/questions/${topicId}.json`);
  if (!res.ok) throw new Error(`Failed to load ${topicId}`);
  const data = await res.json();
  _topicCache[topicId] = data;
  return data;
}

export async function loadMixedChunk(chunkIndex) {
  if (_chunkCache[chunkIndex]) return _chunkCache[chunkIndex];
  const res = await fetch(`/mixed/chunk-${chunkIndex}.json`);
  if (!res.ok) throw new Error(`Failed to load chunk ${chunkIndex}`);
  const data = await res.json();
  _chunkCache[chunkIndex] = data;
  return data;
}

export async function loadMixedManifest() {
  const res = await fetch('/mixed/manifest.json');
  if (!res.ok) return { totalChunks: 1, totalQuestions: 0 };
  return await res.json();
}

export function getTopicMeta(topicId) {
  return TOPICS_META.find(t => t.id === topicId);
}

export function getTopicsBySection(sectionId) {
  return TOPICS_META.filter(t => t.sectionId === sectionId);
}
