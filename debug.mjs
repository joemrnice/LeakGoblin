
import { detectSecrets } from './dist/engine/detector.js';
const CANARY = 'AKIAIOSFODNN7EXAMPLE';
const evil = '\x1b[2J\x1b[H' + CANARY + '\n\x1b[31mred';
console.log('evil length', evil.length);
console.log('evil codes', [...evil].map(c => c.charCodeAt(0)));
const result = detectSecrets(evil);
console.log('findings', result.findings.length);
console.log(JSON.stringify(result.findings, null, 2));
