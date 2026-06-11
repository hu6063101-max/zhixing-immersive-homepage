import { describe, expect, it, vi } from "vitest";
import { createAudioController } from "../src/audio-controller.js";

function createAudio() {
  return {
    muted: false,
    paused: true,
    volume: 1,
    play: vi.fn(function play() {
      this.paused = false;
      return Promise.resolve();
    }),
  };
}

describe("audio controller", () => {
  it("starts the soundtrack once and applies the target volume", async () => {
    const audio = createAudio();
    const controller = createAudioController(audio, { volume: 0.42 });

    await controller.start();
    await controller.start();

    expect(audio.volume).toBe(0.42);
    expect(audio.play).toHaveBeenCalledTimes(1);
    expect(controller.getState()).toMatchObject({ started: true, muted: false });
  });

  it("toggles mute and informs subscribers", () => {
    const audio = createAudio();
    const controller = createAudioController(audio);
    const listener = vi.fn();

    controller.subscribe(listener);
    controller.toggleMute();

    expect(audio.muted).toBe(true);
    expect(listener).toHaveBeenLastCalledWith({ started: false, muted: true });
  });
});

