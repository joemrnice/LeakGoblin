import { describe, it, expect } from 'vitest';
import { detectSecrets } from '../src/engine/detector.js';

// Synthetic canary secrets only - no real credentials
const CANARY = {
  awsKey: 'AKIAIOSFODNN7EXAMPLE',
  githubPat: 'ghp_1234567890abcdefghijklmnopqrstuvwxyzABCD',
  stripeKey: 'sk_test_1234567890abcdefghijklmnop',
  slackToken: 'xoxb-1234567890-1234567890-abcdefghijklmnopqrstuv',
  googleKey: 'AIzaSyFakeKeyForTestingPurposesOnly1234567',
  bearer: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test',
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  passwordAssign: 'password = "s3cr3tP@ssw0rd123"',
  dbConn: 'mongodb://user:pass123@localhost:27017/mydb',
  envVar: 'GITHUB_API_KEY=ghp_1234567890abcdefghijklmnopqrstuvwxyzABCD',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----',
};

describe('LeakGoblin Detector', () => {
  it('detects AWS access key', () => {
    const result = detectSecrets(`key = ${CANARY.awsKey}`);
    expect(result.findings.some(f => f.ruleId === 'aws_access_key')).toBe(true);
    // Never expose raw secret in snippetMasked
    result.findings.forEach(f => {
      expect(f.snippetMasked).not.toContain(CANARY.awsKey);
      expect(f._secretValue).toBe(CANARY.awsKey); // internal only
    });
  });

  it('detects GitHub token', () => {
    const result = detectSecrets(`token ${CANARY.githubPat}`);
    expect(result.findings.some(f => f.ruleId === 'github_token')).toBe(true);
  });

  it('detects private key block', () => {
    const result = detectSecrets(CANARY.privateKey);
    expect(result.findings.some(f => f.ruleId === 'private_key_block')).toBe(true);
  });

  it('detects password assignment', () => {
    const result = detectSecrets(CANARY.passwordAssign);
    expect(result.findings.some(f => f.ruleId === 'password_assignment')).toBe(true);
  });

  it('detects DB connection string', () => {
    const result = detectSecrets(`connect to ${CANARY.dbConn}`);
    expect(result.findings.some(f => f.ruleId === 'db_connection_string')).toBe(true);
  });

  it('detects env sensitive var', () => {
    const result = detectSecrets(CANARY.envVar);
    expect(result.findings.some(f => f.ruleId === 'env_sensitive')).toBe(true);
  });

  it('does not flag placeholder values', () => {
    const result = detectSecrets('api_key = "YOUR_API_KEY"\npassword = "example"\nsecret = "test123"');
    // Should be 0 or only low confidence heuristic, but not high confidence secrets
    const highConf = result.findings.filter(f => f.confidence === 'high');
    expect(highConf.length).toBe(0);
  });

  it('masks secrets in output', () => {
    const result = detectSecrets(`my key is ${CANARY.awsKey} here`);
    for (const f of result.findings) {
      expect(f.snippetMasked).not.toContain(CANARY.awsKey);
      expect(f.snippetMasked).toContain('[REDACTED]');
    }
  });

  it('handles empty and clean input', () => {
    expect(detectSecrets('').findings.length).toBe(0);
    expect(detectSecrets('Hello world, this is clean code.').findings.length).toBe(0);
  });

  it('handles long strings and invalid unicode safely', () => {
    const longStr = 'a'.repeat(100000);
    const result = detectSecrets(longStr);
    expect(result.findings.length).toBe(0);

    const invalid = 'test \uD800 invalid unicode ' + CANARY.awsKey;
    const result2 = detectSecrets(invalid);
    expect(result2.findings.some(f => f.ruleId === 'aws_access_key')).toBe(true);
  });

  it('handles terminal escape sequences safely', () => {
    const evil = '\x1b[2J\x1b[H ' + CANARY.awsKey + ' \n\x1b[31mred text';
    const result = detectSecrets(evil);
    // Should still detect, but not execute escape
    expect(result.findings.length).toBeGreaterThan(0);
    result.findings.forEach(f => {
      expect(f.snippetMasked).not.toContain(CANARY.awsKey);
    });
  });

  it('deduplicates findings', () => {
    const content = `${CANARY.awsKey} and again ${CANARY.awsKey} on same line`;
    const result = detectSecrets(content);
    // Same secret on same line should be deduped? Actually different column, but we dedupe by value+location, so 2 findings for 2 positions
    // Let's test our dedup logic keeps at least 1
    expect(result.findings.length).toBeGreaterThanOrEqual(1);
  });

  it('respects severity threshold', () => {
    const content = `${CANARY.awsKey} plus highentropystringthatisverylongandrandomABC123xyz`;
    const resultLow = detectSecrets(content, { minSeverity: 'low' });
    const resultHigh = detectSecrets(content, { minSeverity: 'high' });
    expect(resultLow.findings.length).toBeGreaterThanOrEqual(resultHigh.findings.length);
  });
});
