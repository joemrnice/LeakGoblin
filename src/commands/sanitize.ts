import { redactContent } from '../engine/redactor.js';
import { readStdin } from '../utils/input.js';
import { loadConfig } from '../config/loader.js';
import { formatFindings } from '../reporting/formatter.js';

export interface SanitizeOptions {
  stdin?: boolean;
  noColor?: boolean;
  quiet?: boolean;
  config?: string;
  showSummary?: boolean;
}

export async function sanitizeCommand(options: SanitizeOptions): Promise<{ exitCode: number; output: string; stderr?: string }> {
  const configResult = loadConfig(process.cwd(), options.config);
  const config = configResult.config;

  let content: string;
  try {
    content = await readStdin();
  } catch (e: any) {
    return { exitCode: 2, output: '', stderr: `Error reading stdin: ${e.message}` };
  }

  if (!content) {
    return { exitCode: 0, output: '', stderr: 'No input received on stdin.' };
  }

  const result = redactContent(content, {
    customPatterns: config.customPatterns,
  });

  let stderr = '';
  if (options.showSummary !== false && !options.quiet) {
    if (result.findings.length > 0) {
      const summaryResult = { findings: result.findings, scannedFiles: 1 };
      stderr = formatFindings(summaryResult, { noColor: options.noColor, showAscii: false });
      stderr += `\nSanitized ${result.redactionCount} secret(s).\n`;
      stderr += `Your prompt has been sanitized.\n`;
    } else {
      stderr = 'No matching secrets detected. Stay vigilant.\n';
    }
  }

  return { exitCode: 0, output: result.sanitized, stderr };
}
