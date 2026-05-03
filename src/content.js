// ERB CTP5 Level 5 — Topic-by-topic content
// Each topic teaches the question type from zero, then drills it until it sticks.
// 17 topics across 7 sections — research-backed for highest score-per-minute.

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

// Sections — kept for grouping topic cards on the menu
export const SECTIONS = [
  { id: 'verbal', name: 'Verbal Reasoning', icon: '🔤', color: '#6366f1' },
  { id: 'vocab', name: 'Vocabulary', icon: '📚', color: '#8b5cf6' },
  { id: 'reading', name: 'Reading Comprehension', icon: '📖', color: '#3b82f6' },
  { id: 'writing-mechanics', name: 'Writing Mechanics', icon: '✏️', color: '#10b981' },
  { id: 'writing-concepts', name: 'Writing Concepts', icon: '📝', color: '#14b8a6' },
  { id: 'quant', name: 'Quantitative Reasoning', icon: '🔢', color: '#f59e0b' },
  { id: 'math', name: 'Mathematics', icon: '➗', color: '#ef4444' },
];

// ─── TOPICS ─────────────────────────────────────────────────────────
// Each topic: { id, sectionId, name, icon, priority, lesson, warmups, questions }
//   priority: 'critical' (school skips this — biggest score gain) | 'high' | 'standard'
//   lesson: { title, sections: [{heading, body, example?}] }
//   warmups: questions worded super easy, with explanations on every wrong answer
//   questions: real ERB-level questions, with on-wrong explanations

