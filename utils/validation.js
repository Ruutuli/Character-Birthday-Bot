import { config } from '../config.js';

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateDate(dateString) {
  const regex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  
  if (!regex.test(dateString)) {
    throw new ValidationError(config.errors.invalidDate);
  }

  const [month, day] = dateString.split('-').map(Number);
  
  // Additional validation for specific months
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  if (day > daysInMonth[month - 1]) {
    throw new ValidationError('Invalid day for the specified month.');
  }

  return { month, day };
}

export function validateImageUrl(url) {
  if (!url || typeof url !== 'string') {
    throw new ValidationError(config.errors.invalidImageUrl);
  }

  if (url.length > config.maxImageUrlLength) {
    throw new ValidationError(config.errors.imageUrlTooLong);
  }

  // Basic URL validation
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new ValidationError('Image URL must use HTTP or HTTPS protocol.');
    }
  } catch (error) {
    throw new ValidationError('Invalid image URL format.');
  }

  // Check for Discord CDN links (which might not work as images)
  if (url.includes('cdn.discordapp.com') || url.includes('media.discordapp.net')) {
    throw new ValidationError('Discord CDN links are not supported. Please use a direct image URL.');
  }

  return true;
}

export function validateName(name) {
  if (!name || typeof name !== 'string') {
    throw new ValidationError('Character name is required.');
  }

  const trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    throw new ValidationError('Character name cannot be empty.');
  }

  if (trimmedName.length > config.maxNameLength) {
    throw new ValidationError(config.errors.nameTooLong);
  }

  // Check for potentially problematic characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(trimmedName)) {
    throw new ValidationError('Character name contains invalid characters.');
  }

  return trimmedName;
}

export function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('default', { month: 'long' });
}

export function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
} 