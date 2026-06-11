export function createAudioController(audio, options = {}) {
  const listeners = new Set();
  const volume = options.volume ?? 0.55;
  let started = false;

  audio.volume = volume;

  const getState = () => ({ started, muted: audio.muted });
  const notify = () => listeners.forEach((listener) => listener(getState()));

  return {
    async start() {
      if (started) return;
      await audio.play();
      started = true;
      notify();
    },
    toggleMute() {
      audio.muted = !audio.muted;
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getState,
  };
}

