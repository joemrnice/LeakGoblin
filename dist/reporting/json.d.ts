import type { ScanResult, Finding } from '../engine/types.js';
export interface JsonReport {
    version: string;
    timestamp: string;
    scannedFiles?: number;
    findings: Omit<Finding, '_rawMatch' | '_secretValue'>[];
    skippedFiles?: {
        file: string;
        reason: string;
    }[];
    errors?: {
        file: string;
        error: string;
    }[];
    summary: {
        total: number;
        bySeverity: Record<string, number>;
        byCategory: Record<string, number>;
    };
}
export declare function formatJson(result: ScanResult): string;
//# sourceMappingURL=json.d.ts.map