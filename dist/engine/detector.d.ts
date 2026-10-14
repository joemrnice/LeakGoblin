import type { ScanResult } from './types.js';
export interface DetectOptions {
    filePath?: string;
    customPatterns?: {
        id: string;
        pattern: string;
        severity?: string;
        confidence?: string;
        category?: string;
        description?: string;
    }[];
    minSeverity?: string;
    minConfidence?: string;
}
export declare function detectSecrets(content: string, options?: DetectOptions): ScanResult;
//# sourceMappingURL=detector.d.ts.map