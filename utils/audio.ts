export const playSound = (soundUrl: string | undefined, isMuted: boolean) => {
  if (soundUrl && !isMuted) {
    try {
      const audio = new Audio(soundUrl);
      audio.play().catch(error => console.error("Audio play failed:", error));
    } catch (error) {
      console.error("Error creating audio object:", error);
    }
  }
};