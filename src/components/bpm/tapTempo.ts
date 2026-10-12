import { maxBpm, minBpm } from "../constants";

export const tapResetAfterMs = 2000;
const maxTapIntervals = 4;

export function estimateTapTempoFromElapsedMs(elapsedMs: number): number {
    const shortestInterval = 60000 / maxBpm;
    const longestInterval = 60000 / minBpm;
    const interval = Math.min(
        longestInterval,
        Math.max(shortestInterval, elapsedMs),
    );

    return Math.min(maxBpm, Math.max(minBpm, Math.round(60000 / interval)));
}

interface TapTempoResult {
    tapTimes: number[];
    bpm: number | null;
}

export function registerTempoTap(
    previousTapTimes: number[],
    tappedAt: number,
): TapTempoResult {
    const recentTapTimes = previousTapTimes.filter(
        (tapTime) => tappedAt - tapTime <= tapResetAfterMs,
    );
    const tapTimes = [...recentTapTimes, tappedAt].slice(
        -(maxTapIntervals + 1),
    );

    const intervals = tapTimes
        .slice(1)
        .map((tapTime, index) => tapTime - tapTimes[index]!)
        .filter((interval) => interval > 0);

    if (intervals.length === 0) {
        return { tapTimes, bpm: null };
    }

    const averageInterval =
        intervals.reduce((total, interval) => total + interval, 0) /
        intervals.length;
    const bpm = Math.round(60000 / averageInterval);

    return {
        tapTimes,
        bpm: Math.min(maxBpm, Math.max(minBpm, bpm)),
    };
}
