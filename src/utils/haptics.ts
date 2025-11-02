// Haptic feedback utilities for mobile devices
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'selection' = 'light') => {
  // Check if device supports haptic feedback
  if ('vibrate' in navigator) {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(20);
        break;
      case 'heavy':
        navigator.vibrate(50);
        break;
      case 'selection':
        navigator.vibrate([5, 5]);
        break;
    }
  }

  // iOS Haptic Feedback API (if available)
  if ('HapticFeedback' in window) {
    try {
      switch (type) {
        case 'light':
          (window as any).HapticFeedback.impact({ style: 'light' });
          break;
        case 'medium':
          (window as any).HapticFeedback.impact({ style: 'medium' });
          break;
        case 'heavy':
          (window as any).HapticFeedback.impact({ style: 'heavy' });
          break;
        case 'selection':
          (window as any).HapticFeedback.selection();
          break;
      }
    } catch (error) {
      // Fallback to vibration
      navigator.vibrate?.(type === 'heavy' ? 50 : type === 'medium' ? 20 : 10);
    }
  }
};

export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};