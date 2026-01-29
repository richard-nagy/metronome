import { Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { defaultBeatCounter, maxBpm, minBpm } from "../constants";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";

interface BpmControlsProps {
    bpm: number;
    color: string;
    isRunning: boolean;
    volume: number;
    beatCounter: number;
    onButtonChange: (value: number) => void;
    onInputChange: (value: number) => void;
    onInputBlur: () => void;
    setBeat: (beat: number) => void;
    setIsRunning: Dispatch<SetStateAction<boolean>>;
    setVolume: (volume: (v: number) => number) => void;
    setBeatCounter: (beatCounter: (bc: number) => number) => void;
}

const BpmControls = ({
    bpm,
    color,
    isRunning,
    volume,
    beatCounter,
    onButtonChange,
    onInputChange,
    onInputBlur,
    setBeat,
    setIsRunning,
    setVolume,
    setBeatCounter,
}: BpmControlsProps) => (
    <>
        <div className="flex flex-row gap-3">
            <Button
                className="h-10 w-18"
                variant="outline"
                onClick={() => onButtonChange(-10)}
            >
                -10
            </Button>
            <Button
                className="h-10 w-18"
                variant="outline"
                onClick={() => onButtonChange(-1)}
            >
                -1
            </Button>
            <Input
                value={bpm}
                min={minBpm}
                max={maxBpm}
                type="number"
                className="h-10 w-18 text-center px-4 text-lg! font-bold"
                style={{ color }}
                onChange={(e) => onInputChange(parseInt(e.target.value))}
                onBlur={onInputBlur}
            />
            <Button
                className="h-10 w-18"
                variant="outline"
                onClick={() => onButtonChange(1)}
            >
                +1
            </Button>
            <Button
                className="h-10 w-18"
                variant="outline"
                onClick={() => onButtonChange(10)}
            >
                +10
            </Button>
        </div>
        <div className="flex flex-row gap-6">
            <div className="flex flex-row gap-3">
                <Button
                    className="h-10 w-10"
                    variant="ghost"
                    onClick={() => {
                        setBeat(0);
                        setIsRunning((prev) => !prev);
                    }}
                >
                    {isRunning ? (
                        <Pause className="size-5" />
                    ) : (
                        <Play className="size-5" />
                    )}
                </Button>
                <Slider
                    className="w-30"
                    min={2}
                    max={8}
                    step={1}
                    value={[beatCounter]}
                    onValueChange={(value) =>
                        setBeatCounter(() => value?.[0] ?? defaultBeatCounter)
                    }
                    onDoubleClick={() =>
                        setBeatCounter(() => defaultBeatCounter)
                    }
                />
            </div>
            <div className="flex flex-row gap-3">
                <Button
                    className="h-10 w-10"
                    variant="ghost"
                    onClick={() => setVolume((v) => (v === 0 ? 1 : 0))}
                >
                    {volume === 0 && <VolumeX className="size-5" />}
                    {volume > 0 && volume <= 0.5 && (
                        <Volume1 className="size-5" />
                    )}
                    {volume > 0.5 && <Volume2 className="size-5" />}
                </Button>
                <Slider
                    className="w-30"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[volume]}
                    onValueChange={(value) => setVolume(() => value?.[0] ?? 0)}
                    onDoubleClick={() => setVolume(() => 1)}
                />
            </div>
        </div>
    </>
);

export default BpmControls;
