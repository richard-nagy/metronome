import { SoundId, SoundOption } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { maxBpm, minBpm, msPerMinute } from "../constants";

interface UseMetronomeSchedulerProps {
    bpm: number;
    bpmRampEnabled: boolean;
    bpmRampBars: number;
    bpmRampAmount: number;
    beatsPerBar: number;
    subdivisionsPerBeat: number;
    compoundMeter: boolean;
    countInEnabled: boolean;
    volume: number;
    soundOption: SoundOption;
    soundId: SoundId;
    onBpmChange: (bpm: number) => void;
}

const lookAheadSeconds = 0.1;
const schedulerIntervalMs = 25;

function createClickSource(
    audioContext: AudioContext,
    buffer: AudioBuffer | null,
    when: number,
    clickVolume: number,
): AudioScheduledSourceNode {
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(clickVolume, when);
    gain.connect(audioContext.destination);

    let source: AudioScheduledSourceNode;
    let oscillatorStopTime: number | undefined;

    if (buffer) {
        const bufferSource = audioContext.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(gain);
        source = bufferSource;
    } else {
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.setValueAtTime(880, when);
        gain.gain.setValueAtTime(clickVolume, when);
        gain.gain.exponentialRampToValueAtTime(0.001, when + 0.04);
        oscillator.connect(gain);
        source = oscillator;
        oscillatorStopTime = when + 0.04;
    }

    source.start(when);
    if (oscillatorStopTime !== undefined) {
        source.stop(oscillatorStopTime);
    }

    return source;
}

