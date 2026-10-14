export function maskValue() {
    return '[REDACTED]';
}
export function maskSnippet(snippet, secret) {
    if (!secret)
        return snippet;
    const escaped = secret.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped, 'g');
    return snippet.replace(re, '[REDACTED]');
}
export function createRedactedMarker(category, ruleId) {
    return `[REDACTED:${category.toUpperCase()}:${ruleId}]`;
}
export function redactLinePreservingStructure(line, secret, marker) {
    if (!secret)
        return line;
    const escaped = secret.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped, 'g');
    return line.replace(re, marker);
}
export function truncateForDisplay(s, maxLen = 120) {
    if (s.length <= maxLen)
        return s;
    return s.slice(0, maxLen) + '…';
}
export function isProbablyBinary(content) {
    // Only treat as binary if contains null byte
    // Allow ANSI escape sequences (common in logs) - they contain ESC (27) but are text
    if (content.includes('\0'))
        return true;
    return false;
}
//# sourceMappingURL=masking.js.map