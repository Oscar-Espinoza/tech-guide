import { describe, expect, it } from 'vitest';
import { isTheme, oppositeTheme, resolveTheme } from '../src/lib/theme';

describe('theme helpers', () => {
  it('prefers a valid stored preference over the system preference', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('falls back to the system preference and toggles predictably', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme('invalid', false)).toBe('light');
    expect(oppositeTheme('dark')).toBe('light');
    expect(isTheme('sepia')).toBe(false);
  });
});
