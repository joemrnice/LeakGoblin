export const DEFAULT_CONFIG = {
    version: 1,
    exclude: [
        '.git',
        'node_modules',
        'dist',
        'build',
        '.next',
        'coverage',
        '.turbo',
        '.parcel-cache',
        'vendor',
        '__pycache__',
        '.venv',
        'target',
    ],
    severityThreshold: 'low',
    confidenceThreshold: 'low',
    maxFileSizeMB: 5,
};
export function validateConfig(config) {
    const errors = [];
    if (config === null || typeof config !== 'object') {
        return { valid: false, errors: ['Config must be an object'] };
    }
    if (config.customPatterns && !Array.isArray(config.customPatterns)) {
        errors.push('customPatterns must be an array');
    }
    if (config.customPatterns) {
        for (let i = 0; i < config.customPatterns.length; i++) {
            const p = config.customPatterns[i];
            if (!p.id || !p.pattern) {
                errors.push(`customPatterns[${i}] must have id and pattern`);
            }
            try {
                new RegExp(p.pattern);
            }
            catch {
                errors.push(`customPatterns[${i}] pattern is not valid RegExp: ${p.pattern}`);
            }
        }
    }
    if (config.severityThreshold && !['low', 'medium', 'high', 'critical'].includes(config.severityThreshold)) {
        errors.push('severityThreshold must be low|medium|high|critical');
    }
    if (config.confidenceThreshold && !['low', 'medium', 'high', 'critical'].includes(config.confidenceThreshold)) {
        errors.push('confidenceThreshold must be low|medium|high');
    }
    return { valid: errors.length === 0, errors };
}
//# sourceMappingURL=schema.js.map