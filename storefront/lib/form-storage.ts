/**
 * Form data persistence utility
 * Stores form data in localStorage to preserve it between page navigations
 */

const FORM_DATA_KEY = 'auth_form_data';

export interface AuthFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

/**
 * Save form data to localStorage
 */
export function saveFormData(data: Partial<AuthFormData>): void {
  try {
    const existing = getFormData();
    const merged = { ...existing, ...data };
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(merged));
  } catch (error) {
    console.error('Failed to save form data:', error);
  }
}

/**
 * Get saved form data from localStorage
 */
export function getFormData(): Partial<AuthFormData> {
  try {
    const data = localStorage.getItem(FORM_DATA_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to get form data:', error);
    return {};
  }
}

/**
 * Clear saved form data
 */
export function clearFormData(): void {
  try {
    localStorage.removeItem(FORM_DATA_KEY);
  } catch (error) {
    console.error('Failed to clear form data:', error);
  }
}

/**
 * Save "Remember Me" preference
 */
export function setRememberMe(remember: boolean): void {
  try {
    localStorage.setItem('remember_me', remember ? 'true' : 'false');
  } catch (error) {
    console.error('Failed to save remember me preference:', error);
  }
}

/**
 * Get "Remember Me" preference
 */
export function getRememberMe(): boolean {
  try {
    return localStorage.getItem('remember_me') === 'true';
  } catch (error) {
    return false;
  }
}
