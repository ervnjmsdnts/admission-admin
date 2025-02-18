import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(word: string) {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function separateCapitals(str: string) {
  if (typeof str !== 'string') return str;
  return capitalizeFirstLetter(str.replace(/(\w)([A-Z])/g, '$1 $2'));
}
