import type { RedactResult } from './types.js';
export interface RedactOptions {
    customPatterns?: {
        id: string;
        pattern: string;
        severity?: string;
        confidence?: string;
        category?: string;
        description?: string;
    }[];
    preserveStructure?: boolean;
}
export declare function redactContent(content: string, options?: RedactOptions): RedactResult;
//# sourceMappingURL=redactor.d.ts.map