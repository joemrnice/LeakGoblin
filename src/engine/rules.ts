import type { DetectionRule } from './types.js';

/**
 * Core detection rules - all use synthetic patterns, no real credentials
 * Each rule focuses on format-specific signatures with conservative confidence
 */
export const CORE_RULES: DetectionRule[] = [
  {
    id: 'private_key_block',
    name: 'Private Key Block',
    category: 'private_key',
    description: 'PEM private key block',
    pattern: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g,
    severity: 'critical',
    confidence: 'high',
    redactGroupOnly: false,
  },
  {
    id: 'aws_access_key',
    name: 'AWS Access Key',
    category: 'cloud_credential',
    description: 'AWS Access Key ID format AKIA...',
    pattern: /\b(AKIA[0-9A-Z]{16})\b/g,
    secretGroupIndex: 1,
    severity: 'high',
    confidence: 'high',
    redactGroupOnly: true,
  },
  {
    id: 'aws_secret_key_assignment',
    name: 'AWS Secret Assignment',
    category: 'cloud_credential',
    description: 'aws_secret_access_key assignment',
    pattern: /(?:aws_secret_access_key|aws_secret|AWSSecretKey)\s*[:=]\s*['"]?([A-Za-z0-9/+=]{40})['"]?/gi,
    secretGroupIndex: 1,
    severity: 'critical',
    confidence: 'high',
    redactGroupOnly: true,
  },
  {
    id: 'github_token',
    name: 'GitHub Token',
    category: 'api_key',
    description: 'GitHub PAT ghp_, gho_, ghu_, ghs_, ghr_, github_pat_',
    pattern: /\b((?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36,}|github_pat_[A-Za-z0-9_]{22,})\b/g,
    secretGroupIndex: 1,
    severity: 'critical',
    confidence: 'high',
    redactGroupOnly: true,
  },
  {
    id: 'stripe_key',
    name: 'Stripe API Key',
    category: 'api_key',
    description: 'Stripe sk_live_, sk_test_, rk_ keys',
    pattern: /\b((?:sk|rk)_(?:live|test)_[A-Za-z0-9]{20,})\b/g,
    secretGroupIndex: 1,
    severity: 'high',
    confidence: 'high',
    redactGroupOnly: true,
  },
  {
    id: 'slack_token',
    name: 'Slack Token',
    category: 'api_key',
    description: 'Slack xox tokens',
    pattern: /\b(xox[abpras]-[A-Za-z0-9-]{10,})\b/g,
    secretGroupIndex: 1,
    severity: 'high',
    confidence: 'high',
    redactGroupOnly: true,
  },
  {
    id: 'google_api_key',
    name: 'Google API Key',
    category: 'api_key',
    description: 'Google API key AIza...',
    pattern: /\b(AIza[0-9A-Za-z_-]{35})\b/g,
    secretGroupIndex: 1,
    severity: 'high',
    confidence: 'high',
    redactGroupOnly: true,
  },
  {
    id: 'openai_key',
    name: 'OpenAI API Key',
    category: 'api_key',
    description: 'OpenAI sk-proj or sk-...',
    pattern: /\b(sk-(?:proj-)?[A-Za-z0-9_-]{20,})\b/g,
    secretGroupIndex: 1,
    severity: 'high',
    confidence: 'medium',
    redactGroupOnly: true,
  },
  {
    id: 'bearer_token',
    name: 'Bearer Token',
    category: 'bearer_token',
    description: 'Authorization: Bearer <token>',
    pattern: /Bearer\s+([A-Za-z0-9\-_.~+\/]+=*)\b/gi,
    secretGroupIndex: 1,
    severity: 'high',
    confidence: 'medium',
    redactGroupOnly: true,
  },
  {
    id: 'jwt_token',
    name: 'JWT Token',
    category: 'jwt',
    description: 'JSON Web Token eyJ...',
    pattern: /\b(eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})\b/g,
    secretGroupIndex: 1,
    severity: 'medium',
    confidence: 'medium',
    redactGroupOnly: true,
  },
  {
    id: 'password_assignment',
    name: 'Password Assignment',
    category: 'password',
    description: 'password, passwd, pwd assignment with value',
    pattern: /(?:password|passwd|pwd)\s*[:=]\s*['"]?([^\s'";]{8,})['"]?/gi,
    secretGroupIndex: 1,
    severity: 'high',
    confidence: 'medium',
    redactGroupOnly: true,
  },
  {
    id: 'secret_assignment',
    name: 'Secret Assignment',
    category: 'password',
    description: 'secret, api_key assignment',
    pattern: /(?:api[_-]?key|secret|client_secret)\s*[:=]\s*['"]?([A-Za-z0-9_\-]{16,})['"]?/gi,
    secretGroupIndex: 1,
    severity: 'high',
    confidence: 'medium',
    redactGroupOnly: true,
  },
  {
    id: 'db_connection_string',
    name: 'Database Connection String',
    category: 'connection_string',
    description: 'mongodb, postgres, mysql, redis with credentials',
    pattern: /\b((?:mongodb|postgres|postgresql|mysql|redis):\/\/[^\s'";]+)/gi,
    secretGroupIndex: 1,
    severity: 'critical',
    confidence: 'high',
    redactGroupOnly: true,
  },
  {
    id: 'env_sensitive',
    name: 'Sensitive Env Var',
    category: 'env_var',
    description: '.env variable with sensitive name and value',
    pattern: /^\s*([A-Za-z_][A-Za-z0-9_]*?(?:API_KEY|SECRET|PASSWORD|TOKEN|PRIVATE_KEY|AWS_|GITHUB_)\w*)\s*=\s*(.+)$/gim,
    secretGroupIndex: 2,
    severity: 'high',
    confidence: 'high',
    redactGroupOnly: true,
  },
  {
    id: 'generic_high_entropy',
    name: 'High Entropy String (Heuristic)',
    category: 'generic_secret',
    description: 'Long random-looking string - heuristic only, not proof of secret',
    // Very conservative: 32+ chars, mix of cases/digits, not URL, not common words
    pattern: /\b([A-Za-z0-9_\-+/=]{32,})\b/g,
    secretGroupIndex: 1,
    severity: 'low',
    confidence: 'low',
    redactGroupOnly: true,
  },
];

export function getRulesWithCustom(customPatterns: { id: string; pattern: string; severity?: string; confidence?: string; category?: string; description?: string }[] = []): DetectionRule[] {
  const customRules: DetectionRule[] = customPatterns.map(cp => {
    try {
      const re = new RegExp(cp.pattern, 'gi');
      return {
        id: cp.id,
        name: `Custom: ${cp.id}`,
        category: (cp.category as any) || 'custom',
        description: cp.description || `Custom pattern ${cp.id}`,
        pattern: re,
        severity: (cp.severity as any) || 'medium',
        confidence: (cp.confidence as any) || 'medium',
        redactGroupOnly: false,
      };
    } catch {
      // Invalid regex - skip
      return null as any;
    }
  }).filter(Boolean);

  return [...CORE_RULES, ...customRules];
}

export const DEFAULT_EXCLUSIONS = [
  '.git',
  'node_modules',
  'dist',
  'build',
  '.next',
  'coverage',
  '.turbo',
  '.parcel-cache',
  'vendor',
  '__pycache__',
  '.venv',
  'target',
  '.idea',
  '.vscode',
];

export const DEFAULT_SUPPORTED_EXTENSIONS = new Set([
  '.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs',
  '.json', '.env', '.env.example', '.env.local', '.env.development', '.env.production',
  '.yml', '.yaml', '.toml', '.ini', '.conf', '.config',
  '.sh', '.bash', '.zsh',
  '.py', '.rb', '.go', '.java', '.php', '.rs', '.swift', '.kt',
  '.md', '.txt', '.log',
  '.dockerfile', 'Dockerfile',
]);
