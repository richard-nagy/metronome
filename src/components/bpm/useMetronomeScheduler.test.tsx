import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SoundOption } from "@/types/types";
import { maxBpm, minBpm } from "../constants";
import { useMetronomeScheduler } from "./useMetronomeScheduler";

type SchedulerProps = Parameters<typeof useMetronomeScheduler>[0];

interface MockSource {
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    connect: ReturnType<typeof vi.fn>;
    onended: (() => void) | null;
}

let currentResult: ReturnType<typeof useMetronomeScheduler>;
let root: Root | undefined;
let sources: MockSource[];

function HookHarness({ config }: { config: SchedulerProps }) {
    currentResult = useMetronomeScheduler(config);
    return null;
}

function makeConfig(overrides: Partial<SchedulerProps> = {}): SchedulerProps {
    return {
        bpm: 120,
        bpmRampEnabled: false,
        bpmRampBars: 1,
        bpmRampAmount: 5,
        beatsPerBar: 4,
        subdivisionsPerBeat: 1,
        countInEnabled: false,
        volume: 1,
        soundOption: SoundOption.All,
        onBpmChange: vi.fn(),
        ...overrides,
    };
}

function mountScheduler(config: SchedulerProps) {
    const container = document.createElement("div");
    root = createRoot(container);
    act(() => root?.render(<HookHarness config={config} />));
}

function updateScheduler(config: SchedulerProps) {
    if (!root) {
        throw new Error("Scheduler has not been mounted");
    }
    act(() => root?.render(<HookHarness config={config} />));
}

async function flushPromises() {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
}

async function startScheduler() {
    await act(async () => {
        currentResult.toggle();
        await flushPromises();
    });
}

function makeSource(): MockSource {
    const source: MockSource = {
        start: vi.fn(),
        stop: vi.fn(),
        connect: vi.fn(),
        onended: null,
    };
    sources.push(source);
    return source;
}

beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(0));
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    sources = [];

    const audioContext = {
        get currentTime() {
            return Date.now() / 1000;
        },
        destination: {},
        state: "running",
        resume: vi.fn(async () => undefined),
        close: vi.fn(async () => undefined),
        decodeAudioData: vi.fn(
            async () => ({}),
        ) as unknown as AudioContext["decodeAudioData"],
        createGain: vi.fn(() => ({
            gain: {
                setValueAtTime: vi.fn(),
                exponentialRampToValueAtTime: vi.fn(),
            },
            connect: vi.fn(),
        })),
        createBufferSource: vi.fn(() => ({
            ...makeSource(),
            buffer: null,
        })),
        createOscillator: vi.fn(() => ({
            ...makeSource(),
            frequency: { setValueAtTime: vi.fn() },
        })),
    } as unknown as AudioContext;

    vi.stubGlobal(
        "AudioContext",
        class MockAudioContext {
            constructor() {
                return audioContext as unknown as this;
            }
        },
    );
    vi.stubGlobal(
        "fetch",
        vi.fn(async () => ({
            ok: true,
            arrayBuffer: async () => new ArrayBuffer(0),
        })),
    );
});

afterEach(() => {
    if (root) {
        act(() => root?.unmount());
        root = undefined;
    }
    vi.useRealTimers();
    vi.unstubAllGlobals();
});

