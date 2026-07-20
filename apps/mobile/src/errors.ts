interface ValidationIssue {
  message?: unknown;
}

function validationMessages(error: unknown): string[] {
  if (!error || typeof error !== 'object' || !('issues' in error)) return [];
  const issues = (error as { issues?: unknown }).issues;
  if (!Array.isArray(issues)) return [];
  return issues
    .map((issue) => (issue as ValidationIssue).message)
    .filter((message): message is string => typeof message === 'string' && message.length > 0);
}

export function errorMessage(error: unknown, fallback: string): string {
  const messages = [...new Set(validationMessages(error))];
  if (messages.length) return messages.join('\n');
  return error instanceof Error && error.message ? error.message : fallback;
}
