import type { ScanResult } from '../engine/types.js';
export interface FormatOptions {
    noColor?: boolean;
    showAscii?: boolean;
}
export declare function formatFindings(result: ScanResult, options?: FormatOptions): string;
export declare function formatSummary(result: ScanResult, options?: FormatOptions): string;
//# sourceMappingURL=formatter.d.ts.map