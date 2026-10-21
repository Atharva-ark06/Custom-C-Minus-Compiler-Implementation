'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('browser entry point references the application script and stylesheet', () => {
  assert.match(html, /<script\s+src=["']app\.js["']/i);
  assert.match(html, /<link[^>]+href=["']style\.css["'][^>]*>/i);
  assert.ok(fs.existsSync(path.join(root, 'app.js')));
  assert.ok(fs.existsSync(path.join(root, 'style.css')));
});

test('analysis input and sample controls remain available to the UI', () => {
  for (const id of ['codeInput', 'sampleSelect', 'resultsArea']) {
    assert.ok(html.includes(`id="${id}"`), `missing required element: ${id}`);
  }
});

test('all graph and token result containers remain present', () => {
  for (const id of ['tokenOutput', 'astOutput', 'cfgOutput', 'dfgOutput', 'cpgOutput']) {
    assert.ok(html.includes(`id="${id}"`), `missing result container: ${id}`);
  }
});
