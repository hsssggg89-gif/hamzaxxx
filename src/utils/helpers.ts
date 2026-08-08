import { Farmer } from '../types';
import { INITIAL_FARMERS } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'agri_land_conformity_farmers_v1';

/**
 * Get stored farmers or seed with default initial sample data
 */
export function getStoredFarmers(): Farmer[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_FARMERS));
      return INITIAL_FARMERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 0) {
      return parsed;
    }
    return INITIAL_FARMERS;
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return INITIAL_FARMERS;
  }
}

/**
 * Save farmers list to localStorage
 */
export function saveFarmers(farmers: Farmer[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(farmers));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

/**
 * Reset localStorage with initial sample dataset
 */
export function resetSampleFarmers(): Farmer[] {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_FARMERS));
  return INITIAL_FARMERS;
}

/**
 * Open coordinates in Google Earth Web
 */
export function openGoogleEarth(coordinates: string): void {
  if (!coordinates || !coordinates.trim()) {
    alert('عفواً، يرجى إدخال إحداثيات القطعة أولاً (مثال: 34.8516, 5.7281)');
    return;
  }
  const cleanCoords = encodeURIComponent(coordinates.trim());
  const url = `https://earth.google.com/web/search/${cleanCoords}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Format Arabic date display safely
 */
export function formatDateArabic(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}
