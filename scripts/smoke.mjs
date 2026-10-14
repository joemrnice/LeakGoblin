#!/usr/bin/env node
// Packaging smoke test - verifies published-style package works without dev files
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const distCli = path.join(root, 'dist', 'cli.js');

console.log('🔍 Smoke test: checking dist/cli.js exists...');
if (!fs.existsSync(distCli)) {
  console.error('❌ dist/cli.js not found - run npm run build first');
  process.exit(1);
}

console.log('✅ dist exists');

console.log('\n🔍 Testing CLI help...');
try {
  const help = execSync(`node ${distCli} --help`, { encoding: 'utf8', timeout: 5000 });
  if (!help.includes('leakgoblin')) throw new Error('help output missing');
  console.log('✅ help works');
} catch (e) {
  console.error('❌ help failed', e.message);
  process.exit(1);
}

console.log('\n🔍 Testing scan with synthetic secret...');
try {
  const input = 'my key AKIAIOSFODNN7EXAMPLE is here';
  const output = execSync(`echo "${input}" | node ${distCli} scan --stdin --no-color`, { encoding: 'utf8', timeout: 5000 });
  if (output.includes('AKIAIOSFODNN7EXAMPLE')) {
    console.error('❌ secret leaked in output!');
    process.exit(1);
  }
  if (!output.toLowerCase().includes('goblin') && !output.toLowerCase().includes('found')) {
    console.log('Output:', output);
  }
  console.log('✅ scan masks secrets');
} catch (e) {
  // If exit code 1, that's expected when secret found - check output still masked
  const out = e.stdout?.toString() || e.message;
  if (out.includes('AKIAIOSFODNN7EXAMPLE')) {
    console.error('❌ secret leaked!');
    process.exit(1);
  }
  console.log('✅ scan detects and masks (exit 1 expected)');
}

console.log('\n🔍 Testing sanitize...');
try {
  const input = 'password = "s3cr3tP@ss1234" and AKIAIOSFODNN7EXAMPLE';
  const sanitized = execSync(`echo '${input}' | node ${distCli} sanitize --stdin --no-summary`, { encoding: 'utf8', timeout: 5000 });
  if (sanitized.includes('AKIAIOSFODNN7EXAMPLE') || sanitized.includes('s3cr3tP@ss1234')) {
    console.error('❌ sanitize leaked secret');
    process.exit(1);
  }
  if (!sanitized.includes('[REDACTED')) {
    console.error('❌ sanitize did not redact');
    process.exit(1);
  }
  console.log('✅ sanitize redacts');
} catch (e) {
  console.error('❌ sanitize failed', e.message);
  process.exit(1);
}

console.log('\n🎉 All smoke tests passed! The goblin is ready.');
