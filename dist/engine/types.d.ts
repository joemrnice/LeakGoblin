export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Confidence = 'low' | 'medium' | 'high';
export type FindingCategory = 'api_key' | 'bearer_token' | 'password' | 'private_key' | 'cloud_credential' | 'env_var' | 'connection_string' | 'auth_header' | 'jwt' | 'generic_secret' | 'custom';
export interface DetectionRule {
    id: string;
    name: string;
    category: FindingCategory;
    description: string;
    pattern: RegExp;
    secretGroupIndex?: number;
    severity: Severity;
    confidence: Confidence;
    examples?: string[];
    redactGroupOnly?: boolean;
}
export interface Finding {
    ruleId: string;
    ruleName: string;
    category: FindingCategory;
    severity: Severity;
    confidence: Confidence;
    file?: string;
    line: number;
    column: number;
    snippetMasked: string;
    matchedLength: number;
    _rawMatch?: string;
    _secretValue?: string;
}
export interface ScanResult {
    findings: Finding[];
    scannedFiles?: number;
    skippedFiles?: {
        file: string;
        reason: string;
    }[];
    errors?: {
        file: string;
        error: string;
    }[];
}
export interface RedactResult {
    sanitized: string;
    findings: Finding[];
    redactionCount: number;
}
//# sourceMappingURL=types.d.ts.map