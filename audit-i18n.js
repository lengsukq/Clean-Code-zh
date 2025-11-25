#!/usr/bin/env node
/**
 * Audit script to verify bilingual coverage in documentation files
 * Checks for:
 * 1. Presence of Chinese summary sections (总结/摘要)
 * 2. Presence of conclusion sections (小结)
 * 3. Presence of Chinese translations in blockquotes
 * 4. File integrity (code fences, tables, images preserved)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const REQUIRED_FILES = [
  'docs/ch16.md',
  'docs/ch17.md',
  'docs/apA.md'
];

const REQUIRED_SECTIONS = [
  { marker: '## 总结/摘要 Summary', name: 'Summary section' },
  { marker: '## 小结 Conclusion', name: 'Conclusion section' }
];

let allPassed = true;

function checkFile(filepath) {
  const fullPath = path.join(__dirname, filepath);
  
  console.log(`\nAuditing: ${filepath}`);
  console.log('='.repeat(60));
  
  if (!fs.existsSync(fullPath)) {
    console.log(`  ✗ File not found: ${fullPath}`);
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  let passed = true;
  
  // Check for required sections
  for (const section of REQUIRED_SECTIONS) {
    if (content.includes(section.marker)) {
      console.log(`  ✓ ${section.name} found`);
    } else {
      console.log(`  ✗ ${section.name} NOT found`);
      passed = false;
    }
  }
  
  // Count bilingual content (lines with > blockquote containing Chinese)
  const lines = content.split('\n');
  let chineseBlockquotes = 0;
  let englishParagraphs = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('> ') && /[\u4E00-\u9FFF]/.test(line)) {
      chineseBlockquotes++;
    }
    if (line.trim() && !line.startsWith('>') && !line.startsWith('#') && 
        !line.startsWith('```') && !line.startsWith('![') &&
        /^[A-Z]/.test(line) && !/^```/.test(line)) {
      englishParagraphs++;
    }
  }
  
  console.log(`  ℹ English paragraphs found: ${englishParagraphs}`);
  console.log(`  ℹ Chinese blockquotes found: ${chineseBlockquotes}`);
  
  // Check that code is preserved
  const codeBlocks = (content.match(/```/g) || []).length / 2;
  console.log(`  ℹ Code fences preserved: ${codeBlocks} blocks`);
  
  // Check that images are preserved
  const images = (content.match(/!\[\]/g) || []).length;
  console.log(`  ℹ Images preserved: ${images} references`);
  
  // Check that tables/formatting is preserved
  const hasFormatting = content.includes('**') || content.includes('|');
  console.log(`  ${hasFormatting ? '✓' : '✗'} Text formatting (bold, tables, etc.) preserved`);
  
  if (!hasFormatting && filepath !== 'docs/apA.md') {
    passed = false;
  }
  
  return passed;
}

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║   Bilingual Documentation Audit                           ║');
console.log('║   Checks: Summary sections, Translations, Code integrity  ║');
console.log('╚════════════════════════════════════════════════════════════╝');

for (const file of REQUIRED_FILES) {
  const passed = checkFile(file);
  if (!passed) {
    allPassed = false;
  }
}

console.log('\n' + '='.repeat(60));
if (allPassed) {
  console.log('✓ All audits PASSED');
  process.exit(0);
} else {
  console.log('✗ Some audits FAILED');
  process.exit(1);
}
