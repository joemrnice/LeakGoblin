import { describe, it, expect } from 'vitest';
import { validateConfig, DEFAULT_CONFIG } from '../src/config/schema.js';
import { loadConfig } from '../src/config/loader.js';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

describe('Config', () => {
  it('validates correct config', () => {
    const cfg = {
      exclude: ['node_modules'],
      severityThreshold: 'high',
      customPatterns: [{ id: 'my_rule', pattern: 'secret_[0-9]+' }],
    };
    const result = validateConfig(cfg);
    expect(result.valid).toBe(true);
  });

  it('rejects invalid regex', () => {
    const cfg = {
      customPatterns: [{ id: 'bad', pattern: '[' }],
    };
    const result = validateConfig(cfg);
    expect(result.valid).toBe(false);
  });

  it('loads default when no config found', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'leakgoblin-test-'));
    const loaded = loadConfig(tmp);
    expect(loaded.config.exclude).toEqual(DEFAULT_CONFIG.exclude);
    fs.rmSync(tmp, { recursive: true });
  });

  it('loads custom config file', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'leakgoblin-test-'));
    const cfgPath = path.join(tmp, 'leakgoblin.config.json');
    fs.writeFileSync(cfgPath, JSON.stringify({ exclude: ['custom_exclude'], severityThreshold: 'medium' }));
    const loaded = loadConfig(tmp, cfgPath);
    expect(loaded.config.exclude).toContain('custom_exclude');
    expect(loaded.config.severityThreshold).toBe('medium');
    fs.rmSync(tmp, { recursive: true });
  });
});
