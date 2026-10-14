import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { walkDirectory } from '../src/utils/fs.js';

describe('FS Utils', () => {
  it('walks directory and respects exclusions', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'leakgoblin-fs-'));
    fs.mkdirSync(path.join(tmp, 'node_modules'));
    fs.writeFileSync(path.join(tmp, 'node_modules', 'ignore.js'), 'AKIAIOSFODNN7EXAMPLE');
    fs.writeFileSync(path.join(tmp, 'clean.js'), 'console.log("hi")');
    fs.writeFileSync(path.join(tmp, 'secret.js'), 'AKIAIOSFODNN7EXAMPLE');

    const result = walkDirectory(tmp, { exclude: ['node_modules'] });
    expect(result.files.some(f => f.includes('clean.js'))).toBe(true);
    expect(result.files.some(f => f.includes('secret.js'))).toBe(true);
    expect(result.files.some(f => f.includes('node_modules'))).toBe(false);

    fs.rmSync(tmp, { recursive: true });
  });

  it('skips large files', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'leakgoblin-fs-'));
    const bigFile = path.join(tmp, 'big.txt');
    // Create 6MB file
    const bigContent = 'a'.repeat(6 * 1024 * 1024);
    fs.writeFileSync(bigFile, bigContent);
    const result = walkDirectory(tmp, { maxFileSizeMB: 5 });
    expect(result.files.some(f => f.includes('big.txt'))).toBe(false);
    expect(result.skipped.some(s => s.file.includes('big.txt'))).toBe(true);
    fs.rmSync(tmp, { recursive: true });
  });
});
