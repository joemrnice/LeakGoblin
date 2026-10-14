import { describe, it, expect } from 'vitest';
import { redactContent } from '../src/engine/redactor.js';

const CANARY_AWS = 'AKIAIOSFODNN7EXAMPLE';
const CANARY_GH = 'ghp_1234567890abcdefghijklmnopqrstuvwxyzABCD';

describe('LeakGoblin Redactor', () => {
  it('redacts secrets while preserving surrounding text', () => {
    const input = `Connecting with key ${CANARY_AWS} to service.\nPassword line: password = "s3cr3tP@ss1234"\n`;
    const result = redactContent(input);
    
    expect(result.sanitized).not.toContain(CANARY_AWS);
    expect(result.sanitized).toContain('Connecting with key');
    expect(result.sanitized).toContain('to service.');
    expect(result.sanitized).toContain('[REDACTED:');
    expect(result.redactionCount).toBeGreaterThan(0);
  });

  it('preserves line breaks and structure', () => {
    const input = `line1: ${CANARY_AWS}\nline2: clean\nline3: ${CANARY_GH}\n`;
    const result = redactContent(input);
    const lines = result.sanitized.split('\n');
    expect(lines.length).toBe(4); // 3 lines + trailing
    expect(lines[1]).toBe('line2: clean');
  });

  it('does not modify clean input', () => {
    const input = 'Hello world, no secrets here.';
    const result = redactContent(input);
    expect(result.sanitized).toBe(input);
    expect(result.redactionCount).toBe(0);
  });

  it('handles multiple secrets of same value once', () => {
    const input = `${CANARY_AWS} and again ${CANARY_AWS}`;
    const result = redactContent(input);
    expect(result.sanitized).not.toContain(CANARY_AWS);
    // Should replace both occurrences but count as 1 unique secret
    expect(result.redactionCount).toBe(1);
  });

  it('never leaks secret in findings masked snippet', () => {
    const input = `key=${CANARY_AWS}`;
    const result = redactContent(input);
    result.findings.forEach(f => {
      expect(f.snippetMasked).not.toContain(CANARY_AWS);
    });
  });
});
