import { describe, expect, it, vi } from "vitest";
import { enterExperience } from "../src/enter-experience.js";

describe("enter experience", () => {
  it("enters immediately without waiting for audio playback", () => {
    const startAudio = vi.fn(() => new Promise(() => {}));
    const onEnter = vi.fn();
    const onAudioError = vi.fn();

    enterExperience({ startAudio, onEnter, onAudioError });

    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(startAudio).toHaveBeenCalledTimes(1);
    expect(onAudioError).not.toHaveBeenCalled();
  });
});