export const TOPICS = [
  // ═══════════════════════════════════════════════════════════
  // VERBAL REASONING
  // ═══════════════════════════════════════════════════════════
  {
    id: 'analogies',
    sectionId: 'verbal',
    name: 'Analogies',
    icon: '🔗',
    priority: 'critical',
    lesson: {
      title: 'How Analogies Work',
      sections: [
        {
          heading: 'What an analogy is',
          body: 'An analogy is a word puzzle that says: "A is to B the same way C is to ___." Your job is to figure out the RELATIONSHIP between the first pair, then find the answer choice with the SAME relationship.',
        },
        {
          heading: 'The four-step move',
          body: '1. Read the first pair.\n2. Say the relationship out loud as a sentence: "A BIRD lives in a NEST."\n3. Use that exact same sentence on each answer choice.\n4. Pick the one that fits.',
          example: 'BIRD : NEST :: BEE : ?\nSentence: "A BIRD lives in a NEST."\nTry it: "A BEE lives in a HIVE." ✓ → Answer is HIVE.',
        },
        {
          heading: 'Common relationships',
          body: '• PART to WHOLE — petal : flower\n• YOUNG to ADULT — puppy : dog\n• TOOL to USER — hammer : carpenter\n• OPPOSITES — hot : cold\n• DEGREE — warm : hot, hungry : famished\n• CAUSE to EFFECT — rain : flood\n• ITEM to CATEGORY — robin : bird',
        },
        {
          heading: 'The trap to watch for',
          body: 'Test-makers put answers that share a WORD with the original pair but not the relationship. If the question is BIRD : NEST and a choice is BIRD : SKY — that\'s a trap. Trust the relationship, not the word.',
        },
      ],
    },
    warmups: [
      {
        id: 'an-w1',
        question: 'PUPPY : DOG ::',
        choices: ['kitten : cat', 'cat : mouse', 'fish : water', 'tail : dog'],
        answer: 0,
        explanation: 'A PUPPY is a young DOG. A KITTEN is a young CAT. Same relationship: young animal to adult.',
        wrongExplanations: {
          1: 'Cats chase mice — that\'s predator/prey, not young/adult.',
          2: 'Fish live in water — that\'s habitat, not young/adult.',
          3: 'A tail is part of a dog — that\'s part/whole, not young/adult.',
        },
      },
      {
        id: 'an-w2',
        question: 'HOT : COLD ::',
        choices: ['warm : cool', 'sun : moon', 'big : huge', 'up : down'],
        answer: 3,
        explanation: 'HOT and COLD are exact opposites. UP and DOWN are exact opposites. Same relationship.',
        wrongExplanations: {
          0: 'Warm/cool are kind of opposite but milder — not as exact. UP/DOWN is a stronger match.',
          1: 'Sun/moon are not opposites — they\'re both objects in the sky.',
          2: 'Big and huge mean similar things, not opposite.',
        },
      },
      {
        id: 'an-w3',
        question: 'PETAL : FLOWER ::',
        choices: ['bee : honey', 'page : book', 'leaf : tree', 'page : book and leaf : tree'],
        answer: 3,
        explanation: 'A PETAL is part of a FLOWER. Both PAGE : BOOK and LEAF : TREE show the same part-to-whole relationship. (On the real test you\'d only have one — this question shows two equally good answers exist for some relationships.)',
        wrongExplanations: {
          0: 'Bees make honey — that\'s producer/product, not part/whole.',
          1: 'Right relationship, but C is also right. Always check all choices.',
          2: 'Right relationship, but B is also right. Always check all choices.',
        },
      },
    ],
    questions: [
      {
        id: 'an-1',
        question: 'AUTHOR : NOVEL ::',
        choices: ['painter : brush', 'composer : symphony', 'actor : stage', 'chef : kitchen'],
        answer: 1,
        explanation: 'Sentence: "An AUTHOR creates a NOVEL." A COMPOSER creates a SYMPHONY. Creator to creation.',
        wrongExplanations: {
          0: 'A painter USES a brush — tool, not creation. The brush is what they use, not what they make.',
          2: 'An actor PERFORMS ON a stage — location, not creation.',
          3: 'A chef WORKS IN a kitchen — location, not creation.',
        },
      },
      {
        id: 'an-2',
        question: 'WHISPER : SHOUT ::',
        choices: ['walk : move', 'drizzle : downpour', 'speak : talk', 'read : write'],
        answer: 1,
        explanation: 'WHISPER is quiet speaking; SHOUT is loud speaking. DRIZZLE is light rain; DOWNPOUR is heavy rain. Both pairs show DEGREE — same thing, different intensity.',
        wrongExplanations: {
          0: 'Walking IS moving — that\'s category, not degree of intensity.',
          2: 'Speak and talk mean almost the same thing, not different intensities.',
          3: 'Read and write are different actions, not degrees of one action.',
        },
      },
      {
        id: 'an-3',
        question: 'TELESCOPE : ASTRONOMER ::',
        choices: ['hammer : nail', 'stethoscope : doctor', 'book : library', 'shoe : runner'],
        answer: 1,
        explanation: 'Sentence: "A TELESCOPE is the tool an ASTRONOMER uses." A STETHOSCOPE is the tool a DOCTOR uses. Tool to user.',
        wrongExplanations: {
          0: 'A hammer hits a nail — tool to OBJECT, not tool to USER.',
          2: 'A book is in a library — item to location.',
          3: 'A shoe is worn by a runner — clothing, not a special tool of the trade.',
        },
      },
      {
        id: 'an-4',
        question: 'FAMISHED : HUNGRY ::',
        choices: ['tired : sleepy', 'furious : annoyed', 'happy : glad', 'cold : freezing'],
        answer: 1,
        explanation: 'FAMISHED is an extreme version of HUNGRY. FURIOUS is an extreme version of ANNOYED. Degree — strong to mild.',
        wrongExplanations: {
          0: 'Tired and sleepy are about the same — not strong vs. mild.',
          2: 'Happy and glad mean basically the same thing — same degree.',
          3: 'FREEZING is the EXTREME version of COLD. The order is flipped — should be cold:freezing matches hungry:famished, but the question goes strong→mild.',
        },
      },
      {
        id: 'an-5',
        question: 'ISLAND : OCEAN ::',
        choices: ['mountain : valley', 'oasis : desert', 'river : bridge', 'forest : meadow'],
        answer: 1,
        explanation: 'An ISLAND is land surrounded by OCEAN. An OASIS is greenery surrounded by DESERT. Surrounded-by relationship.',
        wrongExplanations: {
          0: 'A mountain is next to a valley, not surrounded by it.',
          2: 'A bridge crosses a river — that\'s about, not surrounded by.',
          3: 'A forest and meadow are different types of land next to each other.',
        },
      },
      {
        id: 'an-6',
        question: 'CALF : COW ::',
        choices: ['puppy : dog', 'cat : kitten', 'bird : nest', 'fish : water'],
        answer: 0,
        explanation: 'A CALF is a young COW. A PUPPY is a young DOG. Young to adult.',
        wrongExplanations: {
          1: 'Order is reversed — should be young first, adult second. Kitten is young; cat is adult.',
          2: 'A bird lives in a nest — habitat, not young/adult.',
          3: 'A fish lives in water — habitat, not young/adult.',
        },
      },
      {
        id: 'an-7',
        question: 'CHAPTER : BOOK ::',
        choices: ['verse : poem', 'word : letter', 'cover : magazine', 'shelf : library'],
        answer: 0,
        explanation: 'A CHAPTER is a section of a BOOK. A VERSE is a section of a POEM. Part to whole.',
        wrongExplanations: {
          1: 'A letter is part of a word — backwards from the question (small inside big).',
          2: 'A cover is on the OUTSIDE of a magazine, not a section of it.',
          3: 'A shelf holds books in a library — container, not section.',
        },
      },
      {
        id: 'an-8',
        question: 'ANCIENT : MODERN ::',
        choices: ['tall : short', 'quick : fast', 'bright : shiny', 'large : huge'],
        answer: 0,
        explanation: 'ANCIENT and MODERN are opposites in time. TALL and SHORT are opposites in height. Antonyms.',
        wrongExplanations: {
          1: 'Quick and fast mean the same thing.',
          2: 'Bright and shiny mean similar things.',
          3: 'Large and huge are degrees of the same thing.',
        },
      },
      {
        id: 'an-9',
        question: 'CAPTAIN : SHIP ::',
        choices: ['pilot : airplane', 'passenger : bus', 'wheel : car', 'track : train'],
        answer: 0,
        explanation: 'A CAPTAIN commands a SHIP. A PILOT commands an AIRPLANE. Person who controls a vehicle.',
        wrongExplanations: {
          1: 'A passenger RIDES on a bus — they don\'t control it.',
          2: 'A wheel is part of a car — it isn\'t a person.',
          3: 'A track is what a train runs on — not a person.',
        },
      },
      {
        id: 'an-10',
        question: 'COCOON : BUTTERFLY ::',
        choices: ['egg : chicken', 'cave : bat', 'shell : turtle', 'web : spider'],
        answer: 0,
        explanation: 'A COCOON is the stage BEFORE a BUTTERFLY emerges. An EGG is the stage BEFORE a CHICKEN hatches. Both are pre-life containers.',
        wrongExplanations: {
          1: 'A cave is where a bat lives — habitat, not pre-life stage.',
          2: 'A shell is part of a turtle\'s body, not a stage it grows out of.',
          3: 'A web is what a spider builds — tool/creation, not pre-life stage.',
        },
      },
    ],
  },

  {
    id: 'categorization',
    sectionId: 'verbal',
    name: 'Categorization',
    icon: '📂',
    priority: 'critical',
    lesson: {
      title: 'How Categorization Works',
      sections: [
        {
          heading: 'Two question shapes',
          body: 'Categorization questions come in two forms:\n\n1. ODD ONE OUT: Three things share something. One doesn\'t. Pick the one that doesn\'t fit.\n2. BEST HEADING: Four things share something. Pick the heading that describes them best.',
        },
        {
          heading: 'The move for ODD ONE OUT',
          body: 'Look at all four items. Ask: "What three of these have in common?" Once you see the connection, the fourth one is your answer.',
          example: 'violin, trumpet, cello, harp\n→ Violin, cello, harp all use STRINGS. Trumpet uses BREATH. Trumpet is the odd one out.',
        },
        {
          heading: 'The move for BEST HEADING',
          body: 'The right heading is SPECIFIC enough to fit all four — but not so broad it could fit anything. Cross out headings that are too broad ("things you can buy") or too narrow ("only red things").',
          example: 'marble, granite, limestone, sandstone\nGood heading: "Types of rock" ✓\nBad heading: "Building materials" — too broad, includes wood, glass, etc.',
        },
        {
          heading: 'The trap',
          body: 'Some answers fit MOST of the items but not ALL. If three items are "things in space" and one is "spaceship" — spaceship is in space but it\'s not NATURAL. The category is "natural objects in space," not just "space stuff." Always look for the most specific connection.',
        },
      ],
    },
    warmups: [
      {
        id: 'cat-w1',
        question: 'Which word does NOT belong with the others?',
        context: 'apple, banana, orange, carrot',
        choices: ['apple', 'banana', 'orange', 'carrot'],
        answer: 3,
        explanation: 'Apple, banana, and orange are FRUITS. Carrot is a VEGETABLE. Carrot is the odd one out.',
        wrongExplanations: {
          0: 'Apple is a fruit — it fits with banana and orange.',
          1: 'Banana is a fruit — it fits with apple and orange.',
          2: 'Orange is a fruit — it fits with apple and banana.',
        },
      },
      {
        id: 'cat-w2',
        question: 'Which word does NOT belong with the others?',
        context: 'red, blue, square, green',
        choices: ['red', 'blue', 'square', 'green'],
        answer: 2,
        explanation: 'Red, blue, and green are COLORS. Square is a SHAPE. Square is the odd one out.',
        wrongExplanations: {
          0: 'Red is a color — fits the group.',
          1: 'Blue is a color — fits the group.',
          3: 'Green is a color — fits the group.',
        },
      },
      {
        id: 'cat-w3',
        question: 'Which would be the best heading for this group?',
        context: 'dog, cat, hamster, goldfish',
        choices: ['Animals', 'Pets', 'Furry creatures', 'Things that bark'],
        answer: 1,
        explanation: '"Pets" is the best heading — specific to all four. "Animals" is too broad (includes lions, sharks). "Furry creatures" excludes goldfish. "Things that bark" only fits dogs.',
        wrongExplanations: {
          0: 'Too broad. "Animals" includes wild animals like tigers — not specific enough.',
          2: 'Goldfish aren\'t furry. This heading excludes one of the four.',
          3: 'Only dogs bark. This heading only fits one of the four.',
        },
      },
    ],
    questions: [
      {
        id: 'cat-1',
        question: 'Which word does NOT belong with the others?',
        context: 'planet, spaceship, meteor, asteroid',
        choices: ['planet', 'spaceship', 'meteor', 'asteroid'],
        answer: 1,
        explanation: 'Planet, meteor, and asteroid are NATURAL objects in space. A spaceship is MAN-MADE. The category is "natural objects," not just "things in space."',
        wrongExplanations: {
          0: 'Planet is natural — fits.',
          2: 'Meteor is natural — fits.',
          3: 'Asteroid is natural — fits.',
        },
      },
      {
        id: 'cat-2',
        question: 'Which word does NOT belong with the others?',
        context: 'violin, trumpet, cello, harp',
        choices: ['violin', 'trumpet', 'cello', 'harp'],
        answer: 1,
        explanation: 'Violin, cello, and harp use STRINGS. Trumpet is BRASS — uses breath. Trumpet is the odd one out.',
        wrongExplanations: {
          0: 'Violin has strings — fits.',
          2: 'Cello has strings — fits.',
          3: 'Harp has strings — fits.',
        },
      },
      {
        id: 'cat-3',
        question: 'Which word does NOT belong with the others?',
        context: 'biography, autobiography, memoir, novel',
        choices: ['biography', 'autobiography', 'memoir', 'novel'],
        answer: 3,
        explanation: 'Biography, autobiography, and memoir are NONFICTION about real people\'s lives. A novel is FICTION. Real vs. made up.',
        wrongExplanations: {
          0: 'Biography is nonfiction — fits.',
          1: 'Autobiography is nonfiction — fits.',
          2: 'Memoir is nonfiction — fits.',
        },
      },
      {
        id: 'cat-4',
        question: 'Which word does NOT belong with the others?',
        context: 'evaporation, condensation, precipitation, irrigation',
        choices: ['evaporation', 'condensation', 'precipitation', 'irrigation'],
        answer: 3,
        explanation: 'Evaporation, condensation, and precipitation are parts of the NATURAL water cycle. Irrigation is MAN-MADE (people watering crops). Natural vs. human.',
        wrongExplanations: {
          0: 'Evaporation is natural — fits the water cycle.',
          1: 'Condensation is natural — fits the water cycle.',
          2: 'Precipitation is natural — fits the water cycle.',
        },
      },
      {
        id: 'cat-5',
        question: 'Which would be the best heading for this group?',
        context: 'marble, granite, limestone, sandstone',
        choices: ['Building materials', 'Types of rock', 'Things found underground', 'Heavy objects'],
        answer: 1,
        explanation: 'All four are SPECIFIC TYPES OF ROCK. "Building materials" is too broad (wood, glass also build). "Things underground" is too vague. "Heavy" doesn\'t define them.',
        wrongExplanations: {
          0: 'Too broad — wood and glass are also building materials.',
          2: 'Too broad and vague — many things are underground.',
          3: 'Doesn\'t describe what they ARE, just a property.',
        },
      },
      {
        id: 'cat-6',
        question: 'Which would be the best heading for this group?',
        context: 'democracy, monarchy, dictatorship, republic',
        choices: ['Things in history', 'Types of government', 'Political parties', 'Ways to vote'],
        answer: 1,
        explanation: 'All four are FORMS OF GOVERNMENT. "Things in history" is way too broad. "Political parties" is wrong category. "Ways to vote" only describes democracy.',
        wrongExplanations: {
          0: 'Way too broad — anything historical fits.',
          2: 'Wrong category — political parties are groups within a government, not types.',
          3: 'Only democracy is about voting. Doesn\'t fit dictatorship or monarchy.',
        },
      },
      {
        id: 'cat-7',
        question: 'Which word does NOT belong with the others?',
        context: 'simile, metaphor, personification, paragraph',
        choices: ['simile', 'metaphor', 'personification', 'paragraph'],
        answer: 3,
        explanation: 'Simile, metaphor, and personification are FIGURES OF SPEECH (literary devices). A paragraph is a STRUCTURAL UNIT of writing.',
        wrongExplanations: {
          0: 'Simile is a figure of speech — fits.',
          1: 'Metaphor is a figure of speech — fits.',
          2: 'Personification is a figure of speech — fits.',
        },
      },
      {
        id: 'cat-8',
        question: 'Which word does NOT belong with the others?',
        context: 'peninsula, island, continent, mountain',
        choices: ['peninsula', 'island', 'continent', 'mountain'],
        answer: 3,
        explanation: 'Peninsula, island, and continent are landforms defined by their RELATIONSHIP TO WATER (surrounded, mostly surrounded, biggest land). A mountain is defined by ELEVATION.',
        wrongExplanations: {
          0: 'Peninsula is mostly surrounded by water — fits.',
          1: 'Island is surrounded by water — fits.',
          2: 'Continent is the biggest landmass between oceans — fits.',
        },
      },
    ],
  },

  {
    id: 'logic',
    sectionId: 'verbal',
    name: 'Logical Reasoning',
    icon: '🧩',
    priority: 'critical',
    lesson: {
      title: 'How Logical Reasoning Works',
      sections: [
        {
          heading: 'Two question shapes',
          body: 'Logic questions come in two main forms:\n\n1. IF-THEN: You get two facts. Pick the conclusion that MUST be true based ONLY on those facts.\n2. EXPERIMENT: Someone has a theory. Pick the test that would actually prove or weaken it.',
        },
        {
          heading: 'The IF-THEN move',
          body: 'When the question says "ALL X are Y" and "Z is an X," then Z must be Y. Don\'t add anything that isn\'t in the facts.',
          example: 'All citrus fruits have Vitamin C.\nTangerines are citrus fruits.\n→ Therefore, tangerines have Vitamin C.\n\nWHAT\'S NOT TRUE: "Tangerines have MORE Vitamin C than other fruits." The facts don\'t say that.',
        },
        {
          heading: 'Watch for words like "all," "most," "some," "no"',
          body: '• ALL = every single one (strong)\n• MOST = more than half — say "PROBABLY"\n• SOME = at least one — be careful, doesn\'t cover everyone\n• NO = zero — strong negative\n\nIf the question says MOST, the right answer says PROBABLY, not DEFINITELY.',
        },
        {
          heading: 'The EXPERIMENT move',
          body: 'A good experiment has TWO groups: one with the thing being tested, one without. If you only test ONE thing, you can\'t prove it caused the result.',
          example: 'Maya thinks music helps plants grow. Best test:\n→ Two groups of identical plants — one with music, one without. Compare growth.\n→ NOT just playing music for all plants (no control group).',
        },
      ],
    },
    warmups: [
      {
        id: 'lo-w1',
        question: 'All cats have whiskers. Mittens is a cat. Therefore:',
        choices: [
          'All animals with whiskers are cats',
          'Mittens has whiskers',
          'Mittens is named after a glove',
          'Cats are the only animals with whiskers',
        ],
        answer: 1,
        explanation: 'If ALL cats have whiskers, and Mittens IS a cat, then Mittens has whiskers. That\'s all the facts let us conclude.',
        wrongExplanations: {
          0: 'Backwards. The facts say cats have whiskers, not that whiskers = cats. (Dogs have whiskers too.)',
          2: 'The facts don\'t say anything about Mittens\' name origin.',
          3: 'The facts don\'t say cats are the ONLY animals with whiskers.',
        },
      },
      {
        id: 'lo-w2',
        question: 'No fish can fly. A trout is a fish. Therefore:',
        choices: [
          'A trout can fly',
          'A trout cannot fly',
          'All animals that can\'t fly are fish',
          'Trout swim faster than other fish',
        ],
        answer: 1,
        explanation: 'NO fish can fly, and a trout IS a fish. So a trout can\'t fly. The facts directly tell us this.',
        wrongExplanations: {
          0: 'Opposite of what the facts say.',
          2: 'Backwards — there are tons of non-flying animals that aren\'t fish.',
          3: 'The facts say nothing about speed.',
        },
      },
      {
        id: 'lo-w3',
        question: 'Sam thinks his lucky shirt helps him win soccer games. Which test would BEST prove it?',
        choices: [
          'Wear the lucky shirt every game and count wins',
          'Play half the games with the shirt and half without — compare results',
          'Ask his teammates if they think it\'s lucky',
          'Wash the shirt and see if it still works',
        ],
        answer: 1,
        explanation: 'A real test needs TWO groups to compare. Wear the shirt sometimes, don\'t wear it other times, and see if there\'s a difference.',
        wrongExplanations: {
          0: 'Only tests one condition (with shirt). With no comparison, you can\'t tell if the shirt did anything.',
          2: 'Other people\'s opinions aren\'t evidence.',
          3: 'Doesn\'t test whether the shirt works at all — just whether washing matters.',
        },
      },
    ],
    questions: [
      {
        id: 'lo-1',
        question: 'If all citrus fruits are a good source of Vitamin C, and tangerines are citrus fruits, then:',
        choices: [
          'all citrus fruits are tangerines',
          'all citrus fruits have a lot of potassium',
          'all tangerines are a good source of Vitamin C',
          'tangerines have more Vitamin C than other fruits',
        ],
        answer: 2,
        explanation: 'ALL citrus has Vitamin C. Tangerines ARE citrus. So tangerines have Vitamin C.',
        wrongExplanations: {
          0: 'Backwards. Tangerines are citrus, not the other way around.',
          1: 'The facts don\'t mention potassium.',
          3: 'The facts don\'t compare amounts — just say citrus has Vitamin C.',
        },
      },
      {
        id: 'lo-2',
        question: 'Sylvia notices that when her alarm clock goes off, her dog Spot picks up his food dish. She concludes Spot thinks the alarm means food. What would BEST test this?',
        choices: [
          'Give Spot a different food and see if he picks up his dish',
          'Wait until Spot picks up his dish, then set the alarm',
          'Set the alarm at different times of day and see if Spot picks up his dish',
          'Play a different alarm sound each day',
        ],
        answer: 2,
        explanation: 'The theory is: alarm → dish. Best test = change WHEN the alarm goes off and see if Spot still picks up the dish. If he does, the alarm is the cue, not the time of day.',
        wrongExplanations: {
          0: 'Tests food type, not whether the alarm causes the behavior.',
          1: 'Reverses cause and effect — doesn\'t test if alarm causes the behavior.',
          3: 'Tests sound type, not whether the alarm itself is the cue.',
        },
      },
      {
        id: 'lo-3',
        question: 'If MOST mountains have jagged peaks, and Stowe is a mountain in Vermont, then:',
        choices: [
          'Stowe is the only mountain in Vermont with a jagged peak',
          'All things with peaks are mountains',
          'Stowe is probably over 15,000 feet high',
          'Stowe probably has a jagged peak',
        ],
        answer: 3,
        explanation: 'MOST means "more than half." So PROBABLY is the right word. The facts don\'t guarantee Stowe has a jagged peak — but it probably does.',
        wrongExplanations: {
          0: 'The facts don\'t compare Stowe to other Vermont mountains.',
          1: 'Backwards. Mountains have peaks, but other things have peaks too (roofs, graphs).',
          2: 'The facts don\'t mention height.',
        },
      },
      {
        id: 'lo-4',
        question: 'All rectangles have four sides. All squares are rectangles. Therefore:',
        choices: [
          'All four-sided shapes are rectangles',
          'All squares have four sides',
          'All rectangles are squares',
          'Some rectangles have five sides',
        ],
        answer: 1,
        explanation: 'Squares ARE rectangles. Rectangles have 4 sides. So squares have 4 sides.',
        wrongExplanations: {
          0: 'Trapezoids have 4 sides but aren\'t rectangles.',
          2: 'Backwards. Squares are rectangles, but not every rectangle is a square.',
          3: 'The first fact says ALL rectangles have 4 sides — none have 5.',
        },
      },
      {
        id: 'lo-5',
        question: 'Maya found her plants grew faster when she played music. Which experiment BEST tests if music caused the faster growth?',
        choices: [
          'Play music for all her plants and measure growth',
          'Grow two identical groups — one with music, one without — and compare',
          'Ask other gardeners if they play music',
          'Play different music styles and see which plants look healthiest',
        ],
        answer: 1,
        explanation: 'Two groups, one variable changed = real experiment. With music vs. without music = clean comparison.',
        wrongExplanations: {
          0: 'No control group. Can\'t tell if music made the difference or something else.',
          2: 'Other people\'s habits aren\'t evidence.',
          3: 'Tests music STYLE, not whether music itself causes growth.',
        },
      },
      {
        id: 'lo-6',
        question: 'No reptiles have fur. All dogs have fur. Therefore:',
        choices: [
          'No dogs are reptiles',
          'All animals with fur are dogs',
          'Some reptiles are dogs',
          'All animals without fur are reptiles',
        ],
        answer: 0,
        explanation: 'Reptiles = no fur. Dogs = fur. So no dog can be a reptile (a dog has something a reptile can\'t have).',
        wrongExplanations: {
          1: 'Cats have fur and aren\'t dogs. The facts don\'t say all furry animals are dogs.',
          2: 'Reptiles have no fur. Dogs have fur. They can\'t overlap.',
          3: 'Frogs and fish have no fur and aren\'t reptiles. The fact only goes one way.',
        },
      },
      {
        id: 'lo-7',
        question: 'Liam thinks watering his plant causes it to grow taller. What would WEAKEN his conclusion?',
        choices: [
          'The plant also gets sunlight every day',
          'Other plants in the garden also grew',
          'Plants that weren\'t watered grew the same amount',
          'Liam uses a watering can',
        ],
        answer: 2,
        explanation: 'If unwatered plants grew JUST AS MUCH, then watering didn\'t cause the growth — something else did. That weakens the conclusion.',
        wrongExplanations: {
          0: 'Sunlight could also be helping, but doesn\'t prove watering ISN\'T helping.',
          1: 'Other plants growing doesn\'t affect Liam\'s plant.',
          3: 'How he waters doesn\'t matter — only whether the watering is what helps.',
        },
      },
      {
        id: 'lo-8',
        question: 'Some athletes are tall. All basketball players are athletes. Therefore:',
        choices: [
          'All basketball players are tall',
          'Some basketball players might be tall',
          'No basketball players are short',
          'All tall people are basketball players',
        ],
        answer: 1,
        explanation: 'SOME athletes are tall. Basketball players are athletes. So SOME might be tall, but we can\'t say ALL.',
        wrongExplanations: {
          0: 'The facts say SOME, not ALL. Basketball players are athletes, but only SOME of them might be tall.',
          2: 'The facts don\'t say anything about short athletes.',
          3: 'Backwards and too strong. Basketball players are athletes, not all tall people.',
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // VOCABULARY
  // ═══════════════════════════════════════════════════════════
  {
    id: 'single-blank',
    sectionId: 'vocab',
    name: 'Single-Blank Sentence Completion',
    icon: '📝',
    priority: 'critical',
    lesson: {
      title: 'How Single-Blank Vocabulary Works',
      sections: [
        {
          heading: 'You don\'t need to know every word',
          body: 'You need to USE THE SENTENCE\'S CLUES to figure out what kind of word fits the blank. Then match that meaning to the answer choices.',
        },
        {
          heading: 'The four-step move',
          body: '1. Read the WHOLE sentence first.\n2. Cover the answer choices. Make up your OWN word for the blank based on context.\n3. Then look at the choices and pick the one closest to your word.\n4. Plug the answer back in. Does it make the sentence make sense?',
          example: '"Brandon hides behind a tree to stay out of sight. He remains ______ so his sister doesn\'t see him move."\n\nYour word: "still" or "frozen."\nChoices: apparent, casual, nimble, stationary.\n→ "stationary" means "not moving." Match!',
        },
        {
          heading: 'Watch for SIGNAL WORDS in the sentence',
          body: '• ALTHOUGH, BUT, HOWEVER, UNLIKE, DESPITE → contrast (the blank means the OPPOSITE of something else in the sentence)\n• BECAUSE, SO, THEREFORE → cause/effect (the blank fits the result)\n• AND, ALSO → similar (the blank means the SAME as something else)',
          example: '"ALTHOUGH the evidence seemed strong, the detective was ______." \n→ "Although" = contrast. Strong evidence usually means BELIEVING. The contrast = NOT believing = SKEPTICAL.',
        },
        {
          heading: 'The trap',
          body: 'Wrong answers often LOOK like they fit but mean the opposite. If the sentence has "never" or "not," watch out — the right word might sound wrong at first. Always plug it back in.',
        },
      ],
    },
    warmups: [
      {
        id: 'sb-w1',
        question: 'After running a long race, Maya was very ______.',
        choices: ['hungry', 'tired', 'lucky', 'tall'],
        answer: 1,
        explanation: 'Running a long race makes you "tired." That\'s the most direct match.',
        wrongExplanations: {
          0: 'Hungry might be true too, but "tired" is the most direct effect of running far.',
          2: 'Lucky doesn\'t connect to running.',
          3: 'Running doesn\'t make you tall.',
        },
      },
      {
        id: 'sb-w2',
        question: 'The library was very ______, so everyone whispered.',
        choices: ['loud', 'quiet', 'crowded', 'cold'],
        answer: 1,
        explanation: 'Whispering means people are being quiet. The library being "quiet" causes the whispering.',
        wrongExplanations: {
          0: 'Opposite — if it were loud, people wouldn\'t need to whisper.',
          2: 'Crowded doesn\'t make people whisper specifically.',
          3: 'Cold doesn\'t cause whispering.',
        },
      },
      {
        id: 'sb-w3',
        question: 'ALTHOUGH the soup looked good, it tasted ______.',
        choices: ['delicious', 'terrible', 'hot', 'fast'],
        answer: 1,
        explanation: '"Although" is a contrast word. Looked good BUT tasted... opposite of good = terrible.',
        wrongExplanations: {
          0: 'No contrast — would make "although" wrong.',
          2: 'Hot doesn\'t contrast with "looked good."',
          3: '"Fast" isn\'t a taste.',
        },
      },
    ],
    questions: [
      {
        id: 'sb-1',
        question: 'Brandon hides behind a tree to escape his sister. He remains ______ so she doesn\'t see him move.',
        choices: ['apparent', 'casual', 'nimble', 'stationary'],
        answer: 3,
        explanation: '"Stationary" means not moving — exactly what hiding requires.',
        wrongExplanations: {
          0: '"Apparent" means visible — the OPPOSITE of hiding.',
          1: '"Casual" means relaxed — doesn\'t fit hiding.',
          2: '"Nimble" means quick — moving, opposite of holding still.',
        },
      },
      {
        id: 'sb-2',
        question: 'The explorers were ______ when they finally reached the summit after months of dangerous climbing.',
        choices: ['exhausted', 'elated', 'bewildered', 'reluctant'],
        answer: 1,
        explanation: '"Elated" means extremely happy — the right feeling after achieving a hard goal.',
        wrongExplanations: {
          0: 'Exhausted is true but doesn\'t capture the FEELING of success the sentence implies.',
          2: 'Bewildered means confused — they knew where they were.',
          3: 'Reluctant means unwilling — they made it.',
        },
      },
      {
        id: 'sb-3',
        question: 'The teacher asked students to ______ their essays before turning them in, checking for errors.',
        choices: ['compose', 'revise', 'distribute', 'illustrate'],
        answer: 1,
        explanation: '"Revise" means to review and correct — exactly what checking errors is.',
        wrongExplanations: {
          0: '"Compose" means write for the first time, not check.',
          2: '"Distribute" means hand out.',
          3: '"Illustrate" means add pictures.',
        },
      },
      {
        id: 'sb-4',
        question: 'Dr. Martin Luther King, Jr., an advocate of nonviolent protest, never ______ his belief in this form of resistance.',
        choices: ['conquered', 'acknowledged', 'abandoned', 'maintained'],
        answer: 2,
        explanation: '"Never abandoned" = always kept. The whole sentence says he stood by his belief.',
        wrongExplanations: {
          0: '"Conquered his belief" doesn\'t make sense.',
          1: '"Never acknowledged" would mean he never recognized his own belief — contradicts being an advocate.',
          3: 'Trap! "Never maintained" means he didn\'t keep it — opposite of what the sentence implies.',
        },
      },
      {
        id: 'sb-5',
        question: 'Although the detective found several clues, the mystery remained ______.',
        choices: ['resolved', 'unsolved', 'simple', 'visible'],
        answer: 1,
        explanation: '"Although" = contrast. Found clues BUT mystery still NOT solved.',
        wrongExplanations: {
          0: 'No contrast — opposite of what "although" sets up.',
          2: 'Doesn\'t fit the contrast.',
          3: '"Visible" doesn\'t describe a mystery.',
        },
      },
      {
        id: 'sb-6',
        question: 'The old bridge was ______ and could collapse at any moment.',
        choices: ['unstable', 'unusual', 'uncertain', 'uncomfortable'],
        answer: 0,
        explanation: '"Unstable" means likely to give way — fits "could collapse."',
        wrongExplanations: {
          1: '"Unusual" means uncommon — doesn\'t cause collapse.',
          2: '"Uncertain" means unknown — bridges aren\'t uncertain.',
          3: '"Uncomfortable" describes feelings, not bridges.',
        },
      },
      {
        id: 'sb-7',
        question: 'The ______ student always arrived early, finished homework on time, and studied for every test.',
        choices: ['rebellious', 'diligent', 'timid', 'creative'],
        answer: 1,
        explanation: '"Diligent" means hardworking and careful — exactly what early/on-time/studying describes.',
        wrongExplanations: {
          0: '"Rebellious" means defiant — opposite of doing schoolwork well.',
          2: '"Timid" means shy — not the same as hardworking.',
          3: '"Creative" doesn\'t match the listed behaviors.',
        },
      },
      {
        id: 'sb-8',
        question: 'The ______ between the two rival teams was obvious as they refused to shake hands.',
        choices: ['alliance', 'animosity', 'confusion', 'similarity'],
        answer: 1,
        explanation: '"Animosity" means hostility. Refusing to shake = hostile. Match.',
        wrongExplanations: {
          0: '"Alliance" means partnership — opposite of rival behavior.',
          2: '"Confusion" doesn\'t match refusing.',
          3: '"Similarity" doesn\'t cause refusing to shake hands.',
        },
      },
      {
        id: 'sb-9',
        question: 'The magician\'s trick was so ______ that even adults couldn\'t figure out how it was done.',
        choices: ['transparent', 'ingenious', 'familiar', 'simple'],
        answer: 1,
        explanation: '"Ingenious" means clever — a clever trick fools even adults.',
        wrongExplanations: {
          0: '"Transparent" means easy to see through — opposite.',
          2: '"Familiar" — adults would have figured it out if it was familiar.',
          3: '"Simple" — adults would solve a simple trick easily.',
        },
      },
      {
        id: 'sb-10',
        question: 'The ______ instructions made it impossible for anyone to assemble the furniture correctly.',
        choices: ['detailed', 'ambiguous', 'illustrated', 'simple'],
        answer: 1,
        explanation: '"Ambiguous" means unclear — unclear instructions cause assembly failure.',
        wrongExplanations: {
          0: '"Detailed" instructions would HELP, not make it impossible.',
          2: '"Illustrated" with pictures usually helps.',
          3: '"Simple" instructions would be easy to follow.',
        },
      },
    ],
  },

  {
    id: 'two-blank',
    sectionId: 'vocab',
    name: 'Two-Blank Sentence Completion',
    icon: '✏️',
    priority: 'high',
    lesson: {
      title: 'How Two-Blank Sentences Work',
      sections: [
        {
          heading: 'Why these are tricky',
          body: 'Two blanks means two chances to be wrong. If EITHER word doesn\'t fit, the whole answer is wrong. The good news: this also helps you eliminate fast. If one word in a pair clearly doesn\'t fit, cross out the whole pair.',
        },
        {
          heading: 'The move',
          body: '1. Read the whole sentence to get the meaning.\n2. Pick the EASIER blank first (whichever has more clues around it).\n3. Cross out any pair where THAT blank\'s word doesn\'t fit.\n4. Now check the second blank in the remaining pairs.',
          example: '"Bicyclists must remain ______ to ______ around obstacles."\n\nFirst blank — what should they remain? "Alert" or "attentive."\nCross out: amiable (friendly), composed (calm), resourceful (creative). All wrong for "remain ___."\nLeft with: attentive ... maneuver. Check the second word — "maneuver" means steer carefully. ✓',
        },
        {
          heading: 'Watch for signal words connecting the blanks',
          body: 'Words like ALTHOUGH, BUT, BECAUSE, SO, AND tell you whether the two blanks should mean SIMILAR things or OPPOSITE things.\n\n"Although the evidence seemed [strong], the detective remained [skeptical]." → ALTHOUGH = contrast → opposite ideas.',
        },
      ],
    },
    warmups: [
      {
        id: 'tb-w1',
        question: 'The day was ______, so Maya wore a ______.',
        choices: ['cold ... swimsuit', 'hot ... coat', 'cold ... coat', 'rainy ... bathing suit'],
        answer: 2,
        explanation: 'Cold day → wear a coat. Both words fit together.',
        wrongExplanations: {
          0: 'Cold day + swimsuit doesn\'t fit.',
          1: 'Hot day + coat doesn\'t fit.',
          3: 'Rainy day + bathing suit doesn\'t fit.',
        },
      },
      {
        id: 'tb-w2',
        question: 'Sam was ______ to win the contest, so he practiced ______.',
        choices: ['determined ... daily', 'sad ... loudly', 'tired ... never', 'quick ... slowly'],
        answer: 0,
        explanation: 'Wanting to win + practicing daily = makes sense. Both words fit.',
        wrongExplanations: {
          1: 'Sad people don\'t practice loudly to win.',
          2: 'Tired and never don\'t fit "wanted to win."',
          3: 'Quick and slowly contradict each other.',
        },
      },
      {
        id: 'tb-w3',
        question: 'ALTHOUGH the team played ______, they ______ the game.',
        choices: ['well ... won', 'badly ... won', 'badly ... lost', 'well ... cheered'],
        answer: 1,
        explanation: '"Although" = contrast. Played BADLY but still WON. The contrast makes it work.',
        wrongExplanations: {
          0: 'Played well + won = no contrast. "Although" wouldn\'t fit.',
          2: 'Played badly + lost = no contrast. Expected.',
          3: '"Cheered" isn\'t opposite of "well" — no contrast.',
        },
      },
    ],
    questions: [
      {
        id: 'tb-1',
        question: 'Bicyclists must remain ______ to ______ around obstacles.',
        choices: [
          'amiable ... navigate',
          'composed ... ascend',
          'attentive ... maneuver',
          'resourceful ... journey',
        ],
        answer: 2,
        explanation: '"Attentive" (paying attention) + "maneuver" (steer carefully) — both fit perfectly for safe biking.',
        wrongExplanations: {
          0: '"Amiable" (friendly) doesn\'t describe biking safely.',
          1: '"Ascend" means go up, not navigate around.',
          3: '"Journey" doesn\'t fit "around obstacles."',
        },
      },
      {
        id: 'tb-2',
        question: 'Although the evidence seemed ______, the detective remained ______ and continued investigating.',
        choices: [
          'overwhelming ... skeptical',
          'weak ... confident',
          'conclusive ... satisfied',
          'hidden ... frustrated',
        ],
        answer: 0,
        explanation: '"Although" = contrast. Evidence looked strong (overwhelming), but the detective DIDN\'T believe it (skeptical). Contrast makes the sentence work.',
        wrongExplanations: {
          1: 'Weak evidence + confident continuing wouldn\'t need "although."',
          2: 'Conclusive + satisfied = no need to continue investigating. Contradicts the sentence.',
          3: '"Hidden" evidence isn\'t something to be skeptical about — you can\'t be skeptical of evidence you don\'t see.',
        },
      },
      {
        id: 'tb-3',
        question: 'The chef tried to ______ the soup by adding spices, but the result was even more ______.',
        choices: [
          'improve ... bland',
          'ruin ... delicious',
          'enhance ... flavorful',
          'reduce ... tasty',
        ],
        answer: 0,
        explanation: '"But" = contrast. Tried to IMPROVE, but it stayed BLAND (no flavor). The "but" sets up the failure.',
        wrongExplanations: {
          1: 'Trying to ruin and getting delicious has wrong cause/effect.',
          2: 'Enhance + flavorful = success, no contrast needed.',
          3: '"Reduce" the soup to tasty doesn\'t fit "added spices."',
        },
      },
      {
        id: 'tb-4',
        question: 'The students were ______ when the teacher announced the test would be ______ until next week.',
        choices: [
          'angry ... immediate',
          'relieved ... postponed',
          'confused ... given',
          'sad ... cancelled',
        ],
        answer: 1,
        explanation: 'Test moved to next week = postponed. Students would be relieved (less stress now).',
        wrongExplanations: {
          0: '"Immediate" contradicts "until next week."',
          2: '"Confused" + "given" doesn\'t fit a delay announcement.',
          3: '"Sad" + "cancelled" — usually students would be HAPPY about cancellation, not sad.',
        },
      },
      {
        id: 'tb-5',
        question: 'The ancient ruins were ______ by tourists and ______ by archaeologists who studied them carefully.',
        choices: [
          'visited ... preserved',
          'destroyed ... ignored',
          'avoided ... built',
          'photographed ... destroyed',
        ],
        answer: 0,
        explanation: 'Tourists VISIT ruins. Archaeologists PRESERVE them (study + protect). Both fit.',
        wrongExplanations: {
          1: 'Archaeologists don\'t ignore ruins — that\'s their job.',
          2: 'Archaeologists don\'t BUILD ancient ruins — that\'s a contradiction in time.',
          3: 'Archaeologists don\'t destroy ruins — they preserve them.',
        },
      },
      {
        id: 'tb-6',
        question: 'The path through the forest was so ______ that the hikers needed a guide to ______ them.',
        choices: [
          'clear ... block',
          'confusing ... lead',
          'straight ... lose',
          'short ... follow',
        ],
        answer: 1,
        explanation: 'Confusing path = need someone to lead/guide. Both fit.',
        wrongExplanations: {
          0: 'Clear path + block = contradiction.',
          2: 'Straight path doesn\'t need a guide. "Lose" doesn\'t make sense.',
          3: 'Short path with a guide who follows them is backwards.',
        },
      },
      {
        id: 'tb-7',
        question: 'Despite the ______ weather, the soccer game was ______ and finished on schedule.',
        choices: [
          'perfect ... cancelled',
          'mild ... delayed',
          'severe ... played',
          'sunny ... postponed',
        ],
        answer: 2,
        explanation: '"Despite" = contrast. Severe (bad) weather BUT they played anyway. Contrast works.',
        wrongExplanations: {
          0: 'Perfect weather + cancelled wouldn\'t need "despite."',
          1: 'Mild weather + delayed isn\'t a strong contrast.',
          3: '"Despite sunny weather... postponed" = no contrast.',
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // READING COMPREHENSION
  // ═══════════════════════════════════════════════════════════
  {
    id: 'main-idea',
    sectionId: 'reading',
    name: 'Reading: Main Idea',
    icon: '🎯',
    priority: 'high',
    lesson: {
      title: 'How Main Idea Questions Work',
      sections: [
        {
          heading: 'What "main idea" means',
          body: 'The main idea is what the WHOLE passage is about — not just one paragraph, not just one sentence. It\'s the BIG point the author is making.',
        },
        {
          heading: 'Where to find it',
          body: 'Look at the FIRST sentence of each paragraph and the LAST sentence of the whole passage. Authors usually state the main idea up front or wrap it up at the end. The middle has the supporting details.',
        },
        {
          heading: 'The trap to watch for',
          body: 'Wrong answers usually fall into one of these:\n• TOO NARROW — only covers ONE detail (true, but only part of the passage)\n• TOO BROAD — covers more than the passage actually says\n• OFF-TOPIC — sounds related but the passage didn\'t say it\n\nThe right answer covers the WHOLE passage, no more, no less.',
          example: 'A passage compares Earth and Jupiter.\n• "Earth has water" — TOO NARROW (one detail).\n• "All planets are different" — TOO BROAD (the passage was just about two).\n• "Earth and Jupiter have very different physical properties" — JUST RIGHT.',
        },
        {
          heading: 'The move',
          body: 'After reading: Ask yourself "What would I tell my friend this passage was about, in ONE sentence?" Your sentence is the main idea. Match it to the answer choices.',
        },
      ],
    },
    passages: [
      {
        id: 'mi-p1',
        title: 'The Planets',
        text: `Our solar system contains eight planets, each with unique characteristics. The four inner planets — Mercury, Venus, Earth, and Mars — are called terrestrial planets because they have solid, rocky surfaces. The four outer planets — Jupiter, Saturn, Uranus, and Neptune — are called gas giants because they are made mostly of gases like hydrogen and helium.

Earth and Jupiter could hardly be more different. Earth has a solid surface where people can walk, liquid water in its oceans, and an atmosphere that supports life. Jupiter, on the other hand, has no solid surface at all. It is a swirling mass of gases with storms larger than our entire planet.

Despite these differences, both planets share some similarities. Both have magnetic fields that protect them from harmful solar radiation. Both have moons — Earth has one, while Jupiter has at least 95. And both orbit the same star, following the invisible pull of the Sun's gravity.`,
        questions: [
          {
            id: 'mi-1',
            question: 'What is the main idea of paragraph 2?',
            choices: [
              'Earth has a solid surface and liquid water',
              'Jupiter has more gravity than Earth',
              'Jupiter is more interesting to study than Earth',
              'Earth and Jupiter have very different physical properties',
            ],
            answer: 3,
            explanation: 'Paragraph 2 lists differences between Earth and Jupiter — solid vs. gas, water vs. no water, etc. The big point is "they\'re very different."',
            wrongExplanations: {
              0: 'TOO NARROW — only one detail from the paragraph.',
              1: 'OFF-TOPIC — the passage doesn\'t mention gravity comparisons.',
              2: 'OFF-TOPIC — the passage gives facts, not opinions about which is "more interesting."',
            },
          },
          {
            id: 'mi-2',
            question: 'What is the main organizational pattern of the whole passage?',
            choices: [
              'A list of every planet in detail',
              'Comparing and contrasting two planets',
              'Why Earth is the best planet',
              'How planets were formed',
            ],
            answer: 1,
            explanation: 'The passage groups inner/outer planets, then compares Earth and Jupiter directly — both differences and similarities. That\'s comparing and contrasting.',
            wrongExplanations: {
              0: 'TOO BROAD — only Earth and Jupiter are described in detail.',
              2: 'OFF-TOPIC — passage doesn\'t rank planets.',
              3: 'OFF-TOPIC — passage doesn\'t describe how planets formed.',
            },
          },
        ],
      },
      {
        id: 'mi-p2',
        title: 'Pointillism',
        text: `In 1886, a young French painter named Georges Seurat shocked the art world with a new technique he called Pointillism. Instead of blending colors on his palette like other artists, Seurat placed tiny dots of pure color side by side on the canvas. When viewed from a distance, the viewer's eye would blend these dots together, creating the illusion of mixed colors that seemed to shimmer and glow.

Not everyone appreciated this approach. Many art critics dismissed Pointillism as mechanical and tedious. They argued that spending months placing individual dots removed the emotion and spontaneity from painting.

Despite the criticism, Seurat's work influenced generations of artists who came after him. His ideas about color theory became foundational in art education. Today, his paintings hang in the world's greatest museums.`,
        questions: [
          {
            id: 'mi-3',
            question: 'Which sentence BEST states the main idea of the passage?',
            choices: [
              'Seurat lived in France in the 1800s',
              'Critics didn\'t like Pointillism',
              'Pointillism was a controversial technique that became influential',
              'All paintings should be made of dots',
            ],
            answer: 2,
            explanation: 'The passage covers BOTH the criticism AND the influence — that combination IS the main idea.',
            wrongExplanations: {
              0: 'TOO NARROW — just one detail.',
              1: 'TOO NARROW — only covers paragraph 2, not the whole passage.',
              3: 'OFF-TOPIC — the author isn\'t making rules for painters.',
            },
          },
          {
            id: 'mi-4',
            question: 'According to the passage, what do Earth and Jupiter have in common?',
            choices: [
              'Both have solid surfaces',
              'Both have magnetic fields',
              'Both have liquid water',
              'Both are terrestrial planets',
            ],
            answer: 1,
            explanation: 'Wait — this question is from a different passage. (You\'ll see this on the real test: re-read carefully.) The Planets passage says "Both have magnetic fields." Watch for which passage a question is asking about.',
            wrongExplanations: {
              0: 'Earth has a solid surface; Jupiter does not.',
              2: 'Earth has water; Jupiter does not.',
              3: 'Earth is terrestrial; Jupiter is a gas giant.',
            },
          },
        ],
      },
    ],
  },

  {
    id: 'inference',
    sectionId: 'reading',
    name: 'Reading: Inference',
    icon: '🔍',
    priority: 'critical',
    lesson: {
      title: 'How Inference Questions Work',
      sections: [
        {
          heading: 'Inference = reading between the lines',
          body: 'The passage doesn\'t SAY the answer directly. You have to figure it out from clues. But here\'s the key: the answer must still be SUPPORTED by what the passage says — not by what you already know.',
        },
        {
          heading: 'Signal words for inference questions',
          body: '• "Most likely"\n• "Probably"\n• "Implies" / "suggests"\n• "Based on the passage, what would..."\n• "What can you conclude..."\n\nWhen you see these, the passage isn\'t going to spell it out.',
        },
        {
          heading: 'The move',
          body: 'For each answer choice, ask: "Where in the passage is the EVIDENCE for this?" If you can point to a sentence or two that hints at it, that\'s the right answer. If you have to use outside knowledge or guess, it\'s wrong.',
          example: 'Passage: "The narrator paused before speaking, her hands trembling."\nQ: How does the narrator probably feel?\n→ Trembling hands + pausing = nervous. EVIDENCE in the passage. ✓\n\nWrong: "She is angry." (No evidence — angry people don\'t tremble before speaking carefully.)',
        },
        {
          heading: 'The big trap',
          body: 'Wrong answers often go TOO FAR. The passage might suggest a character is upset, but a wrong answer might say they\'re "furious" or "want revenge." Stick close to what the clues actually support — don\'t over-read.',
        },
      ],
    },
    passages: [
      {
        id: 'in-p1',
        title: 'Underground Railroad',
        text: `The Underground Railroad was neither underground nor a railroad. It was a secret network of routes, safe houses, and brave people who helped enslaved African Americans escape to freedom in the Northern states and Canada before the Civil War.

Harriet Tubman is the most famous conductor of the Underground Railroad. After escaping slavery herself in 1849, she returned to the South at least 13 times to lead approximately 70 people to freedom. She traveled at night, following the North Star, and used songs with hidden messages to communicate with those she was helping. Despite a $40,000 reward for her capture — an enormous sum at the time — she was never caught and never lost a single passenger.

The journey was extremely dangerous. Escapees traveled through swamps, forests, and fields, often walking 10 to 20 miles between stations. They faced slave catchers with dogs, freezing temperatures, and the constant threat of betrayal.`,
        questions: [
          {
            id: 'in-1',
            question: 'What can you INFER about why Tubman traveled at night?',
            choices: [
              'She preferred cooler temperatures',
              'It was harder for slave catchers to spot escapees in darkness',
              'The North Star was only visible at night, and she used it to navigate',
              'Both B and C are likely reasons',
            ],
            answer: 3,
            explanation: 'The passage says she "followed the North Star" (only visible at night) AND traveled at night when there\'s a "$40,000 reward" (she\'d want to hide). Both clues support both reasons.',
            wrongExplanations: {
              0: 'No evidence in the passage about temperature preferences.',
              1: 'True, but B is incomplete — C is also supported by the passage.',
              2: 'True, but B is also supported by the passage.',
            },
          },
          {
            id: 'in-2',
            question: 'What does the phrase "never lost a single passenger" suggest about Tubman?',
            choices: [
              'She only helped small groups of people',
              'She was exceptionally skilled and careful',
              'The journey wasn\'t actually very dangerous',
              'Slave catchers weren\'t really searching for her',
            ],
            answer: 1,
            explanation: 'Given the dangers (dogs, $40,000 reward, freezing temps), never losing anyone shows EXCEPTIONAL skill — that\'s the inference the evidence supports.',
            wrongExplanations: {
              0: 'No evidence about group size — passage says ~70 total people.',
              2: 'Goes against the passage, which describes the journey as "extremely dangerous."',
              3: 'Goes against the $40,000 reward fact — they were definitely searching.',
            },
          },
        ],
      },
      {
        id: 'in-p2',
        title: 'Monarch Migration',
        text: `Every fall, millions of monarch butterflies travel up to 3,000 miles from their summer homes in the United States and Canada to their winter roosts in central Mexico.

What makes this migration extraordinary is that no single butterfly completes the round trip. The monarchs that fly south in autumn are the great-great-grandchildren of the ones that flew north the previous spring. Yet somehow, they find their way to the exact same trees their ancestors used.

Scientists have discovered that monarchs navigate using a combination of the sun's position and the Earth's magnetic field. They have an internal compass built into their antennae that senses magnetic direction.

The monarch migration is now under threat. Logging in Mexico's forests has destroyed some of their roosts. Herbicides used on farms in the United States have killed milkweed — the only plant where monarchs lay their eggs.`,
        questions: [
          {
            id: 'in-3',
            question: 'Based on the passage, what would MOST LIKELY happen if a monarch\'s antennae were damaged?',
            choices: [
              'It would fly faster to make up for lost time',
              'It would have difficulty navigating to Mexico',
              'It would stop migrating and stay in one place',
              'It would use sound to navigate',
            ],
            answer: 1,
            explanation: 'The passage says antennae contain the "internal compass" for direction. Damage = navigation problems. Direct evidence.',
            wrongExplanations: {
              0: 'No evidence about flying faster — the issue is direction, not speed.',
              2: 'Goes too far — passage doesn\'t suggest they\'d stop trying.',
              3: 'No mention of sound navigation in the passage.',
            },
          },
          {
            id: 'in-4',
            question: 'What can you infer about the threat to the monarch migration?',
            choices: [
              'Monarchs will go extinct within ten years',
              'Both their winter homes and breeding plants are at risk',
              'Mexico is responsible for the population decline',
              'Butterflies will adapt and find new plants',
            ],
            answer: 1,
            explanation: 'Passage describes BOTH logging in Mexico (winter roosts) AND herbicide killing milkweed (where they lay eggs). Both threats together = both phases of life are at risk.',
            wrongExplanations: {
              0: 'TOO FAR — no timeline given. Don\'t add facts the passage doesn\'t support.',
              2: 'TOO FAR — passage shares blame between logging AND U.S. herbicides.',
              3: 'OPPOSITE — passage says milkweed is "the only plant" they lay eggs on.',
            },
          },
        ],
      },
    ],
  },

  {
    id: 'authors-purpose',
    sectionId: 'reading',
    name: "Reading: Author's Purpose",
    icon: '✒️',
    priority: 'high',
    lesson: {
      title: "How Author's Purpose Questions Work",
      sections: [
        {
          heading: 'The four reasons authors write',
          body: 'Almost every "author\'s purpose" answer falls into one of four buckets:\n• TO INFORM — explain a topic, give facts (like a science article)\n• TO PERSUADE — convince you to do or believe something\n• TO ENTERTAIN — tell a story, make you laugh, hold your interest\n• TO DESCRIBE — paint a picture in your mind\n\nFigure out the bucket first. Then pick the answer that matches.',
        },
        {
          heading: 'Tone clues',
          body: 'How does the passage SOUND?\n• Lots of facts, dates, scientific words = INFORM\n• "We should..." or "you should..." = PERSUADE\n• Characters, dialogue, story = ENTERTAIN\n• Lots of adjectives, "felt like," "looked like" = DESCRIBE',
        },
        {
          heading: 'The trap',
          body: 'Wrong answers are often TOO STRONG. A passage about whales might mention conservation in one paragraph — but if 90% is facts about whales, the purpose is INFORM, not PERSUADE.\n\nLook at the BULK of the passage, not one sentence.',
        },
        {
          heading: 'Cause and effect / fact vs. opinion',
          body: 'Sometimes purpose questions check if you can spot:\n• An OPINION (judgment, "I think," "best") vs. a FACT (provable)\n• A CAUSE leading to an EFFECT\n\nFor opinions: words like "best," "more interesting," "should" usually = opinion. Anything you can check in a book = fact.',
        },
      ],
    },
    passages: [
      {
        id: 'ap-p1',
        title: 'Monarch Conservation',
        text: `Every fall, millions of monarch butterflies begin one of the most remarkable journeys in the natural world. These delicate insects travel up to 3,000 miles from their summer homes to their winter roosts in central Mexico.

Scientists have discovered that monarchs navigate using the sun's position and the Earth's magnetic field. They have an internal compass built into their antennae.

The monarch migration is now under threat. Logging in Mexico's forests has destroyed some of their roosts. Herbicides used on farms have killed milkweed — the only plant where monarchs lay their eggs. Conservation groups are working to protect the forests and encourage people to plant milkweed in their gardens.`,
        questions: [
          {
            id: 'ap-1',
            question: "What is the author's main purpose in writing this passage?",
            choices: [
              'To persuade readers to plant milkweed gardens',
              'To inform readers about monarch migration and the threats to it',
              'To entertain readers with a story about butterflies',
              'To argue that logging should be banned in Mexico',
            ],
            answer: 1,
            explanation: 'The passage is mostly FACTS about migration, navigation, and threats. Conservation is mentioned at the end but isn\'t the main purpose. Bulk of passage = INFORM.',
            wrongExplanations: {
              0: 'TOO STRONG — milkweed is mentioned briefly. Most of the passage is facts, not persuasion.',
              2: 'No story, no characters — this is informational, not entertainment.',
              3: 'TOO STRONG — the passage mentions logging as one threat among several. Not arguing for a ban.',
            },
          },
          {
            id: 'ap-2',
            question: 'Which of the following is an OPINION, not a fact?',
            choices: [
              'Monarchs travel up to 3,000 miles',
              'Monarchs are the most beautiful butterflies in the world',
              'Herbicides have killed milkweed',
              'Monarchs use the sun to navigate',
            ],
            answer: 1,
            explanation: '"Most beautiful" is a judgment — can\'t be proved or disproved. The other choices are facts you can verify.',
            wrongExplanations: {
              0: 'Fact — measurable distance.',
              2: 'Fact — provable through evidence.',
              3: 'Fact — verified by scientists.',
            },
          },
        ],
      },
      {
        id: 'ap-p2',
        title: 'School Uniforms',
        text: `Many schools across the country are now requiring students to wear uniforms. This trend is one of the most positive changes in education today, and every school should consider adopting it.

Uniforms reduce bullying based on clothing brands. When everyone wears the same outfit, students stop competing about whose family can afford the latest fashions.

Uniforms also save families money. Parents no longer need to buy a closet full of trendy clothes. A few uniform sets can last all year.

Most importantly, uniforms help students focus on learning. Without worrying about how they look, students can put their energy into schoolwork. Schools should embrace this simple change that makes such a big difference.`,
        questions: [
          {
            id: 'ap-3',
            question: "What is the author's main purpose in writing this passage?",
            choices: [
              'To inform readers about school dress codes',
              'To entertain readers with stories about school',
              'To persuade readers that schools should require uniforms',
              'To describe what school uniforms look like',
            ],
            answer: 2,
            explanation: 'Words like "every school should consider," "Schools should embrace," and the whole structure of giving reasons = PERSUADE.',
            wrongExplanations: {
              0: 'INFORM would be neutral. This passage takes a side.',
              1: 'No story, no characters.',
              3: 'No description of what they look like.',
            },
          },
          {
            id: 'ap-4',
            question: 'Which sentence from the passage is OPINION, not fact?',
            choices: [
              'A few uniform sets can last all year',
              'Uniforms reduce bullying based on clothing brands',
              'This trend is one of the most positive changes in education today',
              'Many schools across the country are requiring uniforms',
            ],
            answer: 2,
            explanation: '"Most positive change" is a judgment. You can\'t prove it. The others can be checked.',
            wrongExplanations: {
              0: 'Fact — verifiable.',
              1: 'Fact — can be measured in schools.',
              3: 'Fact — countable.',
            },
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // WRITING MECHANICS
  // ═══════════════════════════════════════════════════════════
  {
    id: 'grammar-usage',
    sectionId: 'writing-mechanics',
    name: 'Grammar & Usage',
    icon: '📐',
    priority: 'high',
    lesson: {
      title: 'How Grammar & Usage Questions Work',
      sections: [
        {
          heading: 'The big four traps',
          body: 'On the ERB, most usage errors fall into four categories:\n1. WRONG PRONOUN (he/she/it/they vs. him/her/them; I vs. me)\n2. SUBJECT-VERB DISAGREEMENT (singular vs. plural)\n3. WRONG TENSE (past vs. present)\n4. RUN-ONS or COMMA SPLICES (two complete sentences glued together wrong)',
        },
        {
          heading: 'Pronoun trick: drop the other person',
          body: '"Sarah and I/me went to the store."\n→ Drop "Sarah and": "I went to the store" ✓ → use I.\n\n"He gave the book to Sarah and I/me."\n→ Drop "Sarah and": "He gave the book to me" ✓ → use me.\n\nWhen in doubt, take the other person OUT and listen to what sounds right.',
        },
        {
          heading: 'Subject-verb trick: ignore the middle words',
          body: '"Each of the girls (have / has) her own locker."\n→ Subject is EACH (singular). Ignore "of the girls."\n→ Each... HAS. ✓',
        },
        {
          heading: 'Run-on trick: can each part stand alone?',
          body: 'A run-on glues two complete sentences with just a comma. Test: split at the comma. If both halves are complete sentences, the comma alone isn\'t enough — you need a period, semicolon, or "and/but/because."\n\n"I helped my teacher, I had a cold." → Both complete. Run-on.\nFix: "I helped my teacher because I had a cold."',
        },
      ],
    },
    warmups: [
      {
        id: 'gu-w1',
        question: 'Sarah and ______ went to the movies.',
        choices: ['me', 'I', 'myself', 'her'],
        answer: 1,
        explanation: 'Drop "Sarah and": "I went to the movies." ✓ Use "I" because it\'s the subject doing the action.',
        wrongExplanations: {
          0: '"Me went" — sounds wrong. "Me" is for objects, not subjects.',
          2: '"Myself" only works as "I myself" or after another subject pronoun.',
          3: 'Wrong gender/role for the subject of the sentence.',
        },
      },
      {
        id: 'gu-w2',
        question: 'Each student ______ a pencil.',
        choices: ['need', 'needs', 'are needing', 'were needing'],
        answer: 1,
        explanation: '"Each" is singular. Singular subject + singular verb = "needs." Don\'t be tricked by "student" feeling like a group.',
        wrongExplanations: {
          0: '"Each... need" doesn\'t agree. "Each" requires "needs."',
          2: '"Are" is plural. "Each" is singular.',
          3: '"Were" is plural past tense. "Each" is singular.',
        },
      },
      {
        id: 'gu-w3',
        question: 'Which is a run-on (two sentences glued together with just a comma)?',
        choices: [
          'I love pizza, my brother loves tacos.',
          'I love pizza, but my brother loves tacos.',
          'I love pizza when it has cheese.',
          'When I eat pizza, I am happy.',
        ],
        answer: 0,
        explanation: '"I love pizza" + "my brother loves tacos" = two complete sentences. A comma alone isn\'t enough. Need "but" or a period.',
        wrongExplanations: {
          1: 'Has "but" — that connects two complete sentences correctly.',
          2: 'Only one complete sentence — "when it has cheese" is a fragment that needs the rest.',
          3: 'Only one complete sentence — "when I eat pizza" is a fragment.',
        },
      },
    ],
    questions: [
      {
        id: 'gu-1',
        question: 'Christopher went to the store and bought a book using ______ own pocket money.',
        choices: ['your', 'their', 'its', 'his'],
        answer: 3,
        explanation: 'The pronoun must match Christopher (one male). "His" = singular masculine. ✓',
        wrongExplanations: {
          0: '"Your" addresses the reader, not Christopher.',
          1: '"Their" is plural — Christopher is one person.',
          2: '"Its" is for things, not people.',
        },
      },
      {
        id: 'gu-2',
        question: 'Which sentence is a RUN-ON (two complete sentences glued together with just a comma)?',
        choices: [
          'When I found my missing dog, I was so happy.',
          'To make my dad proud, I cleaned my room.',
          'My head hurt and I was tired, but I studied anyway.',
          'I helped my teacher put away chairs because I couldn\'t go to recess, I had a cold.',
        ],
        answer: 3,
        explanation: '"I helped my teacher... recess" is one complete sentence. "I had a cold" is another complete sentence. A comma alone can\'t join them. (Need a period or "because.")',
        wrongExplanations: {
          0: 'Starts with "When..." — not two complete sentences.',
          1: 'Starts with "To make..." — only one complete sentence.',
          2: 'Has "but" connecting the parts — that\'s allowed.',
        },
      },
      {
        id: 'gu-3',
        question: 'Each of the girls ______ her own locker.',
        choices: ['have', 'has', 'are having', 'were having'],
        answer: 1,
        explanation: '"Each" is singular even though "of the girls" is plural. Singular + has. ✓',
        wrongExplanations: {
          0: '"Have" is plural. "Each" requires singular.',
          2: '"Are" is plural.',
          3: '"Were" is plural past tense.',
        },
      },
      {
        id: 'gu-4',
        question: 'Neither the teacher ______ the students were ready for the fire drill.',
        choices: ['or', 'and', 'nor', 'but'],
        answer: 2,
        explanation: '"Neither... nor" always go together. "Neither... or" is wrong.',
        wrongExplanations: {
          0: '"Neither... or" is grammatically incorrect.',
          1: '"And" doesn\'t pair with "neither."',
          3: '"But" doesn\'t pair with "neither."',
        },
      },
      {
        id: 'gu-5',
        question: 'The dog ran ______ than the cat.',
        choices: ['more faster', 'fastest', 'faster', 'most fast'],
        answer: 2,
        explanation: 'Comparing TWO things = "faster" (comparative). Three or more = "fastest" (superlative).',
        wrongExplanations: {
          0: '"More faster" is a double comparative — only one allowed.',
          1: '"Fastest" is for 3+ things, not just two.',
          3: '"Most fast" is also a double — never use "more" or "most" with "-er/-est" forms.',
        },
      },
      {
        id: 'gu-6',
        question: 'Between you and ______, I think the test will be easy.',
        choices: ['I', 'me', 'myself', 'we'],
        answer: 1,
        explanation: '"Between" is a preposition. After prepositions, use object pronouns: "me," not "I."',
        wrongExplanations: {
          0: '"Between you and I" sounds fancy but is grammatically wrong.',
          2: '"Myself" doesn\'t fit here.',
          3: '"We" is for groups doing actions, not after "between."',
        },
      },
      {
        id: 'gu-7',
        question: 'The team ______ their best to win the championship.',
        choices: ['did', 'done', 'does', 'doing'],
        answer: 0,
        explanation: 'Past tense of "do" = "did." Match the past meaning of the sentence.',
        wrongExplanations: {
          0: 'N/A',
          1: '"Done" needs a helper verb ("had done"). Can\'t stand alone.',
          2: '"Does" is present tense — wrong time.',
          3: '"Doing" is a participle — needs a helper.',
        },
      },
      {
        id: 'gu-8',
        question: 'The children were eating lunch in their backyard ______ it began to rain.',
        choices: ['so', 'because', 'soon', 'when'],
        answer: 3,
        explanation: '"When" sets up the time relationship — they were eating, then it rained.',
        wrongExplanations: {
          0: '"So" means "as a result" — eating doesn\'t cause rain.',
          1: '"Because" means rain caused them to eat — backwards.',
          2: '"Soon" needs to be followed by another phrase, not a complete clause.',
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // WRITING CONCEPTS
  // ═══════════════════════════════════════════════════════════
  {
    id: 'topic-supporting',
    sectionId: 'writing-concepts',
    name: 'Topic Sentence & Supporting Detail',
    icon: '🏛️',
    priority: 'high',
    lesson: {
      title: 'How Topic Sentences and Supporting Details Work',
      sections: [
        {
          heading: 'The structure',
          body: 'A good paragraph has a TOPIC SENTENCE (what the paragraph is about) followed by SUPPORTING DETAILS (sentences that prove or explain it). Some questions ask you to pick the best topic sentence; some ask which detail fits.',
        },
        {
          heading: 'What makes a good topic sentence',
          body: 'A topic sentence is:\n• SPECIFIC enough to make a claim\n• BROAD enough to cover the whole paragraph\n• PREVIEWS what the supporting details will discuss\n\nBAD: "I like pizza." (too narrow, no preview)\nBAD: "Food is important." (too broad)\nGOOD: "Pizza is the perfect meal because it\'s tasty, customizable, and easy to share."',
        },
        {
          heading: 'What makes a good supporting detail',
          body: 'A supporting detail must:\n• DIRECTLY prove or explain the topic sentence\n• Be RELEVANT (not off-topic)\n• Be SPECIFIC (a fact, number, example — not a vague claim)\n\nIf the topic is "exercise has benefits," good details = strengthens muscles, improves heart, reduces stress. Bad detail = "Some people don\'t like exercise."',
        },
        {
          heading: 'The trap',
          body: 'Wrong answers often use words from the paragraph but don\'t actually fit. They\'re ON TOPIC but not on POINT. Always ask: does this sentence DIRECTLY prove the main idea?',
        },
      ],
    },
    warmups: [
      {
        id: 'ts-w1',
        question: 'Topic: "Dogs make great pets." Which is the BEST supporting detail?',
        choices: [
          'Dogs are animals.',
          'My friend has a goldfish.',
          'Dogs are loyal and provide companionship.',
          'Some dogs eat strange things.',
        ],
        answer: 2,
        explanation: 'Loyal + companionship directly support "great pets." Specific qualities tied to the claim.',
        wrongExplanations: {
          0: 'Too obvious — doesn\'t support the claim that they\'re GREAT pets.',
          1: 'Off-topic — about a goldfish.',
          3: 'Hurts the claim, doesn\'t support it.',
        },
      },
      {
        id: 'ts-w2',
        question: 'Which is the BEST topic sentence for a paragraph about why students should read more?',
        choices: [
          'Books are interesting.',
          'I read every night.',
          'Reading regularly improves vocabulary, focus, and creativity.',
          'There are many books in the library.',
        ],
        answer: 2,
        explanation: 'States the claim AND previews three specific reasons the paragraph will explain.',
        wrongExplanations: {
          0: 'Too vague — what does "interesting" mean here?',
          1: 'Personal anecdote, not a claim.',
          3: 'Off-topic — about libraries, not benefits.',
        },
      },
      {
        id: 'ts-w3',
        question: 'Read this paragraph: "Brushing your teeth daily prevents cavities. ____. It also keeps your breath fresh." Which sentence fits the blank BEST?',
        choices: [
          'Toothbrushes come in many colors.',
          'It also strengthens gums and prevents tooth decay.',
          'My dentist is very nice.',
          'Some people forget to brush.',
        ],
        answer: 1,
        explanation: 'The paragraph lists BENEFITS of brushing. "Strengthens gums" is another benefit. Pattern fits.',
        wrongExplanations: {
          0: 'Off-topic — toothbrush colors aren\'t a benefit.',
          2: 'Off-topic — about a dentist, not brushing.',
          3: 'Hurts the topic — about people NOT brushing.',
        },
      },
    ],
    questions: [
      {
        id: 'ts-1',
        question: 'Main idea: "Elizabeth Blackwell was the first woman to become a medical doctor in the United States." Which sentence BEST supports this idea?',
        choices: [
          'Blackwell moved to America in 1832.',
          'Blackwell lost her sight in one eye.',
          'Blackwell graduated from Geneva Medical College in New York in 1849.',
          'Blackwell was born in Bristol, England in 1821.',
        ],
        answer: 2,
        explanation: 'Graduating from medical college DIRECTLY supports the claim of becoming a doctor. The others are biographical but don\'t prove the "first woman doctor" claim.',
        wrongExplanations: {
          0: 'Background detail, doesn\'t support being a doctor.',
          1: 'Personal detail, off-topic for the claim.',
          3: 'Background detail, off-topic for the claim.',
        },
      },
      {
        id: 'ts-2',
        question: 'Read this paragraph:\n"The Amazon rainforest is home to an incredible variety of life. ______. Over 400 species of mammals swing, crawl, and prowl through its trees. The rivers contain over 3,000 species of fish."\n\nWhich sentence BEST fills the blank?',
        choices: [
          'The Amazon River is very long.',
          'Scientists estimate the rainforest contains over 80,000 plant species.',
          'Rainforests get a lot of rain each year.',
          'Many people live in the Amazon region.',
        ],
        answer: 1,
        explanation: 'The paragraph is listing variety of LIFE (mammals, fish). 80,000 plant species fits this pattern perfectly.',
        wrongExplanations: {
          0: 'Off-topic — about the river\'s length, not life.',
          2: 'Off-topic — about rainfall, not life.',
          3: 'Off-topic — about people, not the variety of life.',
        },
      },
      {
        id: 'ts-3',
        question: 'Which sentence does NOT belong in this paragraph about recycling?\n(A) Recycling helps protect the environment.\n(B) It reduces waste sent to landfills.\n(C) My neighbor has three different recycling bins.\n(D) It conserves natural resources like trees and water.',
        choices: ['A', 'B', 'C', 'D'],
        answer: 2,
        explanation: 'C is a personal detail about a neighbor — doesn\'t support the claim that recycling helps the environment. The others all give specific environmental benefits.',
        wrongExplanations: {
          0: 'A is the topic sentence — it belongs.',
          1: 'B is a benefit — supporting detail.',
          3: 'D is a benefit — supporting detail.',
        },
      },
      {
        id: 'ts-4',
        question: 'Which is the BEST topic sentence for a paragraph about the benefits of reading?',
        choices: [
          'I like to read before bed every night.',
          'Reading regularly strengthens vocabulary, improves focus, and sparks creativity.',
          'Some books are fiction and some are nonfiction.',
          'The library has thousands of books.',
        ],
        answer: 1,
        explanation: 'States a clear claim AND previews three specific benefits. The paragraph can develop each.',
        wrongExplanations: {
          0: 'Personal habit, not a topic sentence.',
          2: 'Description of book types, not a claim about benefits.',
          3: 'About library inventory, not benefits.',
        },
      },
      {
        id: 'ts-5',
        question: 'Which sentence would BEST conclude a paragraph about why students should sleep enough?',
        choices: [
          'Sleep is one of many things students need.',
          'Getting enough sleep helps students perform better and feel healthier.',
          'Some students play video games late at night.',
          'Adults need about seven hours of sleep.',
        ],
        answer: 1,
        explanation: 'Wraps up the main claim (sleep helps students). Concludes the topic.',
        wrongExplanations: {
          0: 'Too vague to conclude the main idea.',
          2: 'Off-topic — about video games.',
          3: 'About adults, not students.',
        },
      },
      {
        id: 'ts-6',
        question: 'Read: "Regular exercise has many benefits. It strengthens muscles. ______. It also reduces stress and improves mood." Which sentence fits the blank BEST?',
        choices: [
          'Some kids play video games instead of exercising.',
          'It improves heart health and helps maintain a healthy weight.',
          'Exercise was invented in Greece.',
          'Schools should have longer recess periods.',
        ],
        answer: 1,
        explanation: 'The paragraph lists benefits (muscles, stress, mood). Heart health + weight = more benefits, fits pattern.',
        wrongExplanations: {
          0: 'Off-topic — not a benefit.',
          2: 'Off-topic — historical claim, not a benefit.',
          3: 'Off-topic — opinion about schools.',
        },
      },
    ],
  },

  {
    id: 'sentence-ordering',
    sectionId: 'writing-concepts',
    name: 'Sentence Ordering',
    icon: '🔢',
    priority: 'high',
    lesson: {
      title: 'How Sentence Ordering Questions Work',
      sections: [
        {
          heading: 'What gets ordered',
          body: 'These questions give you sentences or events out of order, and you have to put them back in order. Two main flavors:\n• CHRONOLOGICAL — by time (earliest event first)\n• LOGICAL — by cause/effect or by general → specific',
        },
        {
          heading: 'The chronological move',
          body: 'For events in someone\'s life or a story:\n1. Look for TIME WORDS — first, then, after, before, finally, later, eventually.\n2. If no time words, use logic: birth before death, escape before traveling, learning before teaching.\n3. Number the events in your head: 1, 2, 3, 4. Match to the answer choices.',
          example: 'Harriet Tubman events:\n1. Grew up enslaved in the South\n2. Escaped to the North\n3. Worked on the Underground Railroad\n4. Served in the Civil War',
        },
        {
          heading: 'The logical move',
          body: 'For paragraphs:\n1. The TOPIC SENTENCE comes first.\n2. Supporting details come next, often general → specific.\n3. The CONCLUSION comes last.',
        },
        {
          heading: 'The trap',
          body: 'Wrong answers often have ONE pair right and one pair wrong. If you check the FIRST sentence in each option and ONLY one is the natural starter, that narrows it fast. Then check the LAST sentence the same way.',
        },
      ],
    },
    warmups: [
      {
        id: 'so-w1',
        question: 'Put these in chronological (time) order:\n1. The cake was eaten.\n2. Mom mixed the batter.\n3. The cake was baked.\n4. Mom bought the ingredients.',
        choices: ['1, 2, 3, 4', '4, 2, 3, 1', '2, 3, 4, 1', '4, 3, 2, 1'],
        answer: 1,
        explanation: 'Buy ingredients → mix batter → bake → eat. That\'s how cake actually happens.',
        wrongExplanations: {
          0: 'Eating first doesn\'t make sense.',
          2: 'Mixing before buying doesn\'t make sense.',
          3: 'Baking before mixing doesn\'t make sense.',
        },
      },
      {
        id: 'so-w2',
        question: 'Put these in chronological order:\n1. The egg hatched.\n2. The chick grew into a chicken.\n3. The chicken laid an egg.\n4. The egg was kept warm.',
        choices: ['1, 2, 3, 4', '3, 4, 1, 2', '4, 1, 2, 3', '2, 1, 4, 3'],
        answer: 1,
        explanation: 'Lay egg → keep warm → hatch → grow into chicken. Cycle of life order.',
        wrongExplanations: {
          0: 'Hatching before being warm doesn\'t fit.',
          2: 'Warmed before being laid doesn\'t fit.',
          3: 'Grew before hatched doesn\'t fit.',
        },
      },
      {
        id: 'so-w3',
        question: 'Which sentence should be FIRST in a paragraph?\n(A) For example, you can earn coins by completing levels.\n(B) Video games can teach important skills.\n(C) These skills include problem-solving and patience.\n(D) Many parents are surprised by this.',
        choices: ['A', 'B', 'C', 'D'],
        answer: 1,
        explanation: 'B is the topic sentence — the main claim. Everything else explains or supports it. Topic sentence comes first.',
        wrongExplanations: {
          0: '"For example" is for SUPPORTING details, not first.',
          2: '"These skills" assumes you already mentioned skills.',
          3: '"This" assumes you already explained something.',
        },
      },
    ],
    questions: [
      {
        id: 'so-1',
        question: 'Put these topics for a report on Harriet Tubman in chronological order:\n1. Growing up on a plantation in the South\n2. Working on the Underground Railroad\n3. Escaping to the North\n4. Serving as a nurse and spy during the Civil War',
        choices: ['1, 3, 2, 4', '2, 1, 4, 3', '3, 1, 2, 4', '4, 3, 2, 1'],
        answer: 0,
        explanation: 'Born/grew up → escaped → worked on Underground Railroad → served in Civil War.',
        wrongExplanations: {
          1: 'Working on Underground Railroad before being born doesn\'t fit.',
          2: 'Escaping before being born doesn\'t fit.',
          3: 'Civil War before being born doesn\'t fit.',
        },
      },
      {
        id: 'so-2',
        question: 'Which transition word BEST connects these ideas?\n"The experiment failed to produce expected results. ______, the scientists learned valuable information."',
        choices: ['Therefore', 'Similarly', 'Nevertheless', 'Meanwhile'],
        answer: 2,
        explanation: '"Nevertheless" = "even so." It shows contrast — failed BUT learned. That\'s the relationship.',
        wrongExplanations: {
          0: '"Therefore" means "because of this" — failed THEREFORE learned doesn\'t make sense (failure isn\'t a cause of learning).',
          1: '"Similarly" means "in the same way" — no similarity here.',
          3: '"Meanwhile" means "at the same time" — wrong relationship.',
        },
      },
      {
        id: 'so-3',
        question: 'Which is the BEST way to combine these sentences?\n"The storm knocked down trees. The storm caused flooding."',
        choices: [
          'The storm knocked down trees, the storm caused flooding.',
          'The storm knocked down trees and caused flooding.',
          'The storm knocked down trees. And the storm caused flooding.',
          'Knocking down trees, and flooding the streets, was the storm.',
        ],
        answer: 1,
        explanation: 'Combines smoothly with "and" — no repeated subject, no comma splice.',
        wrongExplanations: {
          0: 'Comma splice — two sentences joined by just a comma.',
          2: 'Don\'t start a sentence with "And" in formal writing. And you don\'t need to repeat "the storm."',
          3: 'Awkward and unclear.',
        },
      },
      {
        id: 'so-4',
        question: 'Read this paragraph and decide what should fill the blank:\n"Cleaning your room is easier than it sounds. First, pick up everything off the floor. ______. Finally, organize the items in your closet."',
        choices: [
          'Then, sort the items into trash, donate, and keep piles.',
          'My room is usually messy.',
          'Cleaning helps reduce stress.',
          'In conclusion, you should clean often.',
        ],
        answer: 0,
        explanation: 'The paragraph uses "First... Finally..." — needs a middle step. "Then, sort items" fits the sequence.',
        wrongExplanations: {
          1: 'Off-topic — personal anecdote, not a step.',
          2: 'Off-topic — about benefits, not the steps.',
          3: '"In conclusion" doesn\'t fit before the actual conclusion ("Finally").',
        },
      },
      {
        id: 'so-5',
        question: 'Which transition word BEST fits this blank?\n"Sara studied for hours every night. ______, she was confident on test day."',
        choices: ['However', 'As a result', 'On the other hand', 'In contrast'],
        answer: 1,
        explanation: 'Studied a lot → confident. That\'s cause and effect. "As a result" shows the cause leads to the effect.',
        wrongExplanations: {
          0: '"However" shows contrast. Studying and being confident aren\'t opposite.',
          2: '"On the other hand" shows contrast.',
          3: '"In contrast" shows contrast.',
        },
      },
      {
        id: 'so-6',
        question: 'Which sentence should come FIRST in a paragraph?\n(A) For instance, golden retrievers are very gentle.\n(B) Different dog breeds have very different personalities.\n(C) These differences come from generations of breeding.\n(D) However, every dog also has its own personality.',
        choices: ['A', 'B', 'C', 'D'],
        answer: 1,
        explanation: 'B is the topic sentence — the main claim about breed personalities. Others give examples or qualifications.',
        wrongExplanations: {
          0: '"For instance" is for SUPPORTING details, not first.',
          2: '"These differences" assumes you already mentioned differences.',
          3: '"However" assumes you already made a different point.',
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // QUANTITATIVE REASONING
  // ═══════════════════════════════════════════════════════════
  {
    id: 'column-comparison',
    sectionId: 'quant',
    name: 'Column A vs Column B',
    icon: '⚖️',
    priority: 'critical',
    lesson: {
      title: 'How Column A vs Column B Works (Most Important Type)',
      sections: [
        {
          heading: 'The format you\'ve never seen',
          body: 'You get TWO quantities — one in Column A, one in Column B. Your job: pick which is bigger, OR if they\'re equal, OR if it can\'t be determined.\n\nThe four answer choices are ALWAYS the same:\n(A) Column A is greater\n(B) Column B is greater\n(C) They are equal\n(D) Cannot be determined',
        },
        {
          heading: 'Why this matters',
          body: 'This is the SINGLE BIGGEST point pool on the Quantitative Reasoning section — about 1/3 of the questions. Most kids have NEVER seen this format. Once you learn the move, you can grab a lot of points fast.',
        },
        {
          heading: 'The move',
          body: '1. Calculate Column A\'s value.\n2. Calculate Column B\'s value.\n3. Compare. Pick A, B, or C.\n4. If there are unknowns (variables, missing info), TRY DIFFERENT VALUES. If A is bigger sometimes and B is bigger other times, pick "Cannot be determined."',
          example: 'Column A: 25% of 80\nColumn B: 80% of 25\n\n25% of 80 = 20. 80% of 25 = 20. Equal! → Answer is C.',
        },
        {
          heading: 'When to pick "Cannot be determined"',
          body: 'Pick D ONLY when there\'s a VARIABLE or UNKNOWN that could change the answer.\n\n"x is a positive whole number. Column A: 3x+5. Column B: 5x+3."\n→ Try x=1: A=8, B=8. Equal.\n→ Try x=2: A=11, B=13. B bigger.\n→ Different answers depending on x = Cannot be determined.\n\nIf both columns are FIXED numbers, never pick D.',
        },
        {
          heading: 'The trap',
          body: 'Some questions look like they have unknowns but actually don\'t. "A 2-inch square has its sides doubled. Compare perimeter and area." Both can be calculated exactly. → Don\'t pick D just because it feels uncertain.',
        },
      ],
    },
    warmups: [
      {
        id: 'cc-w1',
        question: 'Column A: 5 + 5\nColumn B: 5 × 2',
        choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
        answer: 2,
        explanation: '5 + 5 = 10. 5 × 2 = 10. Equal!',
        wrongExplanations: {
          0: 'Both equal 10 — A isn\'t greater.',
          1: 'Both equal 10 — B isn\'t greater.',
          3: 'Both are fixed numbers — you CAN determine.',
        },
      },
      {
        id: 'cc-w2',
        question: 'Column A: 3 × 4\nColumn B: 2 × 6',
        choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
        answer: 2,
        explanation: '3 × 4 = 12. 2 × 6 = 12. Equal!',
        wrongExplanations: {
          0: 'Both equal 12 — A isn\'t greater.',
          1: 'Both equal 12 — B isn\'t greater.',
          3: 'Both fixed — you CAN determine.',
        },
      },
      {
        id: 'cc-w3',
        question: 'x is any whole number.\nColumn A: x + 5\nColumn B: x + 3',
        choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
        answer: 0,
        explanation: 'No matter what x is, x+5 is always 2 MORE than x+3. So A is always greater. Don\'t be tricked into D — even with a variable, A is always bigger.',
        wrongExplanations: {
          1: '+5 is bigger than +3, no matter what x is.',
          2: 'They differ by 2 always — never equal.',
          3: 'TRAP! There IS a variable, but A is ALWAYS greater. Only pick D if the answer changes depending on the variable.',
        },
      },
    ],
    questions: [
      {
        id: 'cc-1',
        question: 'A 2-inch square has its sides doubled.\n\nColumn A: Perimeter of the new square\nColumn B: Area of the new square',
        choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
        answer: 2,
        explanation: 'New sides are 4 inches. Perimeter = 4 × 4 = 16. Area = 4 × 4 = 16. Equal! (They measure different things — inches vs. square inches — but the NUMBERS are equal.)',
        wrongExplanations: {
          0: 'Both = 16. A isn\'t greater.',
          1: 'Both = 16. B isn\'t greater.',
          3: 'Both are fixed numbers — you can calculate.',
        },
      },
      {
        id: 'cc-2',
        question: 'Column A: 25% of 80\nColumn B: 80% of 25',
        choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
        answer: 2,
        explanation: '25% of 80 = 0.25 × 80 = 20. 80% of 25 = 0.80 × 25 = 20. Equal! (Trick: A% of B = B% of A, always.)',
        wrongExplanations: {
          0: 'Both = 20.',
          1: 'Both = 20.',
          3: 'Both fixed — calculable.',
        },
      },
      {
        id: 'cc-3',
        question: 'A circle with radius 3 is inscribed inside a square (the circle just fits).\n\nColumn A: Circumference of the circle\nColumn B: Perimeter of the square',
        choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
        answer: 1,
        explanation: 'Circumference = 2π × 3 ≈ 18.85. Square\'s side = diameter = 6, so perimeter = 4 × 6 = 24. Column B is bigger.',
        wrongExplanations: {
          0: 'Square\'s 24 > circle\'s ~18.85.',
          2: 'Not equal — square is bigger.',
          3: 'Both calculable.',
        },
      },
      {
        id: 'cc-4',
        question: 'Two overlapping circles represent "Plastic Blocks" and "Blue Blocks." No numbers are given.\n\nColumn A: Number of plastic blocks\nColumn B: Number of blue blocks',
        choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
        answer: 3,
        explanation: 'Without any actual numbers, you can\'t tell which group is bigger. This is a real "Cannot be determined" question.',
        wrongExplanations: {
          0: 'No numbers given — you can\'t say A is bigger.',
          1: 'No numbers given — you can\'t say B is bigger.',
          2: 'No numbers given — you can\'t say they\'re equal.',
        },
      },
      {
        id: 'cc-5',
        question: 'A bag has 3 red marbles and 5 blue marbles.\n\nColumn A: Probability of drawing a red marble\nColumn B: 1/2',
        choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
        answer: 1,
        explanation: 'P(red) = 3/8 = 0.375. 1/2 = 0.5. Column B is greater.',
        wrongExplanations: {
          0: '3/8 < 1/2.',
          2: '3/8 ≠ 1/2.',
          3: 'Both calculable.',
        },
      },
      {
        id: 'cc-6',
        question: 'A rectangle has length 12 and width 5.\n\nColumn A: Perimeter of the rectangle\nColumn B: Area of the rectangle',
        choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
        answer: 1,
        explanation: 'Perimeter = 2(12+5) = 34. Area = 12 × 5 = 60. Column B is bigger.',
        wrongExplanations: {
          0: '34 < 60.',
          2: 'Not equal.',
          3: 'Both calculable.',
        },
      },
      {
        id: 'cc-7',
        question: 'A rectangle has length 8 and width 6. A square has side length 7.\n\nColumn A: Area of the rectangle\nColumn B: Area of the square',
        choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
        answer: 1,
        explanation: 'Rectangle area = 8 × 6 = 48. Square area = 7 × 7 = 49. Column B is bigger by 1.',
        wrongExplanations: {
          0: '48 < 49.',
          2: 'Not equal.',
          3: 'Both calculable.',
        },
      },
      {
        id: 'cc-8',
        question: 'Column A: Number of factors of 12\nColumn B: Number of factors of 16',
        choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
        answer: 0,
        explanation: 'Factors of 12: 1, 2, 3, 4, 6, 12 = 6 factors. Factors of 16: 1, 2, 4, 8, 16 = 5 factors. A > B.',
        wrongExplanations: {
          1: '6 > 5 — A is bigger.',
          2: 'Not equal.',
          3: 'Both calculable.',
        },
      },
      {
        id: 'cc-9',
        question: 'x is a positive whole number greater than 1.\n\nColumn A: 3x + 5\nColumn B: 5x + 3',
        choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
        answer: 1,
        explanation: 'Try x=2: A=11, B=13 (B bigger). Try x=10: A=35, B=53 (B bigger). When x>1, B is always bigger because the +5 multiplier on x dominates.',
        wrongExplanations: {
          0: 'For x>1, B is always greater.',
          2: 'They equal only at x=1, but x must be GREATER than 1 here.',
          3: 'You CAN determine because x is restricted to "greater than 1."',
        },
      },
      {
        id: 'cc-10',
        question: 'Column A: 3/5 of 100\nColumn B: 5/3 of 36',
        choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
        answer: 2,
        explanation: '3/5 of 100 = 60. 5/3 of 36 = 60. Equal!',
        wrongExplanations: {
          0: 'Both = 60.',
          1: 'Both = 60.',
          3: 'Both calculable.',
        },
      },
      {
        id: 'cc-11',
        question: 'Column A: 2 × 3 × 5\nColumn B: 5 × 6',
        choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
        answer: 2,
        explanation: '2 × 3 × 5 = 30. 5 × 6 = 30. Equal!',
        wrongExplanations: {
          0: 'Both = 30.',
          1: 'Both = 30.',
          3: 'Both calculable.',
        },
      },
      {
        id: 'cc-12',
        question: 'A store sells pencils for $0.25 each and pens for $0.75 each.\n\nColumn A: Cost of 6 pencils\nColumn B: Cost of 2 pens',
        choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
        answer: 2,
        explanation: '6 × $0.25 = $1.50. 2 × $0.75 = $1.50. Equal!',
        wrongExplanations: {
          0: 'Both = $1.50.',
          1: 'Both = $1.50.',
          3: 'Both calculable.',
        },
      },
    ],
  },

  {
    id: 'patterns',
    sectionId: 'quant',
    name: 'Number Patterns',
    icon: '🔁',
    priority: 'high',
    lesson: {
      title: 'How Number Pattern Questions Work',
      sections: [
        {
          heading: 'Patterns are about the DIFFERENCE',
          body: 'When you see a sequence of numbers, the first thing to do is find the DIFFERENCE between each pair of numbers. That tells you the rule.',
          example: '2, 5, 8, 11, ___\nDifferences: 3, 3, 3 → add 3 each time → next is 14.\n\n2, 6, 18, 54, ___\nDifferences: 4, 12, 36 → not a constant add. Try multiply: 2×3=6, 6×3=18, 18×3=54 → multiply by 3 → next is 162.',
        },
        {
          heading: 'Common pattern types',
          body: '• ADD a constant: 3, 6, 9, 12, ...\n• MULTIPLY by a constant: 2, 4, 8, 16, ...\n• ADD A GROWING NUMBER: 1, 2, 4, 7, 11, ... (differences: 1, 2, 3, 4, ...)\n• SQUARES: 1, 4, 9, 16, 25, ... (1², 2², 3², ...)\n• FIBONACCI: 1, 1, 2, 3, 5, 8, ... (each = sum of previous two)',
        },
        {
          heading: 'When the differences GROW',
          body: 'If the first differences aren\'t constant, take their differences (the "second differences"). If THOSE are constant, the rule is "add increasing amounts."',
          example: '2, 7, 17, 32, 52, ___\nFirst differences: 5, 10, 15, 20\nSecond differences: 5, 5, 5 (constant!)\nNext first difference: 25 → next number: 52 + 25 = 77.',
        },
        {
          heading: 'The trap',
          body: 'Wrong answers often add ONE more by adding the LAST difference, instead of the NEXT growing difference. In 2, 7, 17, 32, 52 — the lazy answer is 52 + 20 = 72. Right answer keeps the pattern: +25 → 77. Always check what the differences are doing.',
        },
      ],
    },
    warmups: [
      {
        id: 'pa-w1',
        question: 'What number comes next?\n2, 4, 6, 8, ___',
        choices: ['9', '10', '12', '16'],
        answer: 1,
        explanation: 'Adding 2 each time. 8 + 2 = 10.',
        wrongExplanations: {
          0: '+1 doesn\'t fit — differences are 2.',
          2: '+4 skips a step.',
          3: 'That would be x2, not the pattern.',
        },
      },
      {
        id: 'pa-w2',
        question: 'What number comes next?\n3, 6, 12, 24, ___',
        choices: ['30', '36', '48', '60'],
        answer: 2,
        explanation: 'Each number doubles (×2). 24 × 2 = 48.',
        wrongExplanations: {
          0: '+6 doesn\'t match — the pattern is doubling.',
          1: '+12 doesn\'t match doubling.',
          3: 'Too big — overshoots.',
        },
      },
      {
        id: 'pa-w3',
        question: 'What number comes next?\n1, 4, 9, 16, ___',
        choices: ['20', '25', '32', '36'],
        answer: 1,
        explanation: 'These are squares: 1², 2², 3², 4². Next is 5² = 25.',
        wrongExplanations: {
          0: '+4 wouldn\'t match the growing pattern.',
          2: '×2 doesn\'t fit.',
          3: 'That\'s 6², skipping 5².',
        },
      },
    ],
    questions: [
      {
        id: 'pa-1',
        question: 'What number comes next?\n2, 6, 18, 54, ___',
        choices: ['72', '108', '162', '216'],
        answer: 2,
        explanation: 'Each multiplied by 3. 54 × 3 = 162.',
        wrongExplanations: {
          0: '54 + 18 = 72 — but that\'s adding, not multiplying.',
          1: '54 × 2 = 108 — wrong multiplier.',
          3: '54 × 4 = 216 — wrong multiplier.',
        },
      },
      {
        id: 'pa-2',
        question: 'Day 1: 2 marbles. Day 2: 7. Day 3: 17. Day 4: 32. Day 5: 52.\n\nHow many marbles on Day 7?',
        choices: ['77', '92', '107', '132'],
        answer: 2,
        explanation: 'Differences: 5, 10, 15, 20 (adding 5 each time). Day 6: 52 + 25 = 77. Day 7: 77 + 30 = 107.',
        wrongExplanations: {
          0: 'That\'s only Day 6, not Day 7.',
          1: 'Pattern miscalculated.',
          3: 'Pattern broken — added too much.',
        },
      },
      {
        id: 'pa-3',
        question: 'In a pattern of shapes: triangle, square, pentagon, hexagon, ...\nHow many sides does the 8th shape have?',
        choices: ['8', '9', '10', '11'],
        answer: 2,
        explanation: 'Triangle=3, square=4, pentagon=5, hexagon=6. Pattern: nth shape has n+2 sides. 8+2=10.',
        wrongExplanations: {
          0: 'That would be the formula "nth shape has n sides" — but the 1st has 3, not 1.',
          1: 'Off by one.',
          3: 'Off by one.',
        },
      },
      {
        id: 'pa-4',
        question: 'Look at this sequence: 1, 1, 2, 3, 5, 8, 13, ___\nWhat is the next number?',
        choices: ['15', '18', '21', '26'],
        answer: 2,
        explanation: 'Each number is the sum of the two before. 5+8=13. 8+13=21. (Fibonacci!)',
        wrongExplanations: {
          0: '13+2=15, but 2 isn\'t the right addend.',
          1: 'Pattern miscalculated.',
          3: '13+13=26, but you\'re supposed to add 8+13.',
        },
      },
      {
        id: 'pa-5',
        question: 'The pattern is: 1, 4, 9, 16, 25, ___\nWhat is the 8th number?',
        choices: ['36', '49', '56', '64'],
        answer: 3,
        explanation: 'These are squares: 1², 2², 3², 4², 5². The 8th is 8² = 64.',
        wrongExplanations: {
          0: '36 = 6² — that\'s the 6th, not the 8th.',
          1: '49 = 7² — that\'s the 7th.',
          2: '56 isn\'t a square at all.',
        },
      },
      {
        id: 'pa-6',
        question: 'Each row of a triangle has one more dot than the row above.\nRow 1: 1 dot. Row 2: 2. Row 3: 3.\nHow many TOTAL dots in 10 rows?',
        choices: ['45', '55', '100', '110'],
        answer: 1,
        explanation: '1+2+3+4+5+6+7+8+9+10 = 55. (Shortcut: n(n+1)/2 = 10×11/2 = 55.)',
        wrongExplanations: {
          0: '1+2+...+9 = 45 — only 9 rows.',
          2: '10² = 100 — wrong formula.',
          3: 'Wrong arithmetic.',
        },
      },
      {
        id: 'pa-7',
        question: 'Pattern rule: "multiply by 2, then subtract 1." If the first number is 3, what is the fourth?',
        choices: ['9', '17', '19', '33'],
        answer: 1,
        explanation: '1st: 3. 2nd: 3×2−1 = 5. 3rd: 5×2−1 = 9. 4th: 9×2−1 = 17.',
        wrongExplanations: {
          0: '9 is the 3rd, not the 4th.',
          2: '19 is wrong — 9×2 = 18, then −1 = 17.',
          3: 'Wrong arithmetic somewhere.',
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // MATHEMATICS — three highest-frequency types
  // ═══════════════════════════════════════════════════════════
  {
    id: 'fractions',
    sectionId: 'math',
    name: 'Fraction Operations',
    icon: '🔪',
    priority: 'high',
    lesson: {
      title: 'How Fraction Questions Work',
      sections: [
        {
          heading: 'The four fraction moves you need',
          body: '1. ADDING/SUBTRACTING — need a common denominator FIRST.\n2. MULTIPLYING — multiply tops, multiply bottoms, simplify.\n3. COMPARING — convert to same denominator OR think about size.\n4. FRACTION OF A NUMBER — multiply.',
        },
        {
          heading: 'Add/Subtract: Common denominator FIRST',
          body: 'You can\'t add 2/3 and 1/4 directly. Find a common denominator (12 works for both):\n2/3 = 8/12 (multiply top and bottom by 4)\n1/4 = 3/12 (multiply top and bottom by 3)\nNow add: 8/12 + 3/12 = 11/12.\n\nNEVER add tops and bottoms separately. 2/3 + 1/4 ≠ 3/7. (That\'s the #1 trap.)',
        },
        {
          heading: 'Multiply: Just multiply',
          body: '3/4 × 2/5 = (3×2)/(4×5) = 6/20 = 3/10 (simplified).\n\nNo common denominator needed for multiplying. That\'s only for adding/subtracting.',
        },
        {
          heading: 'Compare: Get the same denominator',
          body: 'Which is bigger, 3/4 or 7/8? Convert: 3/4 = 6/8. Now compare: 6/8 vs. 7/8. 7/8 wins.',
        },
        {
          heading: 'Fraction of a number',
          body: '2/3 of 30 = (2/3) × 30 = 60/3 = 20. Multiply.',
        },
      ],
    },
    warmups: [
      {
        id: 'fr-w1',
        question: 'What is 1/2 + 1/2?',
        choices: ['1/4', '2/4', '1', '1/1'],
        answer: 2,
        explanation: '1/2 + 1/2 = 2/2 = 1. Same denominator already, just add tops.',
        wrongExplanations: {
          0: 'Don\'t multiply the bottoms when adding.',
          1: '2/4 = 1/2, not 1.',
          3: 'Same as 1, but written as a normal number.',
        },
      },
      {
        id: 'fr-w2',
        question: 'What is 1/2 × 1/2?',
        choices: ['1/4', '2/4', '1/2', '1'],
        answer: 0,
        explanation: 'Multiply tops: 1×1=1. Multiply bottoms: 2×2=4. So 1/4.',
        wrongExplanations: {
          1: 'That\'s adding, not multiplying.',
          2: 'Half of a half is a quarter, not a half.',
          3: 'Way too big — half of a half is smaller, not bigger.',
        },
      },
      {
        id: 'fr-w3',
        question: 'Which is bigger: 3/4 or 1/2?',
        choices: ['3/4', '1/2', 'They are equal', 'Cannot be determined'],
        answer: 0,
        explanation: '3/4 = 6/8. 1/2 = 4/8. 6/8 > 4/8. So 3/4 is bigger.',
        wrongExplanations: {
          1: '1/2 = 0.5, 3/4 = 0.75. 3/4 is bigger.',
          2: 'They aren\'t equal.',
          3: 'Both are fixed numbers — calculable.',
        },
      },
    ],
    questions: [
      {
        id: 'fr-1',
        question: 'What is 2/3 + 1/4?',
        choices: ['3/7', '3/12', '11/12', '8/12'],
        answer: 2,
        explanation: 'Common denominator = 12. 2/3 = 8/12. 1/4 = 3/12. 8/12 + 3/12 = 11/12.',
        wrongExplanations: {
          0: 'TRAP — adding tops and bottoms separately is wrong. (2+1)/(3+4) = 3/7 is incorrect.',
          1: 'You added tops without converting first. 8/12 + 3/12 ≠ 3/12.',
          3: 'You converted 2/3 = 8/12 but forgot to add 3/12 from 1/4.',
        },
      },
      {
        id: 'fr-2',
        question: 'Which fraction is LESS than 7/8?',
        choices: ['9/10', '8/9', '3/4', '15/16'],
        answer: 2,
        explanation: '3/4 = 6/8. 6/8 < 7/8. The others all exceed 7/8.',
        wrongExplanations: {
          0: '9/10 > 7/8 (90% vs 87.5%).',
          1: '8/9 ≈ 89% — still bigger than 7/8.',
          3: '15/16 = 93.75% — bigger.',
        },
      },
      {
        id: 'fr-3',
        question: 'What is 3/4 × 2/5?',
        choices: ['5/9', '6/20', '3/10', '5/20'],
        answer: 2,
        explanation: '(3×2)/(4×5) = 6/20 = 3/10 (divide both by 2 to simplify).',
        wrongExplanations: {
          0: 'TRAP — adding tops and bottoms.',
          1: 'You got 6/20 but didn\'t simplify. 6/20 = 3/10.',
          3: 'Wrong multiplication of tops.',
        },
      },
      {
        id: 'fr-4',
        question: 'Which fraction is equivalent to 4/6?',
        choices: ['2/4', '2/3', '8/10', '6/8'],
        answer: 1,
        explanation: 'Simplify 4/6 by dividing both by 2: 4÷2=2, 6÷2=3. So 4/6 = 2/3.',
        wrongExplanations: {
          0: '2/4 = 1/2, not 2/3.',
          2: '8/10 = 4/5, not 4/6.',
          3: '6/8 = 3/4, not 4/6.',
        },
      },
      {
        id: 'fr-5',
        question: 'What is 0.75 expressed as a fraction in simplest form?',
        choices: ['75/100', '3/4', '7/5', '15/20'],
        answer: 1,
        explanation: '0.75 = 75/100 = 3/4 (divide both by 25).',
        wrongExplanations: {
          0: 'Right value, but not simplified.',
          2: '7/5 = 1.4, not 0.75.',
          3: '15/20 = 3/4, but the answer asks for SIMPLEST form. 3/4 is more simplified.',
        },
      },
      {
        id: 'fr-6',
        question: 'What is 1/3 + 1/6?',
        choices: ['2/9', '1/9', '1/2', '2/6'],
        answer: 2,
        explanation: 'Common denominator = 6. 1/3 = 2/6. 2/6 + 1/6 = 3/6 = 1/2.',
        wrongExplanations: {
          0: 'TRAP — adding tops and bottoms (1+1)/(3+6).',
          1: 'You can\'t multiply denominators when adding.',
          3: '2/6 = 1/3, not 1/3 + 1/6.',
        },
      },
      {
        id: 'fr-7',
        question: 'What is 2/3 of 30?',
        choices: ['10', '15', '20', '45'],
        answer: 2,
        explanation: '2/3 × 30 = 60/3 = 20. Or: 1/3 of 30 = 10, so 2/3 = 2 × 10 = 20.',
        wrongExplanations: {
          0: '1/3 of 30 = 10. The question asks 2/3.',
          1: 'Half of 30 = 15. Different fraction.',
          3: '30 + 1/2 of 30 doesn\'t fit.',
        },
      },
      {
        id: 'fr-8',
        question: 'What is 5/8 − 1/4?',
        choices: ['4/4', '4/8', '3/8', '1/2'],
        answer: 2,
        explanation: 'Common denominator = 8. 1/4 = 2/8. 5/8 − 2/8 = 3/8.',
        wrongExplanations: {
          0: 'Way too big.',
          1: '4/8 = 1/2 — but math doesn\'t work out to that.',
          3: '1/2 = 4/8. Off by one.',
        },
      },
    ],
  },

  {
    id: 'word-problems',
    sectionId: 'math',
    name: 'Word Problem → Equation',
    icon: '🔣',
    priority: 'high',
    lesson: {
      title: 'How Word Problems Work',
      sections: [
        {
          heading: 'The translation move',
          body: 'Word problems are math hidden in words. The trick is TRANSLATING English into math.\n\nKey words:\n• "more than" / "increased by" → ADD\n• "less than" / "decreased by" → SUBTRACT (watch order!)\n• "times" / "of" / "product" → MULTIPLY\n• "per" / "divided by" / "ratio" → DIVIDE\n• "is" / "equals" → =\n• "what number" / a missing thing → x',
        },
        {
          heading: 'The four-step move',
          body: '1. UNDERLINE what the question is asking.\n2. WRITE DOWN the numbers and what they mean.\n3. TRANSLATE words into an equation.\n4. SOLVE.',
          example: '"A garden\'s length is 4 times its width. The perimeter is 240. What is the length?"\n\nWidth = w. Length = 4w.\nPerimeter = 2(w + 4w) = 2(5w) = 10w.\nSo 10w = 240 → w = 24. Length = 4 × 24 = 96.',
        },
        {
          heading: 'Watch out for "less than"',
          body: '"5 less than x" = x − 5 (NOT 5 − x).\n\n"What is 5 less than 12?" = 12 − 5 = 7. The order matters.',
        },
        {
          heading: 'The trap',
          body: 'Test-makers love using the numbers FROM the problem as wrong answers. If the problem mentions 15 and 9, you\'ll often see 15, 9, and 24 (sum) as wrong answers. The right answer is usually a number you have to CALCULATE that isn\'t already on the page.',
        },
      ],
    },
    warmups: [
      {
        id: 'wp-w1',
        question: 'Sarah has 15 apples. Tom has 9. How many more does Sarah have than Tom?',
        choices: ['24', '6', '15', '9'],
        answer: 1,
        explanation: '"How many MORE" = subtract. 15 − 9 = 6.',
        wrongExplanations: {
          0: 'TRAP — that\'s sum (15+9=24), not difference.',
          2: 'TRAP — Sarah\'s number, not the difference.',
          3: 'TRAP — Tom\'s number, not the difference.',
        },
      },
      {
        id: 'wp-w2',
        question: 'A pizza has 8 slices. If 3 friends each eat 2 slices, how many are LEFT?',
        choices: ['2', '5', '6', '8'],
        answer: 0,
        explanation: '3 friends × 2 slices = 6 eaten. 8 − 6 = 2 left.',
        wrongExplanations: {
          1: '8 − 3 = 5, but you need to subtract slices eaten, not friends.',
          2: 'That\'s slices eaten, not slices left.',
          3: 'Total slices, not what\'s left.',
        },
      },
      {
        id: 'wp-w3',
        question: 'A book has 200 pages. Maya read 1/4 of it. How many pages did she read?',
        choices: ['25', '50', '75', '100'],
        answer: 1,
        explanation: '1/4 of 200 = 200 ÷ 4 = 50.',
        wrongExplanations: {
          0: '25 = 1/8 of 200, not 1/4.',
          2: '75 doesn\'t fit any clean fraction of 200.',
          3: '100 = 1/2 of 200, not 1/4.',
        },
      },
    ],
    questions: [
      {
        id: 'wp-1',
        question: 'A rectangular garden has a length 4 times its width. The perimeter is 240 meters. What is the LENGTH?',
        choices: ['24 meters', '48 meters', '96 meters', '120 meters'],
        answer: 2,
        explanation: 'Width = w, length = 4w. Perimeter = 2(w + 4w) = 10w. 10w = 240, so w = 24. Length = 4 × 24 = 96.',
        wrongExplanations: {
          0: '24 is the WIDTH, not the length. Read the question carefully.',
          1: '48 = 2 × 24 — wrong calculation.',
          3: 'Wrong setup of perimeter equation.',
        },
      },
      {
        id: 'wp-2',
        question: 'A movie starts at 2:45 PM and is 1 hour 50 minutes long. What time does it end?',
        choices: ['3:35 PM', '4:15 PM', '4:35 PM', '4:45 PM'],
        answer: 2,
        explanation: '2:45 + 1 hour = 3:45. 3:45 + 50 min = 4:35 PM.',
        wrongExplanations: {
          0: '2:45 + 50 min = 3:35 — forgot the hour.',
          1: 'Wrong arithmetic.',
          3: '4:45 = 2:45 + 2 hours — added too much.',
        },
      },
      {
        id: 'wp-3',
        question: 'A shirt costs $40. It\'s on sale for 25% off. What is the SALE price?',
        choices: ['$10', '$15', '$25', '$30'],
        answer: 3,
        explanation: '25% of $40 = $10 discount. $40 − $10 = $30 sale price.',
        wrongExplanations: {
          0: 'TRAP — that\'s the discount, not the sale price.',
          1: 'Wrong calculation.',
          2: 'Wrong calculation.',
        },
      },
      {
        id: 'wp-4',
        question: 'If 2x + 8 = 20, what is the value of x?',
        choices: ['4', '6', '10', '14'],
        answer: 1,
        explanation: '2x = 20 − 8 = 12. x = 12 ÷ 2 = 6. Check: 2(6) + 8 = 20. ✓',
        wrongExplanations: {
          0: 'You may have done 2x = 8, but actually 2x = 12.',
          2: 'Forgot to divide by 2.',
          3: 'Added 8 instead of subtracting.',
        },
      },
      {
        id: 'wp-5',
        question: 'If n = 5, what is the value of 3n + 7?',
        choices: ['15', '22', '35', '57'],
        answer: 1,
        explanation: '3n = 3 × 5 = 15. 15 + 7 = 22.',
        wrongExplanations: {
          0: 'That\'s only 3n, forgot to add 7.',
          2: '3 × 5 + 7 ≠ 35. You may have multiplied wrong.',
          3: '57 = 5 × 7 + something — wrong setup.',
        },
      },
      {
        id: 'wp-6',
        question: 'A bag has 4 red, 3 blue, and 5 green marbles. What is the probability of drawing a blue marble?',
        choices: ['1/4', '3/12', '3/5', '1/3'],
        answer: 0,
        explanation: 'Total = 4+3+5 = 12. P(blue) = 3/12 = 1/4.',
        wrongExplanations: {
          1: 'Right value but not simplified — 3/12 = 1/4.',
          2: '3/5 ignores the green marbles.',
          3: '1/3 — wrong total.',
        },
      },
      {
        id: 'wp-7',
        question: 'How many cups in 3 quarts? (1 quart = 4 cups)',
        choices: ['7', '12', '16', '3'],
        answer: 1,
        explanation: '3 × 4 = 12 cups.',
        wrongExplanations: {
          0: '3 + 4 = 7 — wrong operation.',
          2: '4 × 4 = 16 — that\'s 4 quarts.',
          3: 'Just the original number.',
        },
      },
      {
        id: 'wp-8',
        question: 'Five test scores: 85, 92, 78, 90, 95. What is the mean (average)?',
        choices: ['85', '88', '90', '92'],
        answer: 1,
        explanation: 'Sum = 85+92+78+90+95 = 440. Mean = 440 ÷ 5 = 88.',
        wrongExplanations: {
          0: 'One of the scores, not the mean.',
          2: 'One of the scores, not the mean.',
          3: 'One of the scores, not the mean.',
        },
      },
    ],
  },

  {
    id: 'geometry',
    sectionId: 'math',
    name: 'Geometry: Perimeter, Area & Volume',
    icon: '📐',
    priority: 'high',
    lesson: {
      title: 'How Geometry Questions Work',
      sections: [
        {
          heading: 'The formulas to memorize',
          body: '• PERIMETER of rectangle = 2 × (length + width)\n• AREA of rectangle = length × width\n• AREA of triangle = (base × height) ÷ 2\n• VOLUME of rectangular prism (box) = length × width × height\n• Angles in a triangle add to 180°',
        },
        {
          heading: 'The move',
          body: '1. Identify what shape you\'re working with.\n2. Identify what the question asks (perimeter, area, volume, angle).\n3. Pick the formula.\n4. Plug in the numbers and calculate.',
          example: 'A triangle has base 10cm and height 6cm. Area?\nFormula: (base × height) / 2\n(10 × 6) / 2 = 60/2 = 30 cm².',
        },
        {
          heading: 'Triangle angle trick',
          body: 'Angles always add to 180°. If you know two angles, the third = 180 − (other two).\n\nExample: 65° and 75°. Third = 180 − 65 − 75 = 40°.',
        },
        {
          heading: 'The trap',
          body: 'Don\'t mix up perimeter and area. Perimeter is the DISTANCE AROUND. Area is the SPACE INSIDE. Volume is the SPACE INSIDE a 3D shape.\n\nUnits help: perimeter = inches, area = square inches (in²), volume = cubic inches (in³).',
        },
      ],
    },
    warmups: [
      {
        id: 'ge-w1',
        question: 'A rectangle has length 6 and width 4. What is the perimeter?',
        choices: ['10', '20', '24', '40'],
        answer: 1,
        explanation: 'Perimeter = 2(6+4) = 2(10) = 20.',
        wrongExplanations: {
          0: 'You added length and width once. Perimeter goes around all 4 sides.',
          2: 'That\'s the AREA (6×4=24), not perimeter.',
          3: '10×4 = 40 — wrong formula.',
        },
      },
      {
        id: 'ge-w2',
        question: 'A rectangle has length 6 and width 4. What is the area?',
        choices: ['10', '20', '24', '40'],
        answer: 2,
        explanation: 'Area = length × width = 6 × 4 = 24.',
        wrongExplanations: {
          0: 'That\'s adding L+W once, not area.',
          1: 'That\'s the PERIMETER, not area.',
          3: 'Wrong calculation.',
        },
      },
      {
        id: 'ge-w3',
        question: 'A triangle has angles 50° and 60°. What is the third angle?',
        choices: ['30°', '70°', '90°', '110°'],
        answer: 1,
        explanation: 'Triangle angles sum to 180. 180 − 50 − 60 = 70°.',
        wrongExplanations: {
          0: 'Off by one — you might have summed wrong.',
          2: '50+60+90 = 200, not 180.',
          3: 'Way too big.',
        },
      },
    ],
    questions: [
      {
        id: 'ge-1',
        question: 'A triangle has a base of 10 cm and height of 6 cm. What is its area?',
        choices: ['16 cm²', '30 cm²', '60 cm²', '36 cm²'],
        answer: 1,
        explanation: 'Area = (base × height) / 2 = (10 × 6) / 2 = 30 cm².',
        wrongExplanations: {
          0: '10 + 6 = 16 — wrong operation.',
          2: 'TRAP — that\'s base × height. Triangle area DIVIDES by 2.',
          3: '6² = 36 — wrong formula.',
        },
      },
      {
        id: 'ge-2',
        question: 'Two angles of a triangle measure 65° and 75°. What is the third angle?',
        choices: ['30°', '40°', '50°', '60°'],
        answer: 1,
        explanation: '180 − 65 − 75 = 40°.',
        wrongExplanations: {
          0: 'Wrong subtraction.',
          2: 'Wrong subtraction.',
          3: 'Wrong subtraction.',
        },
      },
      {
        id: 'ge-3',
        question: 'A rectangular box is 5 cm long, 3 cm wide, and 4 cm tall. What is its volume?',
        choices: ['12 cm³', '24 cm³', '47 cm³', '60 cm³'],
        answer: 3,
        explanation: 'Volume = length × width × height = 5 × 3 × 4 = 60 cm³.',
        wrongExplanations: {
          0: '5 + 3 + 4 = 12 — wrong operation.',
          1: 'Some kind of partial multiplication.',
          2: 'Wrong calculation.',
        },
      },
      {
        id: 'ge-4',
        question: 'A rectangular garden has length 4 times its width. The perimeter is 240 m. What is the LENGTH?',
        choices: ['24 m', '48 m', '96 m', '120 m'],
        answer: 2,
        explanation: 'Width = w, length = 4w. Perimeter = 2(5w) = 10w. 10w = 240, w = 24. Length = 4 × 24 = 96.',
        wrongExplanations: {
          0: 'TRAP — that\'s the WIDTH, not the length.',
          1: 'Wrong calculation.',
          3: 'Wrong setup of perimeter formula.',
        },
      },
      {
        id: 'ge-5',
        question: 'Point A is at (3, 2) and Point B is at (7, 2). What is the distance between them?',
        choices: ['2', '4', '5', '10'],
        answer: 1,
        explanation: 'Same y-coordinate, so distance is just difference in x: 7 − 3 = 4.',
        wrongExplanations: {
          0: 'Wrong subtraction.',
          2: 'Wrong calculation.',
          3: 'Sum of coordinates, not distance.',
        },
      },
      {
        id: 'ge-6',
        question: 'Which shape could NOT be a rectangle?',
        choices: ['A parallelogram', 'A polygon', 'A trapezoid', 'A quadrilateral'],
        answer: 2,
        explanation: 'A trapezoid has only ONE pair of parallel sides. A rectangle needs TWO pairs. So a trapezoid can never be a rectangle.',
        wrongExplanations: {
          0: 'A rectangle IS a parallelogram (special type).',
          1: 'A rectangle IS a polygon (4-sided).',
          3: 'A rectangle IS a quadrilateral (has 4 sides).',
        },
      },
      {
        id: 'ge-7',
        question: 'How many lines of symmetry does a regular hexagon have?',
        choices: ['2', '4', '6', '8'],
        answer: 2,
        explanation: 'Regular hexagon: 6 lines of symmetry — 3 through opposite vertices, 3 through midpoints of opposite sides.',
        wrongExplanations: {
          0: 'Way too few.',
          1: 'A square has 4. Hexagon has more.',
          3: 'Too many.',
        },
      },
      {
        id: 'ge-8',
        question: 'A square has a side of 7 cm. What is the area?',
        choices: ['14 cm²', '28 cm²', '49 cm²', '14 cm'],
        answer: 2,
        explanation: 'Area of square = side². 7² = 49 cm².',
        wrongExplanations: {
          0: 'That\'s 2 sides — half the perimeter.',
          1: 'That\'s the PERIMETER (4 × 7 = 28), not the area.',
          3: 'Wrong units AND wrong number.',
        },
      },
    ],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────

export function getTopic(topicId) {
  return TOPICS.find(t => t.id === topicId);
}

export function getTopicsBySection(sectionId) {
  return TOPICS.filter(t => t.sectionId === sectionId);
}

export function getCriticalTopics() {
  return TOPICS.filter(t => t.priority === 'critical');
}

export function getDaysUntilTestExact() {
  return getDaysUntilTest();
}

// Backwards-compatible exports for App.jsx during transition
export const READING_PASSAGES = TOPICS
  .filter(t => t.sectionId === 'reading')
  .flatMap(t => t.passages || []);

export function getQuestions(topicId) {
  const t = getTopic(topicId);
  return t ? (t.questions || []) : [];
}
