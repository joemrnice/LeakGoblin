export interface LeakGoblinConfig {
    version?: number;
    exclude?: string[];
    includeExtensions?: string[];
    customPatterns?: {
        id: string;
        pattern: string;
        description?: string;
        category?: string;
        severity?: 'low' | 'medium' | 'high' | 'critical';
        confidence?: 'low' | 'medium' | 'high';
    }[];
    severityThreshold?: 'low' | 'medium' | 'high' | 'critical';
    confidenceThreshold?: 'low' | 'medium' | 'high';
    allowlist?: {
        files?: string[];
        patterns?: string[];
        secrets?: string[];
    };
    maxFileSizeMB?: number;
}
export declare const DEFAULT_CONFIG: LeakGoblinConfig;
export declare function validateConfig(config: any): {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=schema.d.ts.map