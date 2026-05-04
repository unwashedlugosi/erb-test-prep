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

    // Practice questions (real difficulty, not warmups, not lessons)
    const questions = data.questions || [];
    for (const q of questions) {
      allQuestions.push({
        ...q,
        topicId, topicName, sectionId,
        // Reading questions need passage context attached
        ...(data.passages && q.passageId ? {
          passageText: (data.passages.find(p => p.id === q.passageId) || {}).text,
          passageTitle: (data.passages.find(p => p.id === q.passageId) || {}).title,
        } : {}),
      });
    }

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

  // Chunk into groups of 100
  const CHUNK_SIZE = 100;
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
