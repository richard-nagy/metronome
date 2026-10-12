import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { maxBpm, minBpm, defaultBpm } from "../constants";
import { Button } from "../ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "../ui/input-group";
import { Slider } from "../ui/slider";
import BpmVisualCue from "./BpmVisualCue";
import { MousePointerClick, Pause, Play } from "lucide-react";
import {
    estimateTapTempoFromElapsedMs,
    registerTempoTap,
    tapResetAfterMs,
} from "./tapTempo";

const tapStatusVisibleMs = 5000;

interface TempoControlsProps {
    bpm: number;
    beatCounter: number;
    beat: number | undefined;
    isRunning: boolean;
    isCountingIn: boolean;
    isPlaybackActive: boolean;
    showSubdivisions: boolean;
    showNumbers: boolean;
    countdown: number | null;
    tickRate: number;
    color: string;
    onBpmChange: (bpm: number) => void;
    onToggle: () => void;
}

export function TempoControls({
    bpm,
    beatCounter,
    beat,
    isRunning,
    isCountingIn,
    isPlaybackActive,
    showSubdivisions,
    showNumbers,
    countdown,
    tickRate,
    color,
    onBpmChange,
    onToggle,
}: TempoControlsProps) {
    const tapTimesRef = useRef<number[]>([]);
    const tapFeedbackIntervalRef = useRef<number | undefined>(undefined);
    const tapFeedbackTimeoutRef = useRef<number | undefined>(undefined);
    const [tapStatus, setTapStatus] = useState<{
        bpm: number;
        suffix: string;
    } | null>(null);

    useEffect(
        () => () => {
            if (tapFeedbackIntervalRef.current !== undefined) {
                window.clearInterval(tapFeedbackIntervalRef.current);
            }
            if (tapFeedbackTimeoutRef.current !== undefined) {
                window.clearTimeout(tapFeedbackTimeoutRef.current);
            }
        },
        [],
    );

    const onButtonChange = (value: number) => {
        onBpmChange(Math.min(maxBpm, Math.max(minBpm, bpm + value)));
    };

    const onTapTempo = () => {
        const tappedAt = performance.now();
        const result = registerTempoTap(tapTimesRef.current, tappedAt);
        tapTimesRef.current = result.tapTimes;

        if (tapFeedbackTimeoutRef.current !== undefined) {
            window.clearTimeout(tapFeedbackTimeoutRef.current);
            tapFeedbackTimeoutRef.current = undefined;
        }
        if (tapFeedbackIntervalRef.current !== undefined) {
            window.clearInterval(tapFeedbackIntervalRef.current);
            tapFeedbackIntervalRef.current = undefined;
        }

        if (result.bpm === null) {
            const updateProjectedTempo = () => {
                const elapsedMs = performance.now() - tappedAt;
                setTapStatus({
                    bpm: estimateTapTempoFromElapsedMs(elapsedMs),
                    suffix: "BPM · tap again to confirm",
                });
            };

            updateProjectedTempo();
            tapFeedbackIntervalRef.current = window.setInterval(
                updateProjectedTempo,
                50,
            );
            tapFeedbackTimeoutRef.current = window.setTimeout(() => {
                if (tapFeedbackIntervalRef.current !== undefined) {
                    window.clearInterval(tapFeedbackIntervalRef.current);
                    tapFeedbackIntervalRef.current = undefined;
                }
                tapFeedbackTimeoutRef.current = undefined;
                tapTimesRef.current = [];
                setTapStatus(null);
            }, tapResetAfterMs);
            return;
        }

        onBpmChange(result.bpm);
        const estimatedBpm = result.bpm;
        setTapStatus({
            bpm: estimatedBpm,
            suffix: "BPM · tap again to refine",
        });
        tapFeedbackTimeoutRef.current = window.setTimeout(() => {
            tapFeedbackTimeoutRef.current = undefined;
            tapTimesRef.current = [];
            setTapStatus(null);
        }, tapStatusVisibleMs);
    };

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.valueAsNumber;
        if (Number.isNaN(value)) {
            return;
        }

        onBpmChange(Math.min(maxBpm, Math.max(minBpm, Math.round(value))));
    };

    return (
        <>
            <BpmVisualCue
                beatCounter={beatCounter}
                bpm={tickRate}
                beat={beat}
                isRunning={isRunning}
                showSubdivisions={showSubdivisions}
                showNumbers={showNumbers}
                countdown={countdown}
                color={color}
            />
            <div className="flex flex-row gap-2 items-center">
                <InputGroup className="w-40 h-14 ">
                    <InputGroupInput
                        aria-label="Tempo in beats per minute"
                        type="number"
                        max={maxBpm}
                        min={minBpm}
                        step={1}
                        className="text-4xl md:text-4xl font-bold text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        value={bpm}
                        style={{ color }}
                        disabled={isPlaybackActive}
                        onChange={onInputChange}
                    />
                    <InputGroupAddon align="inline-end">
                        <span className="font-medium text-secondary-foreground text-3xl">
                            BPM
                        </span>
                    </InputGroupAddon>
                </InputGroup>
                <Button
                    className="h-14 gap-2 px-3"
                    variant="outline"
                    disabled={isPlaybackActive}
                    onClick={onTapTempo}
                >
                    <MousePointerClick className="size-4" />
                    Tap tempo
                </Button>
            </div>
            <div
                className="flex min-h-5 items-center justify-center text-sm text-muted-foreground"
                role="status"
                aria-live="polite"
            >
                {tapStatus && (
                    <>
                        <span>
                            Estimated tempo:{" "}
                            <span
                                className="font-semibold tabular-nums"
                                style={{ color }}
                            >
                                {tapStatus.bpm}
                            </span>{" "}
                            {tapStatus.suffix}
                        </span>
                    </>
                )}
            </div>
            <Slider
                aria-label="Tempo in beats per minute"
                value={[bpm]}
                min={minBpm}
                max={maxBpm}
                step={1}
                thumbColor={color}
                className="w-82 mt-2 mb-2"
                disabled={isPlaybackActive}
                onValueChange={(value) => onBpmChange(value[0] ?? minBpm)}
                onDoubleClick={() => onBpmChange(defaultBpm)}
            />
            <div className="flex flex-row justify-center w-full items-center gap-3">
                <Button
                    className="h-14 w-14"
                    variant="outline"
                    disabled={isPlaybackActive}
                    onClick={() => onButtonChange(-10)}
                >
                    -10
                </Button>
                <Button
                    className="h-14 w-14"
                    variant="outline"
                    disabled={isPlaybackActive}
                    onClick={() => onButtonChange(-1)}
                >
                    -1
                </Button>
                <Button
                    className="size-14"
                    variant="outline"
                    aria-label={
                        isRunning || isCountingIn
                            ? "Pause metronome"
                            : "Start metronome"
                    }
                    onClick={onToggle}
                >
                    {isRunning || isCountingIn ? (
                        <Pause className="size-7" />
                    ) : (
                        <Play className="size-7" />
                    )}
                </Button>
                <Button
                    className="h-14 w-14"
                    variant="outline"
                    disabled={isPlaybackActive}
                    onClick={() => onButtonChange(1)}
                >
                    +1
                </Button>
                <Button
                    className="h-14 w-14"
                    variant="outline"
                    disabled={isPlaybackActive}
                    onClick={() => onButtonChange(10)}
                >
                    +10
                </Button>
            </div>
        </>
    );
}
