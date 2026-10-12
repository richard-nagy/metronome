import { type ChangeEvent } from "react";
import { maxBpm, minBpm, defaultBpm } from "../constants";
import { Button } from "../ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "../ui/input-group";
import { Slider } from "../ui/slider";
import BpmVisualCue from "./BpmVisualCue";
import { Pause, Play } from "lucide-react";

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
    const onButtonChange = (value: number) => {
        onBpmChange(Math.min(maxBpm, Math.max(minBpm, bpm + value)));
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
