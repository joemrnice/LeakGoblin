import path from 'node:path';
import { detectSecrets } from '../engine/detector.js';
import { walkDirectory, readFileSafe } from '../utils/fs.js';
import { readStdin } from '../utils/input.js';
import { formatFindings } from '../reporting/formatter.js';
import { formatJson } from '../reporting/json.js';
import { loadConfig } from '../config/loader.js';
export async function scanCommand(target, options) {
    const configResult = loadConfig(process.cwd(), options.config);
    if (configResult.errors && configResult.errors.length > 0 && !options.quiet) {
        console.error(`Config warnings: ${configResult.errors.join(', ')}`);
    }
    const config = configResult.config;
    const exclude = [...(config.exclude || []), ...(options.exclude || [])];
    let result;
    if (options.stdin || target === '-' || !target) {
        // Read from stdin
        let content;
        try {
            content = await readStdin();
        }
        catch (e) {
            return { exitCode: 2, output: `Error reading stdin: ${e.message}` };
        }
        result = detectSecrets(content, {
            filePath: '<stdin>',
            customPatterns: config.customPatterns,
            minSeverity: config.severityThreshold,
            minConfidence: config.confidenceThreshold,
        });
    }
    else {
        // Scan file or directory
        const resolved = path.resolve(target);
        const fs = await import('node:fs');
        try {
            const stat = fs.statSync(resolved);
            if (stat.isFile()) {
                const read = readFileSafe(resolved);
                if (read.error) {
                    return { exitCode: 2, output: `Error reading file ${target}: ${read.error}` };
                }
                result = detectSecrets(read.content || '', {
                    filePath: resolved,
                    customPatterns: config.customPatterns,
                    minSeverity: config.severityThreshold,
                    minConfidence: config.confidenceThreshold,
                });
                result.scannedFiles = 1;
            }
            else if (stat.isDirectory()) {
                const walk = walkDirectory(resolved, {
                    exclude,
                    maxFileSizeMB: config.maxFileSizeMB,
                });
                const allFindings = [];
                const errors = [];
                for (const file of walk.files) {
                    const read = readFileSafe(file);
                    if (read.error) {
                        errors.push({ file, error: read.error });
                        continue;
                    }
                    const fileResult = detectSecrets(read.content || '', {
                        filePath: file,
                        customPatterns: config.customPatterns,
                        minSeverity: config.severityThreshold,
                        minConfidence: config.confidenceThreshold,
                    });
                    allFindings.push(...fileResult.findings);
                    if (fileResult.skippedFiles) {
                        walk.skipped.push(...fileResult.skippedFiles);
                    }
                }
                result = {
                    findings: allFindings,
                    scannedFiles: walk.files.length,
                    skippedFiles: walk.skipped,
                    errors,
                };
            }
            else {
                return { exitCode: 2, output: `Target is not a file or directory: ${target}` };
            }
        }
        catch (e) {
            return { exitCode: 2, output: `Error accessing ${target}: ${e.message}` };
        }
    }
    if (options.format === 'json') {
        return { exitCode: result.findings.length > 0 ? 1 : 0, output: formatJson(result) };
    }
    if (options.quiet) {
        // Quiet mode: only exit code matters, no output unless error
        return { exitCode: result.findings.length > 0 ? 1 : 0, output: '' };
    }
    const formatted = formatFindings(result, { noColor: options.noColor, showAscii: options.showAscii });
    return { exitCode: result.findings.length > 0 ? 1 : 0, output: formatted };
}
//# sourceMappingURL=scan.js.map