export function useMetronomeScheduler({
    bpm,
    bpmRampEnabled,
    bpmRampBars,
    bpmRampAmount,
    beatsPerBar,
    subdivisionsPerBeat,
    compoundMeter,
    countInEnabled,
    volume,
    soundOption,
    soundId,
    onBpmChange,
}: UseMetronomeSchedulerProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [beat, setBeat] = useState<number | undefined>(undefined);
    const [countdown, setCountdown] = useState<number | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);
    const audioBuffersRef = useRef<Partial<Record<SoundId, AudioBuffer>>>({});
    const audioBufferPromisesRef = useRef<
        Partial<Record<SoundId, Promise<AudioBuffer | null>>>
    >({});
    const startRequestRef = useRef(0);
    const isLoadingSoundRef = useRef(false);
    const countInTimerRef = useRef<number | undefined>(undefined);
    const beatRef = useRef<number | undefined>(undefined);
    const configRef = useRef({
        bpm,
        bpmRampEnabled,
        bpmRampBars,
        bpmRampAmount,
        beatsPerBar,
        subdivisionsPerBeat,
        compoundMeter,
        countInEnabled,
        volume,
        soundOption,
        soundId,
        onBpmChange,
    });

    configRef.current = {
        bpm,
        bpmRampEnabled,
        bpmRampBars,
        bpmRampAmount,
        beatsPerBar,
        subdivisionsPerBeat,
        compoundMeter,
        countInEnabled,
        volume,
        soundOption,
        soundId,
        onBpmChange,
    };

    const publishBeat = (nextBeat: number) => {
        beatRef.current = nextBeat;
        setBeat(nextBeat);
    };

    const loadSound = (audioContext: AudioContext, selectedSound: SoundId) => {
        const cachedBuffer = audioBuffersRef.current[selectedSound];
        if (cachedBuffer) {
            return Promise.resolve(cachedBuffer);
        }

        const existingPromise = audioBufferPromisesRef.current[selectedSound];
        if (existingPromise) {
            return existingPromise;
        }

        const promise = fetch(
            `${import.meta.env.BASE_URL}sounds/${selectedSound}.wav`,
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unable to load metronome sound");
                }
                return response.arrayBuffer();
            })
            .then((data) => audioContext.decodeAudioData(data))
            .then((buffer) => {
                audioBuffersRef.current[selectedSound] = buffer;
                return buffer;
            })
            .catch(() => null);

        audioBufferPromisesRef.current[selectedSound] = promise;
        return promise;
    };

    const stop = () => {
        startRequestRef.current += 1;
        isLoadingSoundRef.current = false;
        if (countInTimerRef.current !== undefined) {
            window.clearTimeout(countInTimerRef.current);
            countInTimerRef.current = undefined;
        }
        setCountdown(null);
        setIsRunning(false);
    };

    const playCountInClick = () => {
        const audioContext = audioContextRef.current;
        const clickVolume = configRef.current.volume;
        if (!audioContext || clickVolume <= 0) {
            return;
        }

        createClickSource(
            audioContext,
            audioBuffersRef.current[configRef.current.soundId] ?? null,
            audioContext.currentTime,
            clickVolume,
        );
    };

    const beginCountIn = (value: number, intervalMs: number) => {
        setCountdown(value);
        playCountInClick();
        countInTimerRef.current = window.setTimeout(() => {
            if (value > 1) {
                beginCountIn(value - 1, intervalMs);
            } else {
                countInTimerRef.current = undefined;
                setCountdown(null);
                setIsRunning(true);
            }
        }, intervalMs);
    };

    const toggle = () => {
        if (isRunning || countdown !== null || isLoadingSoundRef.current) {
            stop();
            return;
        }

        let audioContext = audioContextRef.current;
        if (!audioContext) {
            audioContext = new AudioContext();
            audioContextRef.current = audioContext;
        }

        const requestId = ++startRequestRef.current;
        isLoadingSoundRef.current = true;
        void (async () => {
            await audioContext!.resume();
            await loadSound(audioContext!, configRef.current.soundId);
            if (startRequestRef.current !== requestId) {
                return;
            }

            isLoadingSoundRef.current = false;
            beatRef.current = undefined;
            setBeat(undefined);
            const config = configRef.current;
            if (config.countInEnabled) {
                const countInStart =
                    config.bpm < 100 ? 3 : config.bpm > 200 ? 5 : 4;
                beginCountIn(countInStart, msPerMinute / config.bpm);
            } else {
                setIsRunning(true);
            }
        })();
    };

    const previewSound = async (selectedSound: SoundId) => {
        let audioContext = audioContextRef.current;
        if (!audioContext) {
            audioContext = new AudioContext();
            audioContextRef.current = audioContext;
        }

        await audioContext.resume();
        const buffer = await loadSound(audioContext, selectedSound);
        if (configRef.current.volume > 0) {
            createClickSource(
                audioContext,
                buffer,
                audioContext.currentTime,
                configRef.current.volume,
            );
        }
    };

    useEffect(() => {
        const audioContext = audioContextRef.current;
        if (audioContext) {
            void loadSound(audioContext, soundId);
        }
    }, [soundId]);

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        const audioContext = audioContextRef.current;
        if (!audioContext) {
            return;
        }

        let cancelled = false;
        let schedulerTimer: number | undefined;
        let nextBeat = 0;
        let nextBeatTime = 0;
        let lastBeatTime = audioContext.currentTime;
        let observedConfig = configRef.current;
        let completedBars = 0;
        const visualTimers = new Set<number>();
        const scheduledSources = new Map<AudioScheduledSourceNode, number>();

        const scheduleClick = (when: number, clickVolume: number) => {
            const source = createClickSource(
                audioContext,
                audioBuffersRef.current[configRef.current.soundId] ?? null,
                when,
                clickVolume,
            );
            source.onended = () => scheduledSources.delete(source);
            scheduledSources.set(source, when);
        };

        const schedule = () => {
            const config = configRef.current;
            const timingChanged =
                config.bpm !== observedConfig.bpm ||
                config.beatsPerBar !== observedConfig.beatsPerBar ||
                config.subdivisionsPerBeat !==
                    observedConfig.subdivisionsPerBeat ||
                config.compoundMeter !== observedConfig.compoundMeter;

            if (timingChanged) {
                for (const timer of visualTimers) {
                    window.clearTimeout(timer);
                }
                visualTimers.clear();

                for (const [source, startTime] of scheduledSources) {
                    if (startTime > audioContext.currentTime) {
                        source.stop();
                        scheduledSources.delete(source);
                    }
                }

                let currentBeat = beatRef.current;

                if (
                    currentBeat !== undefined &&
                    config.subdivisionsPerBeat !==
                        observedConfig.subdivisionsPerBeat
                ) {
                    const currentMainBeat = Math.floor(
                        currentBeat / observedConfig.subdivisionsPerBeat,
                    );
                    currentBeat = currentMainBeat * config.subdivisionsPerBeat;
                }

                const tickCount =
                    config.beatsPerBar * config.subdivisionsPerBeat;

                if (currentBeat !== undefined) {
                    currentBeat %= tickCount;
                    publishBeat(currentBeat);
                }

                nextBeat =
                    currentBeat === undefined
                        ? 0
                        : (currentBeat + 1) % tickCount;

                const secondsPerTick =
                    msPerMinute /
                    (config.bpm * config.subdivisionsPerBeat) /
                    1000;

                nextBeatTime =
                    currentBeat === undefined
                        ? audioContext.currentTime + 0.05
                        : Math.max(
                              audioContext.currentTime + 0.02,
                              lastBeatTime + secondsPerTick,
                          );

                observedConfig = config;
            }

            const tickCount = config.beatsPerBar * config.subdivisionsPerBeat;

            const secondsPerTick =
                msPerMinute / (config.bpm * config.subdivisionsPerBeat) / 1000;

            while (nextBeatTime < audioContext.currentTime + lookAheadSeconds) {
                const currentTime = audioContext.currentTime;

                if (nextBeatTime < currentTime) {
                    nextBeat = (nextBeat + 1) % tickCount;
                    nextBeatTime += secondsPerTick;
                    continue;
                }

                const scheduledBeat = nextBeat;
                const isFullBeat =
                    scheduledBeat % config.subdivisionsPerBeat === 0;
                const shouldPlay =
                    config.soundOption === SoundOption.All ||
                    (config.soundOption === SoundOption.Full && isFullBeat) ||
                    (config.soundOption === SoundOption.First &&
                        scheduledBeat === 0);

                if (shouldPlay && config.volume > 0) {
                    const clickVolume =
                        config.volume *
                        (config.compoundMeter && isFullBeat ? 1.1 : 1);
                    scheduleClick(nextBeatTime, clickVolume);
                    if (!audioBuffersRef.current[config.soundId]) {
                        void loadSound(audioContext, config.soundId);
                    }
                }

                const scheduledTime = nextBeatTime;
                const visualTimer = window.setTimeout(
                    () => {
                        visualTimers.delete(visualTimer);
                        if (!cancelled) {
                            publishBeat(scheduledBeat);
                            lastBeatTime = scheduledTime;

                            if (
                                scheduledBeat === tickCount - 1 &&
                                config.bpmRampEnabled
                            ) {
                                completedBars += 1;
                                if (completedBars >= config.bpmRampBars) {
                                    completedBars = 0;
                                    const nextBpm = Math.min(
                                        maxBpm,
                                        Math.max(
                                            minBpm,
                                            config.bpm + config.bpmRampAmount,
                                        ),
                                    );
                                    if (nextBpm !== config.bpm) {
                                        configRef.current.onBpmChange(nextBpm);
                                    }
                                }
                            }
                        }
                    },
                    Math.max(0, (scheduledTime - currentTime) * 1000),
                );
                visualTimers.add(visualTimer);

                nextBeat = (nextBeat + 1) % tickCount;
                nextBeatTime += secondsPerTick;
            }
        };

        const startScheduler = async () => {
            await audioContext.resume();
            await loadSound(audioContext, configRef.current.soundId);

            if (cancelled) {
                return;
            }

            const config = configRef.current;
            observedConfig = config;
            nextBeat = beatRef.current ?? 0;
            nextBeatTime = audioContext.currentTime + 0.05;
            schedulerTimer = window.setInterval(schedule, schedulerIntervalMs);
            schedule();
        };

        void startScheduler();

        return () => {
            cancelled = true;
            if (schedulerTimer !== undefined) {
                window.clearInterval(schedulerTimer);
            }

            for (const timer of visualTimers) {
                window.clearTimeout(timer);
            }

            for (const [source, startTime] of scheduledSources) {
                if (startTime > audioContext.currentTime) {
                    source.stop();
                }
            }
        };
    }, [isRunning]);

    useEffect(
        () => () => {
            if (countInTimerRef.current !== undefined) {
                window.clearTimeout(countInTimerRef.current);
            }
            const audioContext = audioContextRef.current;
            if (audioContext && audioContext.state !== "closed") {
                void audioContext.close();
            }
        },
        [],
    );

    return {
        beat,
        isRunning,
        countdown,
        isCountingIn: countdown !== null,
        toggle,
        stop,
        previewSound,
    };
}
