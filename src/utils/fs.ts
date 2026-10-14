import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_EXCLUSIONS, DEFAULT_SUPPORTED_EXTENSIONS } from '../engine/rules.js';

export interface FileScanOptions {
  exclude?: string[];
  includeExtensions?: string[];
  maxFileSizeMB?: number;
}

export interface WalkResult {
  files: string[];
  skipped: { file: string; reason: string }[];
}

export function shouldExclude(filePath: string, exclusions: string[]): boolean {
  const parts = filePath.split(path.sep);
  for (const excl of exclusions) {
    if (parts.includes(excl)) return true;
    if (filePath.includes(excl)) return true;
  }
  return false;
}

export function isSupportedFile(filePath: string, supportedExtensions: Set<string>): boolean {
  const base = path.basename(filePath);
  if (supportedExtensions.has(base)) return true;
  const ext = path.extname(filePath).toLowerCase();
  if (supportedExtensions.has(ext)) return true;
  // Also allow files without extension but with known names like .env
  if (base.startsWith('.env')) return true;
  if (base === 'Dockerfile') return true;
  // For generic text files, allow if no binary and reasonable size - but we filter via extension list
  // For scan . we want to scan all text-ish files, so allow .md, .txt, .log etc already covered
  // If extension list is empty, allow all
  return false;
}

export function walkDirectory(root: string, options: FileScanOptions = {}): WalkResult {
  const exclusions = options.exclude || DEFAULT_EXCLUSIONS;
  const supported = options.includeExtensions ? new Set(options.includeExtensions) : DEFAULT_SUPPORTED_EXTENSIONS;
  const maxSize = (options.maxFileSizeMB || 5) * 1024 * 1024;

  const files: string[] = [];
  const skipped: { file: string; reason: string }[] = [];

  function walk(current: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (e: any) {
      skipped.push({ file: current, reason: e.message });
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);

      if (shouldExclude(fullPath, exclusions)) {
        skipped.push({ file: fullPath, reason: 'excluded' });
        continue;
      }

      if (entry.isDirectory()) {
        // Skip hidden dirs like .git already handled, but also skip if symlink?
        try {
          const stat = fs.lstatSync(fullPath);
          if (stat.isSymbolicLink()) {
            skipped.push({ file: fullPath, reason: 'symlink dir skipped to avoid cycles' });
            continue;
          }
        } catch {}
        walk(fullPath);
      } else if (entry.isFile()) {
        try {
          const stat = fs.statSync(fullPath);
          if (stat.size > maxSize) {
            skipped.push({ file: fullPath, reason: `file too large (${Math.round(stat.size/1024/1024)}MB)` });
            continue;
          }
          if (!isSupportedFile(fullPath, supported)) {
            // For files with unknown extension, we still try to scan if they look like text and are small (<100kb)
            if (stat.size < 100 * 1024) {
              // Check if it's text file by extension? allow .js,.ts etc already. For unknown, we try anyway but mark as maybe
              const ext = path.extname(fullPath);
              if (!ext) {
                files.push(fullPath);
                continue;
              }
            }
            skipped.push({ file: fullPath, reason: 'unsupported extension' });
            continue;
          }
          files.push(fullPath);
        } catch (e: any) {
          skipped.push({ file: fullPath, reason: e.message });
        }
      }
    }
  }

  walk(path.resolve(root));
  return { files, skipped };
}

export function readFileSafe(filePath: string): { content?: string; error?: string } {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return { content };
  } catch (e: any) {
    return { error: e.message || String(e) };
  }
}
