export function formatJson(result) {
    // Strip internal fields that contain secrets
    const safeFindings = result.findings.map(f => {
        const { _rawMatch, _secretValue, ...safe } = f;
        return safe;
    });
    const bySeverity = {};
    const byCategory = {};
    for (const f of safeFindings) {
        bySeverity[f.severity] = (bySeverity[f.severity] || 0) + 1;
        byCategory[f.category] = (byCategory[f.category] || 0) + 1;
    }
    const report = {
        version: '0.1.0',
        timestamp: new Date().toISOString(),
        scannedFiles: result.scannedFiles,
        findings: safeFindings,
        skippedFiles: result.skippedFiles,
        errors: result.errors,
        summary: {
            total: safeFindings.length,
            bySeverity,
            byCategory,
        },
    };
    return JSON.stringify(report, null, 2);
}
//# sourceMappingURL=json.js.map