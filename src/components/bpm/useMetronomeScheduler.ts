import { SoundOption } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { msPerMinute } from "../constants";

interface UseMetronomeSchedulerProps {
    bpm: number;
    beatsPerBar: number;
    showSubdivisions: boolean;
    volume: number;
    soundOption: SoundOption;
}

const lookAheadSeconds = 0.1;
const schedulerIntervalMs = 25;

export function useMetronomeScheduler({
    bpm,
    beatsPerBar,
    showSubdivisions,
    volume,
    soundOption,
}: UseMetronomeSchedulerProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [beat, setBeat] = useState<number | undefined>(undefined);

    const audioContextRef = useRef<AudioContext | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);
    const audioBufferPromiseRef = useRef<Promise<AudioBuffer | null> | null>(
        null,
    );
    const beatRef = useRef<number | undefined>(undefined);
    const configRef = useRef({
        bpm,
        beatsPerBar,
        showSubdivisions,
        volume,
        soundOption,
    });

    configRef.current = {
        bpm,
        beatsPerBar,
        showSubdivisions,
        volume,
        soundOption,
    };

    const publishBeat = (nextBeat: number) => {
        beatRef.current = nextBeat;
        setBeat(nextBeat);
    };

    const toggle = () => {
        if (isRunning) {
            setIsRunning(false);
            return;
        }

        let audioContext = audioContextRef.current;
        if (!audioContext) {
            audioContext = new AudioContext();
            audioContextRef.current = audioContext;
        }

        if (!audioBufferPromiseRef.current) {
            audioBufferPromiseRef.current = fetch("/buttonclick.wav")
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Unable to load metronome sound");
                    }
                    return response.arrayBuffer();
                })
                .then((data) => audioContext!.decodeAudioData(data))
                .then((buffer) => {
                    audioBufferRef.current = buffer;
                    return buffer;
                })
                .catch(() => null);
        }

        void audioContext.resume();
        beatRef.current = undefined;
        setBeat(undefined);
        setIsRunning(true);
    };

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
        const visualTimers = new Set<number>();
        const scheduledSources = new Map<AudioScheduledSourceNode, number>();

        const scheduleClick = (when: number, clickVolume: number) => {
            const gain = audioContext.createGain();
            gain.gain.setValueAtTime(clickVolume, when);
            gain.connect(audioContext.destination);

            const buffer = audioBufferRef.current;
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

            source.onended = () => scheduledSources.delete(source);
            source.start(when);
            if (oscillatorStopTime !== undefined) {
                source.stop(oscillatorStopTime);
            }
            scheduledSources.set(source, when);
        };

        const schedule = () => {
            const config = configRef.current;
            const timingChanged =
                config.bpm !== observedConfig.bpm ||
                config.beatsPerBar !== observedConfig.beatsPerBar ||
                config.showSubdivisions !== observedConfig.showSubdivisions;

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
                    config.showSubdivisions !== observedConfig.showSubdivisions
                ) {
                    currentBeat = config.showSubdivisions
                        ? currentBeat * 2
                        : Math.floor(currentBeat / 2);
                }

                const tickCount =
                    config.beatsPerBar * (config.showSubdivisions ? 2 : 1);

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
                    (config.bpm * (config.showSubdivisions ? 2 : 1)) /
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

            const tickCount =
                config.beatsPerBar * (config.showSubdivisions ? 2 : 1);

            const secondsPerTick =
                msPerMinute /
                (config.bpm * (config.showSubdivisions ? 2 : 1)) /
                1000;

            while (nextBeatTime < audioContext.currentTime + lookAheadSeconds) {
                const currentTime = audioContext.currentTime;

                if (nextBeatTime < currentTime) {
                    nextBeat = (nextBeat + 1) % tickCount;
                    nextBeatTime += secondsPerTick;
                    continue;
                }

                const scheduledBeat = nextBeat;
                const isFullBeat =
                    !config.showSubdivisions || scheduledBeat % 2 === 0;
                const shouldPlay =
                    config.soundOption === SoundOption.All ||
                    (config.soundOption === SoundOption.Full && isFullBeat) ||
                    (config.soundOption === SoundOption.First &&
                        scheduledBeat === 0);

                if (shouldPlay && config.volume > 0) {
                    scheduleClick(nextBeatTime, config.volume);
                }

                const scheduledTime = nextBeatTime;
                const visualTimer = window.setTimeout(
                    () => {
                        visualTimers.delete(visualTimer);
                        if (!cancelled) {
                            publishBeat(scheduledBeat);
                            lastBeatTime = scheduledTime;
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
            await audioBufferPromiseRef.current;

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
            const audioContext = audioContextRef.current;
            if (audioContext && audioContext.state !== "closed") {
                void audioContext.close();
            }
        },
        [],
    );

    return { beat, isRunning, toggle };
}
