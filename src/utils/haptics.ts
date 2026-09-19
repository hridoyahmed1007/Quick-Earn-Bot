/**
 * Haptic feedback helper that integrates with Telegram WebApp SDK
 * and provides a fallback to navigator.vibrate for mobile browsers.
 */

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready?: () => void;
        expand?: () => void;
        close?: () => void;
        HapticFeedback?: {
          impactOccurred?: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred?: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged?: () => void;
        };
      };
    };
  }
}

export const triggerHaptic = (style: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error' = 'light') => {
  try {
    const tgHaptic = typeof window !== 'undefined' ? window.Telegram?.WebApp?.HapticFeedback : undefined;
    if (tgHaptic) {
      if (style === 'selection') {
        tgHaptic.selectionChanged?.();
      } else if (style === 'success' || style === 'warning' || style === 'error') {
        tgHaptic.notificationOccurred?.(style);
      } else {
        tgHaptic.impactOccurred?.(style);
      }
      return;
    }

    // Fallback browser Vibration API
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      if (style === 'heavy' || style === 'error') {
        navigator.vibrate([20, 50, 20]);
      } else if (style === 'success') {
        navigator.vibrate([15, 30, 15]);
      } else {
        navigator.vibrate(10);
      }
    }
  } catch (e) {
    // Ignore haptic error on desktop/unsupported devices
  }
};

export default triggerHaptic;
