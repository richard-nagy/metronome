import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SoundOption } from "@/types/types";
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
        showSubdivisions: false,
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

    it("plays subdivision clicks on full beats only", async () => {
        mountScheduler(
            makeConfig({
                showSubdivisions: true,
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

    it("ramps the tempo after the configured number of bars", async () => {
        const onBpmChange = vi.fn();
        mountScheduler(
            makeConfig({
                beatsPerBar: 2,
                bpmRampEnabled: true,
                bpmRampBars: 1,
                bpmRampAmount: 5,
                onBpmChange,
            }),
        );

        await startScheduler();
        await act(async () => {
            await vi.advanceTimersByTimeAsync(600);
        });

        expect(onBpmChange).toHaveBeenCalledWith(125);
    });
});
