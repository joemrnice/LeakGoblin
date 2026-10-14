import type { DetectionRule } from './types.js';
/**
 * Core detection rules - all use synthetic patterns, no real credentials
 * Each rule focuses on format-specific signatures with conservative confidence
 */
export declare const CORE_RULES: DetectionRule[];
export declare function getRulesWithCustom(customPatterns?: {
    id: string;
    pattern: string;
    severity?: string;
    confidence?: string;
    category?: string;
    description?: string;
}[]): DetectionRule[];
export declare const DEFAULT_EXCLUSIONS: string[];
export declare const DEFAULT_SUPPORTED_EXTENSIONS: Set<string>;
//# sourceMappingURL=rules.d.ts.map