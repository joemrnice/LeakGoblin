export interface SanitizeOptions {
    stdin?: boolean;
    noColor?: boolean;
    quiet?: boolean;
    config?: string;
    showSummary?: boolean;
}
export declare function sanitizeCommand(options: SanitizeOptions): Promise<{
    exitCode: number;
    output: string;
    stderr?: string;
}>;
//# sourceMappingURL=sanitize.d.ts.map