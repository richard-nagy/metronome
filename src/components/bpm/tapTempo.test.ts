import { describe, expect, it } from "vitest";
import { maxBpm, minBpm } from "../constants";
import { estimateTapTempoFromElapsedMs, registerTempoTap } from "./tapTempo";

describe("registerTempoTap", () => {
    it("estimates BPM from the average of recent tap intervals", () => {
        const firstTap = registerTempoTap([], 0);
        const secondTap = registerTempoTap(firstTap.tapTimes, 500);
        const thirdTap = registerTempoTap(secondTap.tapTimes, 1100);

        expect(firstTap.bpm).toBeNull();
        expect(secondTap.bpm).toBe(120);
        expect(thirdTap.bpm).toBe(109);
    });

    it("starts a fresh estimate after a long pause", () => {
        const result = registerTempoTap([0, 500, 1000], 4001);

        expect(result).toEqual({ tapTimes: [4001], bpm: null });
    });

    it.each([
        { interval: 100, expectedBpm: maxBpm },
        { interval: 1800, expectedBpm: minBpm },
    ])(
        "clamps a $interval ms interval to $expectedBpm BPM",
        ({ interval, expectedBpm }) => {
            const result = registerTempoTap([0], interval);

            expect(result.bpm).toBe(expectedBpm);
        },
    );
});

describe("estimateTapTempoFromElapsedMs", () => {
    it.each([
        { elapsedMs: 0, expectedBpm: maxBpm },
        { elapsedMs: 250, expectedBpm: 240 },
        { elapsedMs: 1000, expectedBpm: 60 },
        { elapsedMs: 1500, expectedBpm: minBpm },
        { elapsedMs: 2500, expectedBpm: minBpm },
    ])(
        "estimates $expectedBpm BPM after $elapsedMs ms",
        ({ elapsedMs, expectedBpm }) => {
            expect(estimateTapTempoFromElapsedMs(elapsedMs)).toBe(expectedBpm);
        },
    );
});
