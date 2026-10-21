'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const requiredFiles = [
  'README.md',
  'app.js',
  'index.html',
  'style.css',
  'package.json',
  '.github/workflows/repository-checks.yml',
  'tests/compiler-core.test.js',
];

const missing = requiredFiles.filter(file => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error('Repository smoke check failed. Missing required files:');
  for (const file of missing) console.error(` - ${file}`);
  process.exitCode = 1;
} else {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const requiredReferences = [
    { label: 'application script', pattern: /<script\s+src=["']app\.js["']/i },
    { label: 'stylesheet', pattern: /<link[^>]+href=["']style\.css["'][^>]*>/i },
  ];
  const absent = requiredReferences.filter(item => !item.pattern.test(html));
  if (absent.length) {
    console.error('Repository smoke check failed. Missing HTML references:');
    for (const item of absent) console.error(` - ${item.label}`);
    process.exitCode = 1;
  } else {
    console.log(`Repository smoke check passed (${requiredFiles.length} required files and ${requiredReferences.length} HTML references).`);
  }
}
