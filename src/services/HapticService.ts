/**
 * Reusable Central Haptic Feedback Service
 *
 * Provides short, tactile vibration patterns on supported devices
 * without delaying UI execution or crashing unsupported platforms.
 */

const HAPTIC_PREF_KEY = 'pantry_haptic_feedback_enabled_v1';

class HapticServiceClass {
  private enabled: boolean;

  constructor() {
    this.enabled = this.loadPreference();
  }

  private loadPreference(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      const stored = localStorage.getItem(HAPTIC_PREF_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
      // Default to ON if device supports vibration
      return this.isSupported();
    } catch {
      return false;
    }
  }

  /** Check if browser / device supports navigator.vibrate */
  public isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      typeof navigator.vibrate === 'function'
    );
  }

  /** Check if haptics are currently enabled by the user */
  public isEnabled(): boolean {
    return this.enabled;
  }

  /** Toggle or set haptic feedback preference */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(HAPTIC_PREF_KEY, enabled ? 'true' : 'false');
      }
    } catch {
      // Ignore storage errors
    }
  }

  /** Trigger raw vibration pattern safely */
  public vibrate(pattern: number | number[]): void {
    if (!this.enabled || !this.isSupported()) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Silently swallow any browser restriction or permission errors
    }
  }

  /** Subtle haptic for standard button taps, filters, tab switches, selections */
  public light(): void {
    this.vibrate(8);
  }

  /** Stronger haptic for primary actions: Scan, Start Cooking, Save Recipe, Confirm */
  public medium(): void {
    this.vibrate(22);
  }

  /** Ultra-fast haptic for tab bar taps or list item selections */
  public selection(): void {
    this.vibrate(6);
  }

  /** Dual-pulse haptic for successful actions (scan success, recipe generated, step completed) */
  public success(): void {
    this.vibrate([12, 35, 12]);
  }

  /** Warning haptic for non-fatal alerts */
  public warning(): void {
    this.vibrate([18, 40, 18]);
  }

  /** Error pulse for failures */
  public error(): void {
    this.vibrate([35, 50, 35]);
  }
}

export const haptics = new HapticServiceClass();
