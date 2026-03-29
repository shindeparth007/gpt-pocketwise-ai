export function validateEmail(email) {
  if (!email || typeof email !== 'string') return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return null;
}

export function validateAmount(amount, fieldName = 'Amount') {
  if (amount === undefined || amount === null || amount === '') return `${fieldName} is required`;
  const num = Number(amount);
  if (isNaN(num)) return `${fieldName} must be a number`;
  if (num <= 0) return `${fieldName} must be greater than 0`;
  return null;
}

export function validateGoal(target, current) {
  const targetErr = validateAmount(target, 'Target amount');
  if (targetErr) return targetErr;
  if (current !== undefined && Number(target) <= Number(current)) {
    return 'Target amount must be greater than current amount';
  }
  return null;
}

export function validateRequired(fields) {
  for (const [name, value] of Object.entries(fields)) {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
      return `${name} is required`;
    }
  }
  return null;
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}
