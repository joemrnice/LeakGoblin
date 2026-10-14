export interface ScanOptions {
    stdin?: boolean;
    format?: 'text' | 'json';
    noColor?: boolean;
    quiet?: boolean;
    verbose?: boolean;
    config?: string;
    exclude?: string[];
    showAscii?: boolean;
}
export declare function scanCommand(target: string | undefined, options: ScanOptions): Promise<{
    exitCode: number;
    output: string;
}>;
//# sourceMappingURL=scan.d.ts.map