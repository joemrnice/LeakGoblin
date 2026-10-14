import { getRulesWithCustom } from './rules.js';
import { maskSnippet, truncateForDisplay, isProbablyBinary } from '../utils/masking.js';
const SEVERITY_ORDER = { low: 0, medium: 1, high: 2, critical: 3 };
const CONFIDENCE_ORDER = { low: 0, medium: 1, high: 2 };
function passesThreshold(sev, conf, minSev, minConf) {
    if (minSev && (SEVERITY_ORDER[sev] ?? 0) < (SEVERITY_ORDER[minSev] ?? 0))
        return false;
    if (minConf && (CONFIDENCE_ORDER[conf] ?? 0) < (CONFIDENCE_ORDER[minConf] ?? 0))
        return false;
    return true;
}
export function detectSecrets(content, options = {}) {
    const rules = getRulesWithCustom(options.customPatterns);
    const findings = [];
    if (isProbablyBinary(content)) {
        return { findings: [], scannedFiles: 0, skippedFiles: [{ file: options.filePath || '<stdin>', reason: 'binary file detected' }] };
    }
    if (content.length > 5 * 1024 * 1024) {
        return { findings: [], scannedFiles: 0, skippedFiles: [{ file: options.filePath || '<stdin>', reason: 'file too large (>5MB)' }] };
    }
    const lines = content.split(/\r?\n/);
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx];
        if (!line.trim())
            continue;
        for (const rule of rules) {
            // Reset regex lastIndex for global regex
            rule.pattern.lastIndex = 0;
            let match;
            while ((match = rule.pattern.exec(line)) !== null) {
                const fullMatch = match[0];
                const secretValue = rule.secretGroupIndex !== undefined ? (match[rule.secretGroupIndex] || fullMatch) : fullMatch;
                // Skip obvious false positives
                if (isFalsePositive(secretValue, rule.id, line))
                    continue;
                // Avoid matching placeholder values like "YOUR_API_KEY", "example", "test123"
                if (isPlaceholderValue(secretValue))
                    continue;
                if (!passesThreshold(rule.severity, rule.confidence, options.minSeverity, options.minConfidence)) {
                    continue;
                }
                const col = match.index;
                const masked = maskSnippet(truncateForDisplay(line), secretValue);
                const finding = {
                    ruleId: rule.id,
                    ruleName: rule.name,
                    category: rule.category,
                    severity: rule.severity,
                    confidence: rule.confidence,
                    file: options.filePath,
                    line: lineIdx + 1,
                    column: col + 1,
                    snippetMasked: masked,
                    matchedLength: fullMatch.length,
                    _rawMatch: fullMatch,
                    _secretValue: secretValue,
                };
                findings.push(finding);
                // Prevent infinite loop on zero-length matches
                if (match[0].length === 0) {
                    rule.pattern.lastIndex++;
                }
            }
        }
    }
    // Deduplicate findings on same line + same secret
    const deduped = deduplicateFindings(findings);
    return { findings: deduped };
}
function deduplicateFindings(findings) {
    const seen = new Set();
    const result = [];
    for (const f of findings) {
        const key = `${f.file || ''}:${f.line}:${f.column}:${f._secretValue}:${f.ruleId}`;
        if (!seen.has(key)) {
            seen.add(key);
            result.push(f);
        }
    }
    return result;
}
function isFalsePositive(secret, ruleId, line) {
    if (!secret)
        return true;
    // Too short
    if (secret.length < 8 && ruleId !== 'private_key_block')
        return true;
    // If line is a comment about the rule itself
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes('example') && lowerLine.includes('leakgoblin'))
        return true;
    // Generic heuristic rule should not flag common words
    if (ruleId === 'generic_high_entropy') {
        // Skip if looks like UUID, hash of common word, or hex color, or base64 of small string
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(secret))
            return true;
        if (/^#[0-9a-f]{6}$/i.test(secret))
            return true;
        // Skip if all same char repeated
        if (/^(.)\1{10,}$/.test(secret))
            return true;
        // Skip low entropy: only digits, only lowercase, etc
        if (/^[0-9]+$/.test(secret))
            return true;
        if (/^[a-z]+$/.test(secret) && secret.length < 40)
            return true;
        // Require mix of character classes for heuristic
        const hasUpper = /[A-Z]/.test(secret);
        const hasLower = /[a-z]/.test(secret);
        const hasDigit = /[0-9]/.test(secret);
        const diversity = [hasUpper, hasLower, hasDigit].filter(Boolean).length;
        if (diversity < 2)
            return true;
    }
    return false;
}
function isPlaceholderValue(value) {
    const lower = value.toLowerCase();
    const placeholders = [
        'your_api_key', 'your_api_key_here', 'xxx', 'example', 'placeholder',
        'test', 'test123', 'changeme', 'replace_me', 'insert_key_here',
        'fake', 'dummy', 'sample', '123456', 'abcdef', 'qwerty',
    ];
    if (placeholders.includes(lower))
        return true;
    if (lower.startsWith('your_'))
        return true;
    if (lower.includes('example.com'))
        return true;
    // All same char like 'aaaaaaaa'
    if (/^(.)\1{7,}$/.test(lower))
        return true;
    return false;
}
//# sourceMappingURL=detector.js.map