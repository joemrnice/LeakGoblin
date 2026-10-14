import fs from 'node:fs';
export async function readStdin() {
    return new Promise((resolve, reject) => {
        let data = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (chunk) => {
            data += chunk;
            // Prevent huge stdin from crashing - limit to 10MB
            if (data.length > 10 * 1024 * 1024) {
                process.stdin.pause();
                reject(new Error('stdin too large (>10MB) - use file scan instead'));
            }
        });
        process.stdin.on('end', () => resolve(data));
        process.stdin.on('error', (err) => reject(err));
    });
}
export function readFileOrStdin(filePath) {
    if (filePath) {
        return fs.readFileSync(filePath, 'utf8');
    }
    // Sync stdin read if possible - fallback
    return fs.readFileSync(0, 'utf8');
}
//# sourceMappingURL=input.js.map