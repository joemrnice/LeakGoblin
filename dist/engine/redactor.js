import { detectSecrets } from './detector.js';
import { getRulesWithCustom } from './rules.js';
import { createRedactedMarker } from '../utils/masking.js';
export function redactContent(content, options = {}) {
    const detection = detectSecrets(content, { customPatterns: options.customPatterns });
    const rules = getRulesWithCustom(options.customPatterns);
    const ruleMap = new Map();
    for (const r of rules)
        ruleMap.set(r.id, r);
    let sanitized = content;
    let count = 0;
    // Sort findings by length descending to avoid partial replacement issues, then by position descending
    const sorted = [...detection.findings].sort((a, b) => {
        const lenDiff = (b._secretValue?.length || 0) - (a._secretValue?.length || 0);
        if (lenDiff !== 0)
            return lenDiff;
        return b.column - a.column;
    });
    // Use a map to track already-redacted secrets to avoid double-redacting markers
    const redactedSecrets = new Set();
    for (const finding of sorted) {
        const secret = finding._secretValue;
        if (!secret)
            continue;
        if (redactedSecrets.has(secret))
            continue;
        const rule = ruleMap.get(finding.ruleId);
        const marker = rule ? createRedactedMarker(rule.category, rule.id) : '[REDACTED]';
        // Escape secret for regex
        const escaped = secret.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(escaped, 'g');
        const before = sanitized;
        sanitized = sanitized.replace(re, marker);
        if (sanitized !== before) {
            count++;
            redactedSecrets.add(secret);
        }
    }
    return {
        sanitized,
        findings: detection.findings,
        redactionCount: count,
    };
}
//# sourceMappingURL=redactor.js.map