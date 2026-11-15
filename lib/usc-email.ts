const uscEmailPattern = /^[^\s@]+@usc\.edu$/i;

export function isUscEmail(email: string): boolean {
  return uscEmailPattern.test(email.trim());
}
