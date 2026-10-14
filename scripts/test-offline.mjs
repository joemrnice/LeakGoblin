#!/usr/bin/env node
// Offline test runner - no dependencies, uses Node built-in assert
import assert from 'node:assert';
import { detectSecrets } from '../dist/engine/detector.js';
import { redactContent } from '../dist/engine/redactor.js';
import { validateConfig, DEFAULT_CONFIG } from '../dist/config/schema.js';
import { loadConfig } from '../dist/config/loader.js';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const CANARY = {
  awsKey: 'AKIAIOSFODNN7EXAMPLE',
  githubPat: 'ghp_1234567890abcdefghijklmnopqrstuvwxyzABCD',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----',
  passwordAssign: 'password = "s3cr3tP@ssw0rd123"',
  dbConn: 'mongodb://user:pass123@localhost:27017/mydb',
};

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (e) {
    console.error(`✗ ${name}: ${e.message}`);
    failed++;
  }
}

console.log('Running LeakGoblin offline tests (no vitest needed)...\n');

test('detects AWS access key', () => {
  const result = detectSecrets(`key = ${CANARY.awsKey}`);
  assert.ok(result.findings.some(f => f.ruleId === 'aws_access_key'));
  result.findings.forEach(f => {
    assert.ok(!f.snippetMasked.includes(CANARY.awsKey), 'secret leaked in masked snippet');
  });
});

test('detects GitHub token', () => {
  const result = detectSecrets(`token ${CANARY.githubPat}`);
  assert.ok(result.findings.some(f => f.ruleId === 'github_token'));
});

test('detects private key block', () => {
  const result = detectSecrets(CANARY.privateKey);
  assert.ok(result.findings.some(f => f.ruleId === 'private_key_block'));
});

test('detects password assignment', () => {
  const result = detectSecrets(CANARY.passwordAssign);
  assert.ok(result.findings.some(f => f.ruleId === 'password_assignment'));
});

test('detects DB connection string', () => {
  const result = detectSecrets(`connect to ${CANARY.dbConn}`);
  assert.ok(result.findings.some(f => f.ruleId === 'db_connection_string'));
});

test('does not flag placeholder values', () => {
  const result = detectSecrets('api_key = "YOUR_API_KEY"\npassword = "example"');
  const highConf = result.findings.filter(f => f.confidence === 'high');
  assert.strictEqual(highConf.length, 0);
});

test('masks secrets in output', () => {
  const result = detectSecrets(`my key is ${CANARY.awsKey} here`);
  for (const f of result.findings) {
    assert.ok(!f.snippetMasked.includes(CANARY.awsKey));
    assert.ok(f.snippetMasked.includes('[REDACTED]'));
  }
});

test('handles empty and clean input', () => {
  assert.strictEqual(detectSecrets('').findings.length, 0);
  assert.strictEqual(detectSecrets('Hello world, clean code.').findings.length, 0);
});

test('handles long strings safely', () => {
  const longStr = 'a'.repeat(100000);
  const result = detectSecrets(longStr);
  assert.strictEqual(result.findings.length, 0);
});

test('handles terminal escape sequences', () => {
  // Real logs often have ANSI colors - ensure we still detect secrets
  const evil = '\x1b[2J\x1b[H ' + CANARY.awsKey + ' \n\x1b[31mred text with ' + CANARY.githubPat;
  const result = detectSecrets(evil);
  assert.ok(result.findings.length > 0, 'should detect despite ANSI codes');
  result.findings.forEach(f => {
    assert.ok(!f.snippetMasked.includes(CANARY.awsKey));
    assert.ok(!f.snippetMasked.includes(CANARY.githubPat));
  });
});

test('redacts while preserving structure', () => {
  const input = `Connecting with key ${CANARY.awsKey} to service.\n`;
  const result = redactContent(input);
  assert.ok(!result.sanitized.includes(CANARY.awsKey));
  assert.ok(result.sanitized.includes('Connecting with key'));
  assert.ok(result.sanitized.includes('[REDACTED:'));
});

test('preserves line breaks', () => {
  const input = `line1: ${CANARY.awsKey}\nline2: clean\n`;
  const result = redactContent(input);
  const lines = result.sanitized.split('\n');
  assert.strictEqual(lines[1], 'line2: clean');
});

test('does not modify clean input', () => {
  const input = 'Hello world, no secrets.';
  const result = redactContent(input);
  assert.strictEqual(result.sanitized, input);
  assert.strictEqual(result.redactionCount, 0);
});

test('never leaks secret in findings', () => {
  const input = `key=${CANARY.awsKey}`;
  const result = redactContent(input);
  result.findings.forEach(f => {
    assert.ok(!f.snippetMasked.includes(CANARY.awsKey));
  });
});

test('validates correct config', () => {
  const cfg = { exclude: ['node_modules'], severityThreshold: 'high', customPatterns: [{ id: 'my_rule', pattern: 'secret_[0-9]+' }] };
  const result = validateConfig(cfg);
  assert.ok(result.valid);
});

test('rejects invalid regex', () => {
  const cfg = { customPatterns: [{ id: 'bad', pattern: '[' }] };
  const result = validateConfig(cfg);
  assert.ok(!result.valid);
});

test('loads default when no config found', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'leakgoblin-test-'));
  const loaded = loadConfig(tmp);
  assert.deepStrictEqual(loaded.config.exclude, DEFAULT_CONFIG.exclude);
  fs.rmSync(tmp, { recursive: true });
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
console.log('\n🎉 All offline tests passed! The goblin is ready.');
