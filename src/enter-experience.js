export function enterExperience({ startAudio, onEnter, onAudioError }) {
  onEnter();
  try {
    Promise.resolve(startAudio()).catch(onAudioError);
  } catch (error) {
    onAudioError(error);
  }
}
