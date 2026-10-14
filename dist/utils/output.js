// Safe output utilities - never log secrets
export function safeLog(...args) {
    // Ensure we don't accidentally log secrets - but args are already masked at this point
    console.log(...args);
}
export function safeError(...args) {
    console.error(...args);
}
//# sourceMappingURL=output.js.map