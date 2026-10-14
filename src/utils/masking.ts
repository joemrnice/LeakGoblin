export function maskValue(): string {
  return '[REDACTED]';
}

export function maskSnippet(snippet: string, secret: string): string {
  if (!secret) return snippet;
  const escaped = secret.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(escaped, 'g');
  return snippet.replace(re, '[REDACTED]');
}

export function createRedactedMarker(category: string, ruleId: string): string {
  return `[REDACTED:${category.toUpperCase()}:${ruleId}]`;
}

export function redactLinePreservingStructure(line: string, secret: string, marker: string): string {
  if (!secret) return line;
  const escaped = secret.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(escaped, 'g');
  return line.replace(re, marker);
}

export function truncateForDisplay(s: string, maxLen = 120): string {
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen) + '…';
}

export function isProbablyBinary(content: string): boolean {
  // Only treat as binary if contains null byte
  // Allow ANSI escape sequences (common in logs) - they contain ESC (27) but are text
  if (content.includes('\0')) return true;
  return false;
}
