#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsDir = path.join(__dirname, '..', 'docs');

function auditMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  
  // Check for bilingual blockquote pairs
  const lines = content.split('\n');
  let bilingualBlockquotePairs = 0;
  let consecutiveBlockquotes = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('>')) {
      consecutiveBlockquotes++;
    } else {
      if (consecutiveBlockquotes >= 2) {
        bilingualBlockquotePairs++;
      }
      consecutiveBlockquotes = 0;
    }
  }
  
  // Check for summary/abstract headings
  const hasSummary = /^##.*总结|^##.*摘要/m.test(content);
  const hasConclusion = /^##.*小结/m.test(content);
  
  return {
    file: fileName,
    bilingualBlockquotePairs,
    hasSummary,
    hasConclusion,
    hasBothHeadings: hasSummary && hasConclusion
  };
}

function main() {
  console.log('🔍 Auditing translation completeness in docs/...\n');
  
  const markdownFiles = fs.readdirSync(docsDir)
    .filter(file => file.endsWith('.md'))
    .filter(file => file !== 'README.md' && file !== 'index.md')
    .sort();
  
  const results = [];
  let totalFiles = 0;
  let filesWithBilingualPairs = 0;
  let filesWithSummary = 0;
  let filesWithConclusion = 0;
  let filesWithBothHeadings = 0;
  
  for (const file of markdownFiles) {
    const filePath = path.join(docsDir, file);
    const result = auditMarkdownFile(filePath);
    results.push(result);
    
    totalFiles++;
    if (result.bilingualBlockquotePairs > 0) filesWithBilingualPairs++;
    if (result.hasSummary) filesWithSummary++;
    if (result.hasConclusion) filesWithConclusion++;
    if (result.hasBothHeadings) filesWithBothHeadings++;
  }
  
  // Display results
  console.log('📊 Audit Results:\n');
  console.log('File'.padEnd(15) + 'Bilingual Pairs'.padEnd(15) + 'Summary'.padEnd(10) + 'Conclusion'.padEnd(12) + 'Both Headings');
  console.log('-'.repeat(65));
  
  for (const result of results) {
    console.log(
      result.file.padEnd(15) +
      result.bilingualBlockquotePairs.toString().padEnd(15) +
      (result.hasSummary ? '✓' : '✗').padEnd(10) +
      (result.hasConclusion ? '✓' : '✗').padEnd(12) +
      (result.hasBothHeadings ? '✓' : '✗')
    );
  }
  
  console.log('\n📈 Summary Statistics:');
  console.log(`Total files: ${totalFiles}`);
  console.log(`Files with bilingual blockquote pairs: ${filesWithBilingualPairs}/${totalFiles} (${Math.round(filesWithBilingualPairs/totalFiles*100)}%)`);
  console.log(`Files with summary (总结/摘要): ${filesWithSummary}/${totalFiles} (${Math.round(filesWithSummary/totalFiles*100)}%)`);
  console.log(`Files with conclusion (小结): ${filesWithConclusion}/${totalFiles} (${Math.round(filesWithConclusion/totalFiles*100)}%)`);
  console.log(`Files with both headings: ${filesWithBothHeadings}/${totalFiles} (${Math.round(filesWithBothHeadings/totalFiles*100)}%)`);
  
  // Check specific chapters 1-8
  console.log('\n📚 Chapters 1-8 Status:');
  const chapters1to8 = results.filter(r => /^ch[1-8]\.md$/.test(r.file));
  for (const chapter of chapters1to8) {
    const status = chapter.hasBothHeadings && chapter.bilingualBlockquotePairs > 0 ? '✅ Complete' : '❌ Incomplete';
    console.log(`${chapter.file}: ${status}`);
  }
  
  // Exit with error code if any chapters 1-8 are incomplete
  const incompleteChapters = chapters1to8.filter(c => !(c.hasBothHeadings && c.bilingualBlockquotePairs > 0));
  if (incompleteChapters.length > 0) {
    console.log(`\n⚠️  ${incompleteChapters.length} chapters (1-8) are incomplete`);
    process.exit(1);
  } else {
    console.log('\n✅ All chapters 1-8 have complete bilingual summaries!');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}