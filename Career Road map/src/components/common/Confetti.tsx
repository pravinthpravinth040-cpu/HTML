import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
    });
  } catch (err) {
    // Graceful fallback if canvas is not ready
  }
};
