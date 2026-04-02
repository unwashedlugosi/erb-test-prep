// ERB CTP5 Level 5 — Practice Content
// All questions modeled after official CTP5 sample items and Content Standards Manual

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

// XP values
export const XP = {
  CORRECT: 5,
  FIRST_TRY_BONUS: 3,
  STREAK_5_BONUS: 2,
  STREAK_10_BONUS: 2,
  WRONG: 1,
  TEST_SMARTS_MODULE: 25,
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

// Section metadata
export const SECTIONS = [
  { id: 'verbal', name: 'Verbal Reasoning', icon: '🔤', color: '#6366f1', desc: 'Analogies, categories, and logic' },
  { id: 'vocab', name: 'Vocabulary', icon: '📚', color: '#8b5cf6', desc: 'Words in context' },
  { id: 'reading', name: 'Reading Comprehension', icon: '📖', color: '#3b82f6', desc: 'Passages and questions' },
  { id: 'writing-mechanics', name: 'Writing Mechanics', icon: '✏️', color: '#10b981', desc: 'Spelling, punctuation, grammar' },
  { id: 'writing-concepts', name: 'Writing Concepts', icon: '📝', color: '#14b8a6', desc: 'Organization and style' },
  { id: 'quant', name: 'Quantitative Reasoning', icon: '🔢', color: '#f59e0b', desc: 'Patterns and comparisons' },
  { id: 'math', name: 'Mathematics', icon: '➗', color: '#ef4444', desc: 'Computation and problem solving' },
];

// ── VERBAL REASONING ──
export const VERBAL_QUESTIONS = [
  // Analogies
  {
    id: 'v1', type: 'analogy',
    question: 'HOARD : DISPERSE ::',
    choices: ['obtain : acquire', 'oppose : disapprove', 'save : spend', 'donate : support'],
    answer: 2,
    explanation: 'HOARD and DISPERSE are opposites (collect vs. scatter). SAVE and SPEND are also opposites.',
  },
  {
    id: 'v2', type: 'analogy',
    question: 'AUTHOR : NOVEL ::',
    choices: ['painter : brush', 'composer : symphony', 'actor : stage', 'chef : kitchen'],
    answer: 1,
    explanation: 'An AUTHOR creates a NOVEL. A COMPOSER creates a SYMPHONY. The relationship is creator to creation.',
  },
  {
    id: 'v3', type: 'analogy',
    question: 'WHISPER : SHOUT ::',
    choices: ['walk : move', 'drizzle : downpour', 'speak : talk', 'read : write'],
    answer: 1,
    explanation: 'WHISPER is a quiet version of speaking; SHOUT is a loud version. DRIZZLE is light rain; DOWNPOUR is heavy rain. Both pairs show degree.',
  },
  {
    id: 'v4', type: 'analogy',
    question: 'TELESCOPE : ASTRONOMER ::',
    choices: ['hammer : nail', 'stethoscope : doctor', 'book : library', 'shoe : runner'],
    answer: 1,
    explanation: 'A TELESCOPE is the tool an ASTRONOMER uses. A STETHOSCOPE is the tool a DOCTOR uses. Tool to professional.',
  },
  {
    id: 'v5', type: 'analogy',
    question: 'PETAL : FLOWER ::',
    choices: ['root : tree', 'page : book', 'ocean : wave', 'cloud : sky'],
    answer: 1,
    explanation: 'A PETAL is a part of a FLOWER. A PAGE is a part of a BOOK. Part to whole relationship.',
  },
  {
    id: 'v6', type: 'analogy',
    question: 'FAMISHED : HUNGRY ::',
    choices: ['tired : sleepy', 'furious : annoyed', 'happy : glad', 'cold : freezing'],
    answer: 1,
    explanation: 'FAMISHED is an extreme form of HUNGRY. FURIOUS is an extreme form of ANNOYED. Both show degree of intensity.',
  },
  {
    id: 'v7', type: 'analogy',
    question: 'CALF : COW ::',
    choices: ['puppy : dog', 'cat : kitten', 'bird : nest', 'fish : water'],
    answer: 0,
    explanation: 'A CALF is a young COW. A PUPPY is a young DOG. Young animal to adult animal.',
  },
  {
    id: 'v8', type: 'analogy',
    question: 'ISLAND : OCEAN ::',
    choices: ['mountain : valley', 'oasis : desert', 'river : bridge', 'forest : meadow'],
    answer: 1,
    explanation: 'An ISLAND is surrounded by OCEAN. An OASIS is surrounded by DESERT. Something surrounded by its environment.',
  },
  // Categorization
  {
    id: 'v9', type: 'category',
    question: 'Which word does NOT belong with the others?',
    context: 'planet, spaceship, meteor, asteroid',
    choices: ['planet', 'spaceship', 'meteor', 'asteroid'],
    answer: 1,
    explanation: 'Planets, meteors, and asteroids are natural objects found in space. A spaceship is man-made.',
  },
  {
    id: 'v10', type: 'category',
    question: 'Which word does NOT belong with the others?',
    context: 'violin, trumpet, cello, harp',
    choices: ['violin', 'trumpet', 'cello', 'harp'],
    answer: 1,
    explanation: 'Violin, cello, and harp are all stringed instruments. A trumpet is a brass instrument.',
  },
  {
    id: 'v11', type: 'category',
    question: 'Which word does NOT belong with the others?',
    context: 'biography, autobiography, memoir, novel',
    choices: ['biography', 'autobiography', 'memoir', 'novel'],
    answer: 3,
    explanation: 'Biography, autobiography, and memoir are all nonfiction about real people\'s lives. A novel is fiction.',
  },
  {
    id: 'v12', type: 'category',
    question: 'Which word does NOT belong with the others?',
    context: 'evaporation, condensation, precipitation, irrigation',
    choices: ['evaporation', 'condensation', 'precipitation', 'irrigation'],
    answer: 3,
    explanation: 'Evaporation, condensation, and precipitation are all parts of the natural water cycle. Irrigation is a man-made process.',
  },
  {
    id: 'v13', type: 'category',
    question: 'Which would be the best heading for this group?',
    context: 'marble, granite, limestone, sandstone',
    choices: ['Building materials', 'Types of rock', 'Things found underground', 'Heavy objects'],
    answer: 1,
    explanation: 'All four are specific types of rock. "Building materials" and "Heavy objects" are too broad, and "Things found underground" is not the most specific grouping.',
  },
  // Logic
  {
    id: 'v14', type: 'logic',
    question: 'If all citrus fruits are a good source of Vitamin C, and tangerines are a type of citrus fruit, then:',
    choices: [
      'all citrus fruits are tangerines',
      'all citrus fruits have a lot of potassium',
      'all tangerines are a good source of Vitamin C',
      'tangerines have more Vitamin C than other citrus fruits',
    ],
    answer: 2,
    explanation: 'If ALL citrus fruits have Vitamin C, and tangerines ARE citrus fruits, then tangerines must have Vitamin C. The other options go beyond what the premises tell us.',
  },
  {
    id: 'v15', type: 'logic',
    question: 'Sylvia notices that when her alarm clock goes off, her dog Spot picks up his food dish. She concludes Spot thinks the alarm means it\'s time to eat. Which is the best way to test this?',
    choices: [
      'Give Spot a different food in the morning and see if he picks up his dish',
      'Wait until Spot picks up his dish, then set off the alarm',
      'Set the alarm off at different times of day and see if Spot picks up his dish',
      'Play a different alarm each day for a week and then feed Spot',
    ],
    answer: 2,
    explanation: 'To test if the alarm causes the behavior, you need to change when the alarm sounds and see if the behavior follows. Only option C isolates the variable.',
  },
  {
    id: 'v16', type: 'logic',
    question: 'If most mountains have jagged peaks, and Stowe is a mountain in Vermont, then:',
    choices: [
      'Stowe is the only mountain in Vermont with a jagged peak',
      'All things with peaks are mountains',
      'Stowe is probably over 15,000 feet high',
      'Stowe probably has a jagged peak',
    ],
    answer: 3,
    explanation: 'Since MOST mountains have jagged peaks and Stowe IS a mountain, it PROBABLY has a jagged peak. "Probably" matches "most." The other options make claims not supported by the premises.',
  },
  {
    id: 'v17', type: 'logic',
    question: 'All rectangles have four sides. All squares are rectangles. Therefore:',
    choices: [
      'All four-sided shapes are rectangles',
      'All squares have four sides',
      'All rectangles are squares',
      'Some rectangles have five sides',
    ],
    answer: 1,
    explanation: 'If all rectangles have four sides AND all squares are rectangles, then all squares must have four sides. Option A reverses the logic. Option C reverses the subset relationship.',
  },
  {
    id: 'v18', type: 'logic',
    question: 'Maya found that her plants grew faster when she played music. Which experiment would BEST test whether music causes faster growth?',
    choices: [
      'Play music for all her plants and measure how fast they grow',
      'Grow two identical groups of plants — one with music, one without — and compare their growth',
      'Ask other gardeners if they play music for their plants',
      'Play different types of music and see which plants look healthiest',
    ],
    answer: 1,
    explanation: 'A proper experiment needs a control group (no music) and a test group (with music) to compare. Only option B includes both.',
  },
  {
    id: 'v19', type: 'analogy',
    question: 'MIGRATE : BIRD ::',
    choices: ['swim : fish', 'hibernate : bear', 'bark : dog', 'gallop : horse'],
    answer: 1,
    explanation: 'MIGRATE is a seasonal behavior of BIRDS. HIBERNATE is a seasonal behavior of BEARS. Both describe instinctive seasonal actions.',
  },
  {
    id: 'v20', type: 'analogy',
    question: 'CHAPTER : BOOK ::',
    choices: ['verse : poem', 'word : letter', 'cover : magazine', 'shelf : library'],
    answer: 0,
    explanation: 'A CHAPTER is a section of a BOOK. A VERSE is a section of a POEM. Part to whole.',
  },
  {
    id: 'v21', type: 'category',
    question: 'Which word does NOT belong with the others?',
    context: 'simile, metaphor, personification, paragraph',
    choices: ['simile', 'metaphor', 'personification', 'paragraph'],
    answer: 3,
    explanation: 'Simile, metaphor, and personification are all figures of speech (literary devices). A paragraph is a structural unit of writing.',
  },
  {
    id: 'v22', type: 'logic',
    question: 'No reptiles have fur. All dogs have fur. Therefore:',
    choices: [
      'No dogs are reptiles',
      'All animals with fur are dogs',
      'Some reptiles are dogs',
      'All animals without fur are reptiles',
    ],
    answer: 0,
    explanation: 'If NO reptiles have fur and ALL dogs DO have fur, then no dogs can be reptiles. The other options go beyond the premises.',
  },
  {
    id: 'v23', type: 'analogy',
    question: 'ANCIENT : MODERN ::',
    choices: ['tall : short', 'quick : fast', 'bright : shiny', 'large : huge'],
    answer: 0,
    explanation: 'ANCIENT and MODERN are antonyms (opposites in time). TALL and SHORT are antonyms (opposites in height).',
  },
  {
    id: 'v24', type: 'category',
    question: 'Which would be the best heading for this group?',
    context: 'democracy, monarchy, dictatorship, republic',
    choices: ['Things in history', 'Types of government', 'Political parties', 'Ways to vote'],
    answer: 1,
    explanation: 'Democracy, monarchy, dictatorship, and republic are all forms of government. The other options are too broad or incorrect.',
  },
  {
    id: 'v25', type: 'analogy',
    question: 'RECIPE : CHEF ::',
    choices: ['blueprint : architect', 'paint : wall', 'hammer : carpenter', 'song : radio'],
    answer: 0,
    explanation: 'A RECIPE guides a CHEF\'s work. A BLUEPRINT guides an ARCHITECT\'s work. Both are plans used by professionals.',
  },
  {
    id: 'v26', type: 'logic',
    question: 'Liam noticed that every time he waters the plant, it grows taller the next week. He concludes that watering causes growth. What would WEAKEN this conclusion?',
    choices: [
      'The plant also gets sunlight every day',
      'Other plants in the garden also grew',
      'Plants that weren\'t watered grew the same amount',
      'Liam uses a watering can',
    ],
    answer: 2,
    explanation: 'If plants that WEREN\'T watered grew the same amount, then watering isn\'t the cause — something else is. This directly weakens the cause-effect conclusion.',
  },
  {
    id: 'v27', type: 'category',
    question: 'Which word does NOT belong with the others?',
    context: 'peninsula, island, continent, mountain',
    choices: ['peninsula', 'island', 'continent', 'mountain'],
    answer: 3,
    explanation: 'Peninsula, island, and continent are all landforms defined by their relationship to water. A mountain is defined by elevation, not water.',
  },
  {
    id: 'v28', type: 'analogy',
    question: 'CAPTAIN : SHIP ::',
    choices: ['pilot : airplane', 'passenger : bus', 'wheel : car', 'track : train'],
    answer: 0,
    explanation: 'A CAPTAIN commands a SHIP. A PILOT commands an AIRPLANE. Person who controls a vehicle.',
  },
  {
    id: 'v29', type: 'logic',
    question: 'Some athletes are tall. All basketball players are athletes. Therefore:',
    choices: [
      'All basketball players are tall',
      'Some basketball players might be tall',
      'No basketball players are short',
      'All tall people are basketball players',
    ],
    answer: 1,
    explanation: 'Since only SOME athletes are tall, and basketball players are athletes, some basketball players MIGHT be tall — but we can\'t say ALL are. "Some" doesn\'t guarantee it applies to any specific subset.',
  },
  {
    id: 'v30', type: 'analogy',
    question: 'COCOON : BUTTERFLY ::',
    choices: ['egg : chicken', 'seed : flower', 'cave : bat', 'shell : turtle'],
    answer: 1,
    explanation: 'A COCOON is the stage before a BUTTERFLY emerges (transformation). A SEED is the stage before a FLOWER grows. Both show stages of development.',
  },
];

// ── VOCABULARY ──
export const VOCAB_QUESTIONS = [
  {
    id: 'vc1', type: 'context',
    question: 'Brandon stands behind a tree to hide from his big sister. He remains ______ so that his sister does not see him move.',
    choices: ['apparent', 'casual', 'nimble', 'stationary'],
    answer: 3,
    explanation: '"Stationary" means not moving — exactly what you\'d need to do while hiding. "Apparent" means visible (the opposite). "Nimble" means quick. "Casual" means relaxed.',
  },
  {
    id: 'vc2', type: 'context',
    question: 'Bicyclists must remain ______ to ______ around obstacles on the road.',
    choices: ['amiable ... navigate', 'composed ... ascend', 'attentive ... maneuver', 'resourceful ... journey'],
    answer: 2,
    explanation: '"Attentive" (paying attention) and "maneuver" (steer carefully around) both fit perfectly. "Amiable" means friendly — not relevant. "Ascend" means go up.',
  },
  {
    id: 'vc3', type: 'context',
    question: 'The explorers were ______ when they finally reached the summit after months of dangerous climbing.',
    choices: ['exhausted', 'elated', 'bewildered', 'reluctant'],
    answer: 1,
    explanation: '"Elated" means extremely happy — the right feeling after achieving a difficult goal. "Exhausted" might be true but doesn\'t capture the emotion of success. "Bewildered" means confused. "Reluctant" means unwilling.',
  },
  {
    id: 'vc4', type: 'context',
    question: 'The teacher asked the students to ______ their essays before submitting them, checking for any errors in spelling or grammar.',
    choices: ['compose', 'revise', 'distribute', 'illustrate'],
    answer: 1,
    explanation: '"Revise" means to review and correct — exactly what checking for errors involves. "Compose" means to write for the first time. "Distribute" means to hand out. "Illustrate" means to add pictures.',
  },
  {
    id: 'vc5', type: 'context',
    question: 'Dr. Martin Luther King, Jr., an advocate of nonviolent protest, never ______ his belief in this form of resistance.',
    choices: ['conquered', 'acknowledged', 'abandoned', 'maintained'],
    answer: 2,
    explanation: 'The sentence says he "never ______" his belief — meaning he never gave it up. "Abandoned" means gave up. "Never abandoned" = always kept. Don\'t be tricked by "maintained," which would need the sentence to NOT have "never."',
  },
  {
    id: 'vc6', type: 'precision',
    question: 'The old bridge was ______ and could collapse at any moment.',
    choices: ['unstable', 'unusual', 'uncertain', 'uncomfortable'],
    answer: 0,
    explanation: '"Unstable" means not firmly fixed, likely to give way — exactly right for a bridge that might collapse. The other words start with "un-" but have different meanings.',
  },
  {
    id: 'vc7', type: 'context',
    question: 'Although the detective found several clues, the mystery remained ______.',
    choices: ['resolved', 'unsolved', 'simple', 'visible'],
    answer: 1,
    explanation: '"Although" signals a contrast — despite finding clues, the mystery was still NOT solved. "Unsolved" is the only word that creates this contrast.',
  },
  {
    id: 'vc8', type: 'precision',
    question: 'The gymnast performed a ______ routine, landing every flip perfectly.',
    choices: ['flawless', 'adequate', 'reasonable', 'ordinary'],
    answer: 0,
    explanation: '"Flawless" means without any mistakes — matching "landing every flip perfectly." "Adequate" means just good enough. "Reasonable" and "ordinary" don\'t convey perfection.',
  },
  {
    id: 'vc9', type: 'context',
    question: 'The ______ student always arrived early, completed homework on time, and studied for every test.',
    choices: ['rebellious', 'diligent', 'timid', 'creative'],
    answer: 1,
    explanation: '"Diligent" means hardworking and careful — perfectly describing someone who is early, on time, and studies. "Rebellious" means defiant. "Timid" means shy. "Creative" doesn\'t match the described behaviors.',
  },
  {
    id: 'vc10', type: 'context',
    question: 'The heavy rain caused the river to ______, flooding the nearby fields.',
    choices: ['evaporate', 'overflow', 'freeze', 'recede'],
    answer: 1,
    explanation: 'Heavy rain would cause a river to "overflow" (rise above its banks), which leads to flooding. "Evaporate" means turn to gas. "Recede" means go down — the opposite.',
  },
  {
    id: 'vc11', type: 'precision',
    question: 'The diplomat spoke with great ______, choosing each word carefully to avoid offending anyone.',
    choices: ['volume', 'speed', 'tact', 'humor'],
    answer: 2,
    explanation: '"Tact" means skill in dealing with others without giving offense — exactly what "choosing words carefully to avoid offending" describes.',
  },
  {
    id: 'vc12', type: 'context',
    question: 'The scientist\'s theory was ______ by the new evidence, which showed her predictions were correct.',
    choices: ['contradicted', 'validated', 'complicated', 'ignored'],
    answer: 1,
    explanation: 'If evidence shows predictions were correct, the theory is "validated" (confirmed/proven right). "Contradicted" would mean the evidence went against the theory.',
  },
  {
    id: 'vc13', type: 'context',
    question: 'Unlike her ______ older sister, Maya was outgoing and loved meeting new people.',
    choices: ['reserved', 'generous', 'athletic', 'cheerful'],
    answer: 0,
    explanation: '"Unlike" signals a contrast with "outgoing." "Reserved" means quiet and shy — the opposite of outgoing. This is the contrast the sentence sets up.',
  },
  {
    id: 'vc14', type: 'precision',
    question: 'The ruins of the ancient temple were ______ by vines and moss after centuries of neglect.',
    choices: ['decorated', 'obscured', 'improved', 'surrounded'],
    answer: 1,
    explanation: '"Obscured" means hidden from view — vines and moss covering ruins would hide them. "Decorated" implies intentional beautification. "Surrounded" is close but doesn\'t capture being covered/hidden.',
  },
  {
    id: 'vc15', type: 'context',
    question: 'The ______ between the two rival teams was obvious as they refused to shake hands after the game.',
    choices: ['alliance', 'animosity', 'confusion', 'similarity'],
    answer: 1,
    explanation: '"Animosity" means strong hostility or hatred. Rivals refusing to shake hands shows hostility. "Alliance" means partnership — the opposite.',
  },
  {
    id: 'vc16', type: 'context',
    question: 'The magician\'s trick was so ______ that even the adults in the audience couldn\'t figure out how it was done.',
    choices: ['transparent', 'ingenious', 'familiar', 'simple'],
    answer: 1,
    explanation: '"Ingenious" means cleverly inventive — a trick so clever that even adults can\'t figure it out. "Transparent" means easy to see through — the opposite.',
  },
  {
    id: 'vc17', type: 'precision',
    question: 'After the long drought, the farmers were ______ to see rain clouds forming on the horizon.',
    choices: ['reluctant', 'indifferent', 'grateful', 'suspicious'],
    answer: 2,
    explanation: 'After a drought, farmers would be "grateful" (thankful) for rain. "Reluctant" means unwilling. "Indifferent" means not caring.',
  },
  {
    id: 'vc18', type: 'context',
    question: 'The new policy was met with ______ from the community, as most people thought it was unfair.',
    choices: ['enthusiasm', 'opposition', 'curiosity', 'approval'],
    answer: 1,
    explanation: 'If people thought the policy was unfair, they would show "opposition" (resistance/disagreement). "Enthusiasm" and "approval" would mean they liked it.',
  },
];

// ── READING COMPREHENSION ──
export const READING_PASSAGES = [
  {
    id: 'rp1',
    title: 'The Planets',
    text: `Our solar system contains eight planets, each with unique characteristics. The four inner planets — Mercury, Venus, Earth, and Mars — are called terrestrial planets because they have solid, rocky surfaces. The four outer planets — Jupiter, Saturn, Uranus, and Neptune — are called gas giants because they are made mostly of gases like hydrogen and helium.

Earth and Jupiter could hardly be more different. Earth has a solid surface where people can walk, liquid water in its oceans, and an atmosphere that supports life. Jupiter, on the other hand, has no solid surface at all. It is a swirling mass of gases with storms larger than our entire planet. The Great Red Spot, a storm on Jupiter, has been raging for hundreds of years and is big enough to fit two Earths inside it.

Despite these differences, both planets share some similarities. Both have magnetic fields that protect them from harmful solar radiation. Both have moons — Earth has one, while Jupiter has at least 95. And both orbit the same star, following the invisible pull of the Sun's gravity.

Scientists continue to study these planets using telescopes and space probes, hoping to learn more about how our solar system formed billions of years ago.`,
    questions: [
      {
        id: 'r1', question: 'What is the main idea of paragraph 2?',
        choices: [
          'Earth has a solid surface and liquid water',
          'Jupiter has much more gravity than Earth',
          'Jupiter is more interesting to study than Earth',
          'Earth and Jupiter have very different physical properties',
        ],
        answer: 3,
        explanation: 'Paragraph 2 compares Earth and Jupiter, showing their differences. Options A and B are single details, not the main idea. Option C is an opinion not stated in the passage.',
      },
      {
        id: 'r2', question: 'What is the main organizational pattern in paragraphs 2 and 3?',
        choices: [
          'A list of examples of all the planets',
          'Comparison and contrast of two planets',
          'The effects two planets have on each other',
          'The order in which the planets were formed',
        ],
        answer: 1,
        explanation: 'Paragraphs 2 and 3 compare (similarities) and contrast (differences) Earth and Jupiter. The passage directly uses words like "different" and "similarities."',
      },
      {
        id: 'r3', question: 'According to the passage, what do Earth and Jupiter have in common?',
        choices: [
          'They both have solid surfaces',
          'They both have magnetic fields',
          'They both have liquid water',
          'They are both terrestrial planets',
        ],
        answer: 1,
        explanation: 'The passage directly states "Both have magnetic fields that protect them from harmful solar radiation." Earth has a solid surface and water; Jupiter does not.',
      },
      {
        id: 'r4', question: 'Which of the following is an OPINION, not a fact?',
        choices: [
          'The Great Red Spot has been raging for hundreds of years',
          'Jupiter is more interesting to study than Earth',
          'Both planets orbit the same star',
          'Earth has liquid water in its oceans',
        ],
        answer: 1,
        explanation: '"More interesting" is a judgment — it can\'t be proven true or false. The other statements are verifiable facts from the passage.',
      },
    ],
  },
  {
    id: 'rp2',
    title: 'The Art of Pointillism',
    text: `In 1886, a young French painter named Georges Seurat shocked the art world with a new technique he called Pointillism. Instead of blending colors on his palette like other artists, Seurat placed tiny dots of pure color side by side on the canvas. When viewed from a distance, the viewer's eye would blend these dots together, creating the illusion of mixed colors that seemed to shimmer and glow.

Seurat developed this technique based on scientific theories about how the human eye perceives color. He studied the work of scientists who had discovered that colors placed next to each other can influence how we see them. A dot of blue next to a dot of yellow, for example, would appear green when seen from far enough away.

Not everyone appreciated this revolutionary approach. Many art critics dismissed Pointillism as mechanical and tedious. They argued that spending months placing individual dots removed the emotion and spontaneity from painting. One critic called Seurat's masterpiece, "A Sunday Afternoon on the Island of La Grande Jatte," nothing more than a scientific experiment disguised as art.

Despite the criticism, Seurat's work influenced generations of artists who came after him. His ideas about color theory became foundational in art education. Today, his paintings hang in the world's greatest museums, and Pointillism is recognized as an important step in the evolution of modern art.`,
    questions: [
      {
        id: 'r5', question: 'Why did Seurat place dots of color side by side instead of blending them?',
        choices: [
          'He couldn\'t afford to buy enough paint to blend colors',
          'He wanted to create colors that appeared to shimmer and glow',
          'Other artists told him this was the best technique',
          'He wanted his paintings to look different up close than far away',
        ],
        answer: 1,
        explanation: 'The passage says the dots created "the illusion of mixed colors that seemed to shimmer and glow." While D is partially true, the passage emphasizes the shimmer/glow effect as his goal.',
      },
      {
        id: 'r6', question: 'With which statement would the author MOST LIKELY agree?',
        choices: [
          'Pointillism was a failure that is now forgotten',
          'Art critics were right to dismiss Pointillism',
          'Seurat\'s work was both controversial and influential',
          'Pointillism is the most important art movement in history',
        ],
        answer: 2,
        explanation: 'The passage shows both criticism (controversial) and lasting impact (influential). The final paragraph confirms his influence on later artists and art education.',
      },
      {
        id: 'r7', question: 'What does the word "foundational" mean in the last paragraph?',
        choices: [
          'Optional and rarely used',
          'Forming a base or starting point',
          'Old-fashioned and outdated',
          'Complicated and hard to understand',
        ],
        answer: 1,
        explanation: '"Foundational" comes from "foundation" — the base something is built on. His color theory ideas became a base for art education.',
      },
      {
        id: 'r8', question: 'Why did critics call Seurat\'s work "a scientific experiment disguised as art"?',
        choices: [
          'Seurat had trained as a scientist, not an artist',
          'The paintings looked exactly like photographs',
          'They thought placing individual dots was mechanical, not emotional',
          'Seurat published his findings in a science journal',
        ],
        answer: 2,
        explanation: 'The passage says critics argued that "spending months placing individual dots removed the emotion and spontaneity from painting." They saw it as too mechanical/scientific.',
      },
    ],
  },
  {
    id: 'rp3',
    title: 'Monarch Migration',
    text: `Every fall, millions of monarch butterflies begin one of the most remarkable journeys in the natural world. These delicate insects, each weighing less than a paperclip, travel up to 3,000 miles from their summer homes in the United States and Canada to their winter roosts in the mountains of central Mexico.

What makes this migration even more extraordinary is that no single butterfly completes the round trip. The monarchs that fly south in autumn are the great-great-grandchildren of the ones that flew north the previous spring. Yet somehow, they find their way to the exact same trees their ancestors used — trees they have never seen before.

Scientists have discovered that monarchs navigate using a combination of the sun's position and the Earth's magnetic field. They have an internal compass built into their antennae that senses magnetic direction, and a kind of clock in their brain that adjusts for the sun's movement across the sky. Together, these tools create a GPS-like system that guides them to their destination.

The monarch migration is now under threat. Logging in Mexico's forests has destroyed some of their traditional roosts. Herbicides used on farms in the United States have killed milkweed — the only plant where monarchs lay their eggs. Conservation groups are working to protect the forests and encourage people to plant milkweed in their gardens.`,
    questions: [
      {
        id: 'r9', question: 'What is the author\'s main purpose in writing this passage?',
        choices: [
          'To persuade readers to plant milkweed gardens',
          'To inform readers about monarch migration and the threats to it',
          'To entertain readers with a story about butterflies',
          'To argue that logging should be banned in Mexico',
        ],
        answer: 1,
        explanation: 'The passage primarily informs — it explains the migration, how butterflies navigate, and what threatens them. While it mentions conservation, that\'s only the last paragraph, not the main purpose.',
      },
      {
        id: 'r10', question: 'Why is it extraordinary that monarchs find the same trees each year?',
        choices: [
          'Because the trees move to different locations',
          'Because the butterflies that arrive have never been there before',
          'Because the trees are hidden deep underground',
          'Because butterflies cannot see well enough to find trees',
        ],
        answer: 1,
        explanation: 'The passage says "no single butterfly completes the round trip" — the returning butterflies are great-great-grandchildren who have "never seen" those trees. That\'s what makes it extraordinary.',
      },
      {
        id: 'r11', question: 'Based on the passage, what would MOST LIKELY happen if a monarch\'s antennae were damaged?',
        choices: [
          'It would fly faster to make up for lost time',
          'It would have difficulty navigating to Mexico',
          'It would stop migrating entirely and stay in one place',
          'It would use sound instead of magnetism to navigate',
        ],
        answer: 1,
        explanation: 'The passage says monarchs have "an internal compass built into their antennae." If damaged, they\'d lose part of their navigation system, making it harder to find their way.',
      },
      {
        id: 'r12', question: 'Which detail from the passage BEST supports the idea that the monarch migration is in danger?',
        choices: [
          'Monarchs weigh less than a paperclip',
          'They travel up to 3,000 miles',
          'Herbicides have killed the only plant where they lay their eggs',
          'They use the sun\'s position to navigate',
        ],
        answer: 2,
        explanation: 'Destroying the ONLY plant where monarchs reproduce directly threatens the species. The other details are about the migration itself, not about threats to it.',
      },
    ],
  },
  {
    id: 'rp4',
    title: 'Underground Railroad',
    text: `The Underground Railroad was neither underground nor a railroad. It was a secret network of routes, safe houses, and brave people who helped enslaved African Americans escape to freedom in the Northern states and Canada before the Civil War. The network used railroad terms as code: safe houses were called "stations," the people who guided escapees were "conductors," and the escapees themselves were "passengers."

Harriet Tubman is the most famous conductor of the Underground Railroad. After escaping slavery herself in 1849, she returned to the South at least 13 times to lead approximately 70 people to freedom. She traveled at night, following the North Star, and used songs with hidden messages to communicate with those she was helping. Despite a $40,000 reward for her capture — an enormous sum at the time — she was never caught and never lost a single passenger.

The journey was extremely dangerous. Escapees traveled through swamps, forests, and fields, often walking 10 to 20 miles between stations. They faced slave catchers with dogs, freezing temperatures, and the constant threat of betrayal. If caught, escapees could be severely punished or sold to plantations even farther south.

The people who operated stations risked their own freedom as well. Under the Fugitive Slave Act of 1850, anyone caught helping an escapee could be fined or imprisoned. Despite this, thousands of Americans — both Black and white — chose to help, believing that the moral duty to fight slavery was greater than the obligation to follow an unjust law.`,
    questions: [
      {
        id: 'r13', question: 'Why did the Underground Railroad use railroad terminology?',
        choices: [
          'Because the escapees traveled by train',
          'Because the organizers had all worked for railroad companies',
          'To communicate secretly using code words',
          'Because the government required them to register as a railroad',
        ],
        answer: 2,
        explanation: 'The passage says the network "used railroad terms as code." Code words helped keep the network secret from slave catchers and authorities.',
      },
      {
        id: 'r14', question: 'What can you INFER about why Tubman traveled at night?',
        choices: [
          'She preferred cooler temperatures',
          'It was harder for slave catchers to spot escapees in darkness',
          'The North Star was only visible at night, and she used it to navigate',
          'Both B and C are likely reasons',
        ],
        answer: 3,
        explanation: 'The passage mentions she followed the North Star (only visible at night) AND traveling at night provides cover from slave catchers. Both reasons are supported by the passage.',
      },
      {
        id: 'r15', question: 'What does the phrase "never lost a single passenger" tell you about Tubman?',
        choices: [
          'She only helped small groups of people',
          'She was exceptionally skilled and careful in her work',
          'The journey was not actually very dangerous',
          'Slave catchers were not actively searching for her',
        ],
        answer: 1,
        explanation: 'Given the extreme danger described (dogs, freezing temperatures, $40,000 reward), never losing anyone shows exceptional skill and care — not that it was easy.',
      },
      {
        id: 'r16', question: 'According to the final paragraph, what motivated station operators to break the law?',
        choices: [
          'They were paid well for their help',
          'They wanted to impress their neighbors',
          'They believed fighting slavery was morally right, even if illegal',
          'They didn\'t know the Fugitive Slave Act existed',
        ],
        answer: 2,
        explanation: 'The passage directly states they believed "the moral duty to fight slavery was greater than the obligation to follow an unjust law."',
      },
    ],
  },
];

// ── WRITING MECHANICS ──
export const WRITING_MECH_QUESTIONS = [
  // Spelling
  {
    id: 'wm1', type: 'spelling',
    question: 'Which word is spelled INCORRECTLY?',
    choices: ['soldier', 'separate', 'exagerate', 'necessary'],
    answer: 2,
    explanation: 'The correct spelling is "exaggerate" — with two g\'s. This is one of the most commonly misspelled words.',
  },
  {
    id: 'wm2', type: 'spelling',
    question: 'Which word is spelled INCORRECTLY?',
    choices: ['occurrence', 'definately', 'argument', 'rhythm'],
    answer: 1,
    explanation: 'The correct spelling is "definitely" — not "definately." Remember: "finite" is in the middle.',
  },
  {
    id: 'wm3', type: 'spelling',
    question: 'Which word is spelled INCORRECTLY?',
    choices: ['receive', 'believe', 'acheive', 'retrieve'],
    answer: 2,
    explanation: 'The correct spelling is "achieve." Remember: "I before E except after C" — but "achieve" doesn\'t have a C, so it\'s I before E.',
  },
  {
    id: 'wm4', type: 'spelling',
    question: 'Which word is spelled INCORRECTLY?',
    choices: ['environment', 'goverment', 'development', 'equipment'],
    answer: 1,
    explanation: 'The correct spelling is "government" — don\'t forget the N in the middle: "govern" + "ment."',
  },
  // Punctuation
  {
    id: 'wm5', type: 'punctuation',
    question: 'Which sentence has a punctuation error?',
    choices: [
      'The dog\'s bone was buried in the yard.',
      'The childrens\' museum was full of exhibits.',
      'It\'s going to rain tomorrow.',
      'The three boys\' bikes were left outside.',
    ],
    answer: 1,
    explanation: '"Children" is already plural, so the possessive is "children\'s" (apostrophe before the S), not "childrens\'" (apostrophe after the S).',
  },
  {
    id: 'wm6', type: 'punctuation',
    question: 'Which sentence uses commas correctly?',
    choices: [
      'We need eggs milk and bread from the store.',
      'We need eggs, milk, and bread from the store.',
      'We need, eggs milk and, bread from the store.',
      'We need eggs milk, and bread from the store.',
    ],
    answer: 1,
    explanation: 'Items in a list need commas between them: "eggs, milk, and bread." The comma before "and" (Oxford comma) is correct.',
  },
  {
    id: 'wm7', type: 'punctuation',
    question: 'Which sentence has a punctuation error?',
    choices: [
      '"Where are you going?" asked Mom.',
      '"I\'m going to the park," said Jake.',
      '"Be careful" she reminded him.',
      '"I will!" he shouted back.',
    ],
    answer: 2,
    explanation: 'A comma or other punctuation must come before the closing quotation marks when followed by a dialogue tag: "Be careful," she reminded him.',
  },
  // Usage / Grammar
  {
    id: 'wm8', type: 'usage',
    question: 'Christopher went to the store and bought a book using ______ own pocket money.',
    choices: ['your', 'their', 'its', 'his'],
    answer: 3,
    explanation: 'The pronoun must refer back to "Christopher" — a single male. "His" is the correct singular masculine pronoun.',
  },
  {
    id: 'wm9', type: 'usage',
    question: 'Which sentence is a run-on and should be two sentences?',
    choices: [
      'When I found my missing dog, I was so happy.',
      'To make my dad proud, I cleaned my room.',
      'My head hurt and I was tired, but I studied anyway.',
      'I helped my teacher put away chairs because I couldn\'t go to recess, I had a cold.',
    ],
    answer: 3,
    explanation: 'Option D joins two complete sentences with just a comma — that\'s a comma splice (run-on). It should be: "...recess. I had a cold." or "...recess because I had a cold."',
  },
  {
    id: 'wm10', type: 'usage',
    question: 'The children were eating lunch in their backyard ______ it began to rain.',
    choices: ['so', 'because', 'soon', 'when'],
    answer: 3,
    explanation: '"When" correctly establishes the time relationship — they were eating, and then it started raining.',
  },
  {
    id: 'wm11', type: 'usage',
    question: 'Neither the teacher ______ the students were ready for the fire drill.',
    choices: ['or', 'and', 'nor', 'but'],
    answer: 2,
    explanation: '"Neither...nor" is the correct pairing. "Neither...or" is grammatically incorrect.',
  },
  {
    id: 'wm12', type: 'usage',
    question: 'Each of the girls ______ her own locker.',
    choices: ['have', 'has', 'are having', 'were having'],
    answer: 1,
    explanation: '"Each" is singular, so it needs the singular verb "has." Don\'t be tricked by "girls" (plural) — "Each" is the subject.',
  },
  {
    id: 'wm13', type: 'spelling',
    question: 'Which word is spelled INCORRECTLY?',
    choices: ['privilege', 'mischievous', 'accomodate', 'extraordinary'],
    answer: 2,
    explanation: 'The correct spelling is "accommodate" — with two C\'s and two M\'s.',
  },
  {
    id: 'wm14', type: 'punctuation',
    question: 'Which sentence uses an apostrophe correctly?',
    choices: [
      'The cat chased it\'s tail around the room.',
      'The two sister\'s shared a bedroom.',
      'The team celebrated its first victory.',
      'She bought three apple\'s at the market.',
    ],
    answer: 2,
    explanation: '"Its" (no apostrophe) is the possessive form. "It\'s" means "it is." The team didn\'t celebrate "it is" victory — it celebrated the victory belonging to it.',
  },
  {
    id: 'wm15', type: 'usage',
    question: 'Sarah and ______ went to the movies after school.',
    choices: ['me', 'I', 'myself', 'her'],
    answer: 1,
    explanation: '"Sarah and I" is correct because it\'s the subject of the sentence (doing the action). Test it by removing "Sarah and" — you\'d say "I went to the movies," not "Me went."',
  },
  {
    id: 'wm16', type: 'usage',
    question: 'The dog ran ______ than the cat.',
    choices: ['more faster', 'fastest', 'faster', 'most fast'],
    answer: 2,
    explanation: 'When comparing two things, use the comparative form "faster." "Fastest" is superlative (three or more). "More faster" and "most fast" are incorrect double comparisons.',
  },
  {
    id: 'wm17', type: 'spelling',
    question: 'Which word is spelled INCORRECTLY?',
    choices: ['Wednesday', 'Febuary', 'restaurant', 'surprise'],
    answer: 1,
    explanation: 'The correct spelling is "February" — don\'t forget the first R: "Feb-ru-ary."',
  },
  {
    id: 'wm18', type: 'punctuation',
    question: 'Which title is capitalized correctly?',
    choices: [
      'the lion, The witch, And The wardrobe',
      'The Lion, the Witch, and the Wardrobe',
      'The lion, the witch, and the wardrobe',
      'THE LION, THE WITCH, AND THE WARDROBE',
    ],
    answer: 1,
    explanation: 'In titles, capitalize the first word, last word, and all important words. Don\'t capitalize small words like "the," "and," "a" unless they\'re first.',
  },
];

// ── WRITING CONCEPTS & SKILLS ──
export const WRITING_CONCEPTS_QUESTIONS = [
  {
    id: 'wc1', type: 'organization',
    question: 'These topics for a report on Harriet Tubman are NOT in the correct order:\n1. Growing up on a plantation in the South\n2. Working for the Underground Railroad before the Civil War\n3. Escaping to the North\n4. Serving as a nurse and spy during the Civil War\n\nWhich shows the correct chronological order?',
    choices: ['1, 3, 2, 4', '2, 1, 4, 3', '3, 1, 2, 4', '4, 3, 2, 1'],
    answer: 0,
    explanation: 'Chronological order: First she grew up (1), then escaped (3), then worked on the Underground Railroad (2), then served in the Civil War (4).',
  },
  {
    id: 'wc2', type: 'supporting',
    question: 'The main idea is: "Elizabeth Blackwell was the first woman to become a medical doctor in the United States." Which sentence BEST supports this main idea?',
    choices: [
      'Blackwell moved to America in 1832.',
      'Blackwell lost her sight in one eye.',
      'Blackwell graduated from Geneva Medical College in New York in 1849.',
      'Blackwell was born in Bristol, England in 1821.',
    ],
    answer: 2,
    explanation: 'Only graduating from medical college directly supports the claim about becoming a doctor. The other facts are about her life but don\'t support the "first woman doctor" claim.',
  },
  {
    id: 'wc3', type: 'audience',
    question: 'Which statement would be MOST likely to convince a school principal to start a drama club?',
    choices: [
      'Lots of kids want to be in shows and it would be really fun for everyone!',
      'Participation in drama clubs has been shown to help students achieve higher grades and increase their self-esteem.',
      'It is so unfair that everyone talks about sports but nobody cares about the arts.',
      'Wouldn\'t it be great to go see a student play?',
    ],
    answer: 1,
    explanation: 'A principal needs formal, evidence-based arguments. Option B cites specific benefits (grades, self-esteem). The others are too casual, emotional, or vague for a formal proposal.',
  },
  {
    id: 'wc4', type: 'organization',
    question: 'Read this paragraph:\n"The Amazon rainforest is home to an incredible variety of life. ________. Over 400 species of mammals swing, crawl, and prowl through its trees and floor. The rivers contain over 3,000 species of fish — more than any other river system on Earth."\n\nWhich sentence BEST fills the blank?',
    choices: [
      'The Amazon River is very long.',
      'Scientists estimate it contains over 80,000 plant species.',
      'Rain forests get a lot of rain each year.',
      'Many people live in the Amazon region.',
    ],
    answer: 1,
    explanation: 'The paragraph is about the variety of life (plants, mammals, fish). A sentence about plant species continues this pattern. The other options don\'t support the "variety of life" theme.',
  },
  {
    id: 'wc5', type: 'supporting',
    question: 'Read this paragraph about recycling. Which sentence does NOT belong?\n\n(A) Recycling helps protect the environment in several ways.\n(B) It reduces the amount of waste sent to landfills.\n(C) My neighbor has three different recycling bins.\n(D) It also conserves natural resources like trees and water.',
    choices: ['Sentence A', 'Sentence B', 'Sentence C', 'Sentence D'],
    answer: 2,
    explanation: 'The paragraph is about how recycling helps the environment. "My neighbor has three recycling bins" is a personal detail that doesn\'t support the main idea about environmental benefits.',
  },
  {
    id: 'wc6', type: 'style',
    question: 'Which is the BEST way to combine these two sentences?\n"The storm knocked down several trees. The storm also caused flooding in the streets."',
    choices: [
      'The storm knocked down several trees, the storm also caused flooding.',
      'The storm knocked down several trees and also caused flooding in the streets.',
      'The storm knocked down several trees. And the storm also caused flooding.',
      'Knocking down trees, and flooding the streets, was the storm.',
    ],
    answer: 1,
    explanation: 'Option B combines the sentences smoothly using "and also," avoiding the repeated subject. Option A is a comma splice. Option C starts a sentence with "And." Option D is awkward.',
  },
  {
    id: 'wc7', type: 'audience',
    question: 'Which topic would be MOST appropriate in a report on innovations in transportation since 2000?',
    choices: [
      'A history of the first automobiles in the 1890s',
      'How electric vehicles use battery technology to reduce emissions',
      'A list of every type of vehicle that exists today',
      'Why some people prefer to walk instead of drive',
    ],
    answer: 1,
    explanation: 'The report is about INNOVATIONS (new developments) SINCE 2000. Electric vehicles and battery technology are a recent innovation. The 1890s are too old, a list isn\'t innovative, and walking isn\'t transportation innovation.',
  },
  {
    id: 'wc8', type: 'organization',
    question: 'Which would make the BEST topic sentence for a paragraph about the benefits of reading?',
    choices: [
      'I like to read before bed every night.',
      'Reading regularly strengthens vocabulary, improves focus, and sparks creativity.',
      'Some books are fiction and some are nonfiction.',
      'The library has thousands of books.',
    ],
    answer: 1,
    explanation: 'A topic sentence should state the main idea the paragraph will develop. Option B previews three specific benefits that supporting sentences can elaborate on.',
  },
  {
    id: 'wc9', type: 'style',
    question: 'Which sentence uses the MOST precise language?',
    choices: [
      'The dog went across the yard really fast.',
      'The golden retriever sprinted across the lawn.',
      'The animal moved through the area quickly.',
      'It ran over there.',
    ],
    answer: 1,
    explanation: '"Golden retriever" is more specific than "dog" or "animal." "Sprinted" is more vivid than "went fast" or "moved quickly." "Lawn" is more specific than "yard" or "area."',
  },
  {
    id: 'wc10', type: 'organization',
    question: 'Which transition word BEST connects these ideas?\n"The experiment failed to produce the expected results. ______, the scientists learned valuable information from their mistakes."',
    choices: ['Therefore', 'Similarly', 'Nevertheless', 'Meanwhile'],
    answer: 2,
    explanation: '"Nevertheless" shows contrast — despite the failure, something good came from it. "Therefore" would mean the failure caused them to learn (wrong logic). "Similarly" and "Meanwhile" don\'t fit the contrast.',
  },
  {
    id: 'wc11', type: 'supporting',
    question: 'Which sentence would BEST conclude a paragraph about the importance of sleep for students?',
    choices: [
      'Sleep is one of many things students need.',
      'Getting enough sleep every night can help students perform their best in school and feel healthier overall.',
      'Some students stay up late playing video games.',
      'Adults need about seven to eight hours of sleep.',
    ],
    answer: 1,
    explanation: 'A conclusion should summarize the main point (sleep is important for students) and leave a lasting impression. Option B ties together performance and health. The others don\'t wrap up the topic.',
  },
  {
    id: 'wc12', type: 'audience',
    question: 'A student is writing a letter to a local newspaper about saving a park from development. Which opening would be MOST effective?',
    choices: [
      'Hey everyone, they want to tear down our park and it\'s totally unfair!',
      'Dear Editor, I am writing to express my concern about the proposed development of Riverside Park, a community treasure for over fifty years.',
      'Parks are places where people go. Our park might be taken away.',
      'I don\'t think they should build anything. Parks are better than buildings.',
    ],
    answer: 1,
    explanation: 'A letter to a newspaper editor should be formal, specific, and establish credibility. Option B names the park, provides context (fifty years), and uses appropriate tone.',
  },
];

// ── QUANTITATIVE REASONING ──
export const QUANT_QUESTIONS = [
  {
    id: 'q1', type: 'comparison',
    question: 'A 2-inch square has its sides doubled.\n\nColumn A: Perimeter of the new square\nColumn B: Area of the new square',
    choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
    answer: 2,
    explanation: 'New square has 4-inch sides. Perimeter = 4 × 4 = 16. Area = 4 × 4 = 16. They\'re equal! (Though they measure different things — inches vs. square inches.)',
  },
  {
    id: 'q2', type: 'comparison',
    question: 'Column A: Remainder when 111,111,111 is divided by 3\nColumn B: Remainder when 111,111,111 is divided by 9',
    choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
    answer: 2,
    explanation: 'Sum of digits = 9 (nine 1s). 9 is divisible by both 3 and 9, so both remainders are 0. Equal!',
  },
  {
    id: 'q3', type: 'comparison',
    question: 'A circle with radius 3 is inscribed inside a square.\n\nColumn A: Circumference of the circle\nColumn B: Perimeter of the square',
    choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
    answer: 1,
    explanation: 'Circumference = 2π × 3 ≈ 18.85. The square\'s side = diameter = 6, so perimeter = 4 × 6 = 24. Column B is greater.',
  },
  {
    id: 'q4', type: 'comparison',
    question: 'Two overlapping circles represent "Plastic Blocks" and "Blue Blocks." No numbers are given.\n\nColumn A: Number of plastic blocks\nColumn B: Number of blue blocks',
    choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
    answer: 3,
    explanation: 'Without any numbers, we can\'t determine how many blocks are in each circle. The answer is "Cannot be determined." Don\'t guess when there\'s not enough information!',
  },
  {
    id: 'q5', type: 'pattern',
    question: 'Day 1: 2 marbles. Day 2: 7. Day 3: 17. Day 4: 32. Day 5: 52.\n\nColumn A: Number of marbles on Day 7\nColumn B: 110',
    choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
    answer: 1,
    explanation: 'Differences: 5, 10, 15, 20 (adding 5 each time). Day 6: 52 + 25 = 77. Day 7: 77 + 30 = 107. 107 < 110, so Column B is greater.',
  },
  {
    id: 'q6', type: 'comparison',
    question: 'Jacob has 5 different science test scores. Kevin scores exactly 1 point higher than Jacob on each test.\n\nColumn A: Difference between their mean (average) scores\nColumn B: Difference between their ranges',
    choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
    answer: 0,
    explanation: 'Kevin\'s mean is 1 higher (every score is +1, so mean shifts by 1). But the range (highest - lowest) is the SAME for both — adding 1 to every score doesn\'t change the spread. So A = 1, B = 0. A > B.',
  },
  {
    id: 'q7', type: 'pattern',
    question: 'What number comes next in this pattern?\n2, 6, 18, 54, ___',
    choices: ['72', '108', '162', '216'],
    answer: 2,
    explanation: 'Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162.',
  },
  {
    id: 'q8', type: 'comparison',
    question: 'x is a positive whole number.\n\nColumn A: 3x + 5\nColumn B: 5x + 3',
    choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
    answer: 3,
    explanation: 'Try x = 1: A = 8, B = 8 (equal). Try x = 2: A = 11, B = 13 (B > A). Try x = 0... wait, x must be positive. At x = 1 they\'re equal, at x > 1, B > A. Since x could be 1 or higher, we cannot determine which is always greater.',
  },
  {
    id: 'q9', type: 'comparison',
    question: 'A bag has 3 red marbles and 5 blue marbles.\n\nColumn A: Probability of drawing a red marble\nColumn B: 1/2',
    choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
    answer: 1,
    explanation: 'P(red) = 3/8 = 0.375. 1/2 = 0.5. Column B is greater.',
  },
  {
    id: 'q10', type: 'pattern',
    question: 'In a pattern of shapes: triangle, square, pentagon, hexagon, ...\nHow many sides does the 8th shape in the pattern have?',
    choices: ['8', '9', '10', '11'],
    answer: 2,
    explanation: 'Triangle = 3 sides, square = 4, pentagon = 5, hexagon = 6. The 1st shape has 3 sides, so the nth shape has (n + 2) sides. 8th shape: 8 + 2 = 10 sides.',
  },
  {
    id: 'q11', type: 'comparison',
    question: 'Column A: 25% of 80\nColumn B: 80% of 25',
    choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
    answer: 2,
    explanation: '25% of 80 = 0.25 × 80 = 20. 80% of 25 = 0.80 × 25 = 20. They\'re equal! This always works: A% of B = B% of A.',
  },
  {
    id: 'q12', type: 'comparison',
    question: 'A rectangle has a length of 12 and a width of 5.\n\nColumn A: Perimeter of the rectangle\nColumn B: Area of the rectangle',
    choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
    answer: 1,
    explanation: 'Perimeter = 2(12 + 5) = 34. Area = 12 × 5 = 60. Column B is greater. (Remember: these measure different things, but we\'re just comparing the numbers.)',
  },
  {
    id: 'q13', type: 'pattern',
    question: 'Look at this sequence: 1, 1, 2, 3, 5, 8, 13, ...\nWhat is the next number?',
    choices: ['15', '18', '21', '26'],
    answer: 2,
    explanation: 'Each number is the sum of the two before it: 1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13, 8+13=21. This is the Fibonacci sequence!',
  },
  {
    id: 'q14', type: 'comparison',
    question: 'Column A: The number of prime numbers between 1 and 20\nColumn B: 8',
    choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
    answer: 2,
    explanation: 'Primes between 1 and 20: 2, 3, 5, 7, 11, 13, 17, 19. That\'s exactly 8. Equal!',
  },
  {
    id: 'q15', type: 'comparison',
    question: 'A store sells pencils for $0.25 each and pens for $0.75 each.\n\nColumn A: Cost of 6 pencils\nColumn B: Cost of 2 pens',
    choices: ['Column A is greater', 'Column B is greater', 'They are equal', 'Cannot be determined'],
    answer: 2,
    explanation: '6 pencils = 6 × $0.25 = $1.50. 2 pens = 2 × $0.75 = $1.50. Equal!',
  },
];

// ── MATHEMATICS ──
export const MATH_QUESTIONS = [
  // Numbers and Number Relationships
  {
    id: 'm1', type: 'numbers', topic: 'Place Value',
    question: 'In which pair is the value of the digit 4 in the left number TEN TIMES the value of the digit 4 in the right number?',
    choices: ['4 and 14', '45 and 4', '41 and 4,432', '461 and 4'],
    answer: 1,
    explanation: 'In 45, the 4 is in the tens place (value = 40). In 4, the 4 is in the ones place (value = 4). 40 = 10 × 4. ✓',
  },
  {
    id: 'm2', type: 'numbers', topic: 'Fractions',
    question: 'Which fraction is LESS than 7/8?',
    choices: ['9/10', '8/9', '3/4', '15/16'],
    answer: 2,
    explanation: '3/4 = 6/8, which is less than 7/8. All others (9/10, 8/9, 15/16) are greater than 7/8.',
  },
  {
    id: 'm3', type: 'numbers', topic: 'Fractions',
    question: 'What is 2/3 + 1/4?',
    choices: ['3/7', '3/12', '11/12', '8/12'],
    answer: 2,
    explanation: 'Find common denominator: 2/3 = 8/12, 1/4 = 3/12. 8/12 + 3/12 = 11/12. Don\'t add numerators and denominators separately (that gives the wrong answer 3/7).',
  },
  {
    id: 'm4', type: 'numbers', topic: 'Decimals',
    question: 'Which shows these decimals in order from LEAST to GREATEST?\n0.45, 0.405, 0.5, 0.054',
    choices: [
      '0.054, 0.405, 0.45, 0.5',
      '0.054, 0.45, 0.405, 0.5',
      '0.5, 0.45, 0.405, 0.054',
      '0.405, 0.054, 0.45, 0.5',
    ],
    answer: 0,
    explanation: 'Line up decimal places: 0.054 < 0.405 < 0.450 < 0.500. Adding trailing zeros helps compare.',
  },
  // Geometry
  {
    id: 'm5', type: 'geometry', topic: 'Shapes',
    question: 'Which of the following could NOT be a rectangle?',
    choices: ['A parallelogram', 'A polygon', 'A trapezoid', 'A quadrilateral'],
    answer: 2,
    explanation: 'A trapezoid has exactly ONE pair of parallel sides. A rectangle needs TWO pairs. So a trapezoid can never be a rectangle. All rectangles ARE parallelograms, polygons, and quadrilaterals.',
  },
  {
    id: 'm6', type: 'geometry', topic: 'Angles',
    question: 'Two angles of a triangle measure 65° and 75°. What is the third angle?',
    choices: ['30°', '40°', '50°', '60°'],
    answer: 1,
    explanation: 'Angles in a triangle sum to 180°. 180 - 65 - 75 = 40°.',
  },
  {
    id: 'm7', type: 'geometry', topic: 'Perimeter/Area',
    question: 'A rectangular garden has a length four times its width. The perimeter is 240 meters. What is the length?',
    choices: ['24 meters', '48 meters', '96 meters', '120 meters'],
    answer: 2,
    explanation: 'If width = w, length = 4w. Perimeter = 2(w + 4w) = 2(5w) = 10w. 10w = 240, so w = 24, length = 4 × 24 = 96.',
  },
  // Measurement
  {
    id: 'm8', type: 'measurement', topic: 'Conversion',
    question: 'How many cups are in 3 quarts? (1 quart = 4 cups)',
    choices: ['7', '12', '16', '3'],
    answer: 1,
    explanation: '3 quarts × 4 cups per quart = 12 cups.',
  },
  // Statistics
  {
    id: 'm9', type: 'statistics', topic: 'Mean',
    question: 'Five test scores are: 85, 92, 78, 90, 95. What is the mean (average)?',
    choices: ['85', '88', '90', '92'],
    answer: 1,
    explanation: 'Mean = (85 + 92 + 78 + 90 + 95) ÷ 5 = 440 ÷ 5 = 88.',
  },
  {
    id: 'm10', type: 'statistics', topic: 'Median',
    question: 'What is the median of these numbers: 12, 5, 8, 15, 3?',
    choices: ['5', '8', '8.6', '12'],
    answer: 1,
    explanation: 'First, order them: 3, 5, 8, 12, 15. The middle number is 8.',
  },
  {
    id: 'm11', type: 'statistics', topic: 'Range',
    question: 'The high temperatures for 5 days were: 72°F, 68°F, 81°F, 75°F, 70°F. What is the range?',
    choices: ['9', '13', '73.2', '81'],
    answer: 1,
    explanation: 'Range = highest - lowest = 81 - 68 = 13.',
  },
  // Probability
  {
    id: 'm12', type: 'probability', topic: 'Basic',
    question: 'A number cube (1-6) is rolled twice. What is the probability the sum equals 10?',
    choices: ['1/12', '1/6', '1/9', '1/36'],
    answer: 0,
    explanation: '36 total outcomes. Sums of 10: (4,6), (5,5), (6,4) = 3 outcomes. P = 3/36 = 1/12.',
  },
  {
    id: 'm13', type: 'probability', topic: 'Basic',
    question: 'A bag contains 4 red, 3 blue, and 5 green marbles. What is the probability of drawing a blue marble?',
    choices: ['1/4', '3/12', '3/5', '1/3'],
    answer: 0,
    explanation: 'Total marbles = 4 + 3 + 5 = 12. P(blue) = 3/12 = 1/4.',
  },
  // Pre-algebra
  {
    id: 'm14', type: 'pre-algebra', topic: 'Expressions',
    question: 'If n = 5, what is the value of 3n + 7?',
    choices: ['15', '22', '35', '57'],
    answer: 1,
    explanation: '3n + 7 = 3(5) + 7 = 15 + 7 = 22.',
  },
  {
    id: 'm15', type: 'pre-algebra', topic: 'Equations',
    question: 'What value of x makes this equation true? 4x - 3 = 17',
    choices: ['3', '4', '5', '6'],
    answer: 2,
    explanation: '4x - 3 = 17 → 4x = 20 → x = 5. Check: 4(5) - 3 = 20 - 3 = 17. ✓',
  },
  {
    id: 'm16', type: 'numbers', topic: 'Factors',
    question: 'What is the greatest common factor (GCF) of 24 and 36?',
    choices: ['4', '6', '8', '12'],
    answer: 3,
    explanation: 'Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. Largest shared: 12.',
  },
  {
    id: 'm17', type: 'numbers', topic: 'Primes',
    question: 'Which of the following is a prime number?',
    choices: ['21', '27', '29', '33'],
    answer: 2,
    explanation: '21 = 3 × 7. 27 = 3 × 9. 33 = 3 × 11. 29 has no factors other than 1 and itself — it\'s prime.',
  },
  {
    id: 'm18', type: 'numbers', topic: 'Order of Operations',
    question: 'What is the value of 3 + 4 × 2 - 1?',
    choices: ['10', '13', '14', '6'],
    answer: 0,
    explanation: 'Order of operations (PEMDAS): Multiply first: 4 × 2 = 8. Then add and subtract left to right: 3 + 8 - 1 = 10.',
  },
  {
    id: 'm19', type: 'geometry', topic: 'Volume',
    question: 'What is the volume of a rectangular box that is 5 cm long, 3 cm wide, and 4 cm tall?',
    choices: ['12 cm³', '24 cm³', '47 cm³', '60 cm³'],
    answer: 3,
    explanation: 'Volume = length × width × height = 5 × 3 × 4 = 60 cm³.',
  },
  {
    id: 'm20', type: 'numbers', topic: 'Fractions',
    question: 'What is 3/4 × 2/5?',
    choices: ['5/9', '6/20', '3/10', '5/20'],
    answer: 2,
    explanation: 'Multiply numerators: 3 × 2 = 6. Multiply denominators: 4 × 5 = 20. 6/20 simplifies to 3/10.',
  },
  {
    id: 'm21', type: 'numbers', topic: 'Percents',
    question: 'What is 30% of 150?',
    choices: ['30', '45', '50', '55'],
    answer: 1,
    explanation: '30% = 0.30. 0.30 × 150 = 45. Shortcut: 10% of 150 = 15, so 30% = 15 × 3 = 45.',
  },
  {
    id: 'm22', type: 'measurement', topic: 'Time',
    question: 'A movie starts at 2:45 PM and is 1 hour and 50 minutes long. What time does it end?',
    choices: ['3:35 PM', '4:15 PM', '4:35 PM', '4:45 PM'],
    answer: 2,
    explanation: '2:45 + 1 hour = 3:45. 3:45 + 50 minutes = 4:35 PM.',
  },
  {
    id: 'm23', type: 'pre-algebra', topic: 'Patterns',
    question: 'A pattern rule is "multiply by 2, then subtract 1." If the first number is 3, what is the fourth number?',
    choices: ['9', '17', '19', '33'],
    answer: 1,
    explanation: '1st = 3. 2nd = 3×2−1 = 5. 3rd = 5×2−1 = 9. 4th = 9×2−1 = 17.',
  },
  {
    id: 'm24', type: 'numbers', topic: 'LCM',
    question: 'What is the least common multiple (LCM) of 6 and 8?',
    choices: ['14', '24', '48', '2'],
    answer: 1,
    explanation: 'Multiples of 6: 6, 12, 18, 24, 30... Multiples of 8: 8, 16, 24, 32... The smallest shared multiple is 24.',
  },
];

// Get all questions for a section
export function getQuestions(sectionId) {
  switch (sectionId) {
    case 'verbal': return VERBAL_QUESTIONS;
    case 'vocab': return VOCAB_QUESTIONS;
    case 'reading': return READING_PASSAGES;
    case 'writing-mechanics': return WRITING_MECH_QUESTIONS;
    case 'writing-concepts': return WRITING_CONCEPTS_QUESTIONS;
    case 'quant': return QUANT_QUESTIONS;
    case 'math': return MATH_QUESTIONS;
    default: return [];
  }
}
