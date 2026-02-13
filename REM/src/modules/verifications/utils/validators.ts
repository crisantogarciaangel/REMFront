export function isValidEmail(email: string): boolean {
  const v = email.trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function isValidPhone(phone: string): boolean {
  const v = phone.replace(/\s/g, '').trim();
  return /^\d{8,15}$/.test(v);
}