describe("useMetronomeScheduler", () => {
    it("cancels a count-in without starting playback", async () => {
        mountScheduler(makeConfig({ countInEnabled: true }));

        await act(async () => {
            currentResult.toggle();
            await flushPromises();
        });

        expect(currentResult.countdown).toBe(4);
        expect(currentResult.isRunning).toBe(false);

        act(() => currentResult.stop());
        await act(async () => {
            await vi.advanceTimersByTimeAsync(2000);
        });

        expect(currentResult.countdown).toBeNull();
        expect(currentResult.isRunning).toBe(false);
    });

    it("starts playback after the count-in completes", async () => {
        mountScheduler(makeConfig({ countInEnabled: true }));

        await act(async () => {
            currentResult.toggle();
            await flushPromises();
        });
        await act(async () => {
            await vi.advanceTimersByTimeAsync(2000);
        });

        expect(currentResult.countdown).toBeNull();
        expect(currentResult.isRunning).toBe(true);
    });

    it("plays subdivision clicks on full beats only", async () => {
        mountScheduler(
            makeConfig({
                subdivisionsPerBeat: 2,
                soundOption: SoundOption.Full,
            }),
        );

        await startScheduler();
        await act(async () => {
            await vi.advanceTimersByTimeAsync(500);
        });

        expect(currentResult.isRunning).toBe(true);
        expect(sources).toHaveLength(2);
    });

    it.each([
        { subdivisionsPerBeat: 2, nextTickTime: 0.3 },
        { subdivisionsPerBeat: 3, nextTickTime: 0.05 + 0.5 / 3 },
        { subdivisionsPerBeat: 4, nextTickTime: 0.175 },
    ])(
        "spaces $subdivisionsPerBeat ticks per beat evenly",
        async ({ subdivisionsPerBeat, nextTickTime }) => {
            mountScheduler(makeConfig({ subdivisionsPerBeat }));

            await startScheduler();
            await act(async () => {
                await vi.advanceTimersByTimeAsync(250);
            });

            expect(sources[1]?.start.mock.calls[0]?.[0]).toBeCloseTo(
                nextTickTime,
            );
        },
    );

    it("plays only main beats in triplet mode when full beats are selected", async () => {
        mountScheduler(
            makeConfig({
                beatsPerBar: 2,
                subdivisionsPerBeat: 3,
                soundOption: SoundOption.Full,
            }),
        );

        await startScheduler();
        await act(async () => {
            await vi.advanceTimersByTimeAsync(1100);
        });

        expect(sources).toHaveLength(3);
    });

    it("falls back to oscillator clicks when the sound asset fails to load", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => {
                throw new Error("Sound asset unavailable");
            }),
        );
        mountScheduler(makeConfig());

        await startScheduler();

        expect(sources).toHaveLength(1);
        expect(sources[0]?.start).toHaveBeenCalledWith(0.05);
        expect(sources[0]?.stop.mock.calls[0]?.[0]).toBeCloseTo(0.09);
    });

    it("plays only the first beat of each bar", async () => {
        mountScheduler(
            makeConfig({
                beatsPerBar: 2,
                soundOption: SoundOption.First,
            }),
        );

        await startScheduler();
        await act(async () => {
            await vi.advanceTimersByTimeAsync(1100);
        });

        expect(sources).toHaveLength(2);
    });

    it("reschedules queued clicks when the tempo changes during playback", async () => {
        const config = makeConfig({ beatsPerBar: 2 });
        mountScheduler(config);

        await startScheduler();
        await act(async () => {
            await vi.advanceTimersByTimeAsync(500);
        });

        const queuedClick = sources[1];
        expect(queuedClick).toBeDefined();

        updateScheduler({ ...config, bpm: 60 });
        await act(async () => {
            await vi.advanceTimersByTimeAsync(600);
        });

        expect(queuedClick?.stop).toHaveBeenCalledOnce();
        expect(sources).toHaveLength(3);
        expect(sources[2]?.start).toHaveBeenCalledWith(1.05);
    });

    it("reschedules queued clicks when subdivisions change during playback", async () => {
        const config = makeConfig();
        mountScheduler(config);

        await startScheduler();
        await act(async () => {
            await vi.advanceTimersByTimeAsync(500);
        });

        const queuedClick = sources[1];
        expect(queuedClick).toBeDefined();

        updateScheduler({ ...config, subdivisionsPerBeat: 2 });
        await act(async () => {
            await vi.advanceTimersByTimeAsync(100);
        });

        expect(queuedClick?.stop).toHaveBeenCalledOnce();
        expect(sources).toHaveLength(3);
        expect(sources[2]?.start.mock.calls[0]?.[0]).toBeCloseTo(0.545);
    });

    it("waits the configured number of bars before ramping the tempo", async () => {
        const onBpmChange = vi.fn();
        mountScheduler(
            makeConfig({
                beatsPerBar: 2,
                bpmRampEnabled: true,
                bpmRampBars: 2,
                bpmRampAmount: 5,
                onBpmChange,
            }),
        );

        await startScheduler();
        await act(async () => {
            await vi.advanceTimersByTimeAsync(1400);
        });
        expect(onBpmChange).not.toHaveBeenCalled();

        await act(async () => {
            await vi.advanceTimersByTimeAsync(300);
        });

        expect(onBpmChange).toHaveBeenCalledOnce();
        expect(onBpmChange).toHaveBeenCalledWith(125);
    });

    it.each([
        {
            bpm: maxBpm - 2,
            bpmRampAmount: 5,
            expectedBpm: maxBpm,
            elapsedMs: 600,
        },
        {
            bpm: minBpm + 2,
            bpmRampAmount: -5,
            expectedBpm: minBpm,
            elapsedMs: 1600,
        },
    ])(
        "clamps a ramp from $bpm BPM to $expectedBpm BPM",
        async ({ bpm, bpmRampAmount, expectedBpm, elapsedMs }) => {
            const onBpmChange = vi.fn();
            mountScheduler(
                makeConfig({
                    bpm,
                    beatsPerBar: 2,
                    bpmRampEnabled: true,
                    bpmRampAmount,
                    onBpmChange,
                }),
            );

            await startScheduler();
            await act(async () => {
                await vi.advanceTimersByTimeAsync(elapsedMs);
            });

            expect(onBpmChange).toHaveBeenCalledWith(expectedBpm);
        },
    );
});
