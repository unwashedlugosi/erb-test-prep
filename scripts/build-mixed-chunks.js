#!/usr/bin/env node
// Reads all per-topic JSON files in public/questions/
// Generates 8 randomized 100-question chunks in public/mixed/
// Each question is tagged with its source topicId and topicName.
// Deterministic seed so rebuilds produce stable chunks.

import { readFile, writeFile, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const QUESTIONS_DIR = join(__dirname, '..', 'public', 'questions');
const MIXED_DIR = join(__dirname, '..', 'public', 'mixed');

// Topics already tested on ERB Day 1 (May 5, 2026) — exclude from Mixed Review
// per Max's Day 1 Recap survey + verbal confirmation.
// Verbal Reasoning subtest: analogies, categorization, logic
// Reading Comprehension subtest: main-idea, inference, authors-purpose
// Quantitative Reasoning kept IN (Max says he didn't take it despite survey).
const EXCLUDED_TOPICS = new Set([
  'analogies', 'categorization', 'logic',
  'main-idea', 'inference', 'authors-purpose',
]);

// Soft weighting toward Max's weakest topics (per his erb_answers stats as of May 5).
// Multipliers above 1 cause that topic's questions to appear that many times in the pool.
// Stronger topics (>85% accuracy) stay at 1x.
const TOPIC_WEIGHTS = {
  'word-problems':     2.0,  // 25% — weakest
  'column-comparison': 2.0,  // 38% — weak + unfamiliar format
  'fractions':         1.5,  // 57%
  'patterns':          1.25, // 68%
  'two-blank':         1.25, // 67% (small sample)
  'single-blank':      1.0,  // 76%
  'grammar-usage':     1.0,  // 90%
  'sentence-ordering': 1.0,  // 90%
  'topic-supporting':  1.0,  // 100%
  'geometry':          1.0,  // no data — neutral
};

// Deterministic LCG random for stable rebuilds
function lcg(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

async function main() {
  const files = (await readdir(QUESTIONS_DIR)).filter(f => f.endsWith('.json'));
  const allQuestions = [];

  for (const file of files) {
    const data = JSON.parse(await readFile(join(QUESTIONS_DIR, file), 'utf8'));
    const topicId = data.id;
    const topicName = data.name;
    const sectionId = data.sectionId;

    if (EXCLUDED_TOPICS.has(topicId)) {
      console.log(`  Skipping ${topicId} (already tested on Day 1)`);
      continue;
    }

    const weight = TOPIC_WEIGHTS[topicId] ?? 1.0;

    // Practice questions (real difficulty, not warmups, not lessons)
    const questions = data.questions || [];
    const reps = Math.max(1, Math.round(weight * 1)); // integer multiplier (1, 1, 2 for 1.0/1.25/1.5/2.0)
    const fractional = weight - Math.floor(weight); // .25 / .5 → partial extra pass
    for (let r = 0; r < Math.floor(weight); r++) {
      for (const q of questions) {
        allQuestions.push({
          ...q,
          topicId, topicName, sectionId,
          ...(data.passages && q.passageId ? {
            passageText: (data.passages.find(p => p.id === q.passageId) || {}).text,
            passageTitle: (data.passages.find(p => p.id === q.passageId) || {}).title,
          } : {}),
        });
      }
    }
    if (fractional > 0) {
      const extraCount = Math.round(questions.length * fractional);
      // deterministic: take first extraCount after a topic-seeded shuffle
      const topicRand = lcg(topicId.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
      const sortedExtras = [...questions].sort(() => topicRand() - 0.5).slice(0, extraCount);
      for (const q of sortedExtras) {
        allQuestions.push({
          ...q,
          topicId, topicName, sectionId,
          ...(data.passages && q.passageId ? {
            passageText: (data.passages.find(p => p.id === q.passageId) || {}).text,
            passageTitle: (data.passages.find(p => p.id === q.passageId) || {}).title,
          } : {}),
        });
      }
    }
    if (weight !== 1.0) console.log(`  ${topicId}: ${questions.length} questions × ${weight}x → contributing ~${Math.round(questions.length * weight)}`);

    // Reading topic: questions live inside passages array
    if (data.passages) {
      for (const p of data.passages) {
        for (const q of (p.questions || [])) {
          allQuestions.push({
            ...q,
            topicId, topicName, sectionId,
            passageText: p.text,
            passageTitle: p.title,
            passageId: p.id,
          });
        }
      }
    }
  }

  console.log(`Total questions across all topics: ${allQuestions.length}`);

  // Shuffle deterministically
  const rand = lcg(42);
  const shuffled = [...allQuestions].sort(() => rand() - 0.5);

  // Chunk into groups of 50 (Day-2/3 prep — shorter sets, more sense of progress)
  const CHUNK_SIZE = 50;
  const chunks = [];
  for (let i = 0; i < shuffled.length; i += CHUNK_SIZE) {
    chunks.push(shuffled.slice(i, i + CHUNK_SIZE));
  }

  console.log(`Building ${chunks.length} chunks of up to ${CHUNK_SIZE} questions...`);

  // Write each chunk
  for (let i = 0; i < chunks.length; i++) {
    const filename = join(MIXED_DIR, `chunk-${i + 1}.json`);
    await writeFile(filename, JSON.stringify({
      chunkIndex: i + 1,
      totalChunks: chunks.length,
      questionCount: chunks[i].length,
      questions: chunks[i],
    }, null, 0));
    console.log(`  Wrote ${filename} (${chunks[i].length} questions)`);
  }

  // Write manifest
  await writeFile(join(MIXED_DIR, 'manifest.json'), JSON.stringify({
    totalChunks: chunks.length,
    totalQuestions: allQuestions.length,
    chunkSize: CHUNK_SIZE,
    builtAt: new Date().toISOString(),
  }, null, 2));

  console.log(`Done. ${allQuestions.length} questions across ${chunks.length} chunks.`);
}

main().catch(err => { console.error(err); process.exit(1); });
