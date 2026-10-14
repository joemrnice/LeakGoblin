export interface FileScanOptions {
    exclude?: string[];
    includeExtensions?: string[];
    maxFileSizeMB?: number;
}
export interface WalkResult {
    files: string[];
    skipped: {
        file: string;
        reason: string;
    }[];
}
export declare function shouldExclude(filePath: string, exclusions: string[]): boolean;
export declare function isSupportedFile(filePath: string, supportedExtensions: Set<string>): boolean;
export declare function walkDirectory(root: string, options?: FileScanOptions): WalkResult;
export declare function readFileSafe(filePath: string): {
    content?: string;
    error?: string;
};
//# sourceMappingURL=fs.d.ts.map