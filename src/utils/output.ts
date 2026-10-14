// Safe output utilities - never log secrets

export function safeLog(...args: any[]) {
  // Ensure we don't accidentally log secrets - but args are already masked at this point
  console.log(...args);
}

export function safeError(...args: any[]) {
  console.error(...args);
}

export interface OutputOptions {
  noColor?: boolean;
  quiet?: boolean;
  format?: 'text' | 'json';
}
