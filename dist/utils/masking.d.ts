export declare function maskValue(): string;
export declare function maskSnippet(snippet: string, secret: string): string;
export declare function createRedactedMarker(category: string, ruleId: string): string;
export declare function redactLinePreservingStructure(line: string, secret: string, marker: string): string;
export declare function truncateForDisplay(s: string, maxLen?: number): string;
export declare function isProbablyBinary(content: string): boolean;
//# sourceMappingURL=masking.d.ts.map