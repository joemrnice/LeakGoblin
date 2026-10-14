import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_CONFIG, validateConfig } from './schema.js';
const CONFIG_FILE_NAMES = [
    'leakgoblin.config.json',
    '.leakgoblinrc.json',
    '.leakgoblinrc',
    'leakgoblin.json',
];
export function loadConfig(startDir = process.cwd(), customPath) {
    if (customPath) {
        try {
            const abs = path.isAbsolute(customPath) ? customPath : path.resolve(startDir, customPath);
            if (!fs.existsSync(abs)) {
                return { config: DEFAULT_CONFIG, errors: [`Config file not found: ${abs}`] };
            }
            const content = fs.readFileSync(abs, 'utf8');
            const parsed = JSON.parse(content);
            const validation = validateConfig(parsed);
            if (!validation.valid) {
                return { config: DEFAULT_CONFIG, path: abs, errors: validation.errors };
            }
            return { config: { ...DEFAULT_CONFIG, ...parsed }, path: abs };
        }
        catch (e) {
            return { config: DEFAULT_CONFIG, errors: [e.message || String(e)] };
        }
    }
    // Search upwards from startDir
    let current = path.resolve(startDir);
    const root = path.parse(current).root;
    while (true) {
        for (const fileName of CONFIG_FILE_NAMES) {
            const candidate = path.join(current, fileName);
            if (fs.existsSync(candidate)) {
                try {
                    const content = fs.readFileSync(candidate, 'utf8');
                    const parsed = JSON.parse(content);
                    const validation = validateConfig(parsed);
                    if (!validation.valid) {
                        return { config: DEFAULT_CONFIG, path: candidate, errors: validation.errors };
                    }
                    return { config: { ...DEFAULT_CONFIG, ...parsed }, path: candidate };
                }
                catch (e) {
                    return { config: DEFAULT_CONFIG, path: candidate, errors: [e.message || String(e)] };
                }
            }
        }
        if (current === root)
            break;
        current = path.dirname(current);
    }
    return { config: DEFAULT_CONFIG };
}
//# sourceMappingURL=loader.js.map