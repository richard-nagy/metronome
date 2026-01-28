import { maxBpm, minBpm } from "../constants";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface BpmControlsProps {
    bpm: number;
    color: string;
    isRunning: boolean;
    muted: boolean;
    onButtonChange: (value: number) => void;
    onInputChange: (value: number) => void;
    onInputBlur: () => void;
    setBeat: (beat: number) => void;
    setIsRunning: (isRunning: boolean) => void;
    setMuted: (muted: (m: boolean) => boolean) => void;
}

const BpmControls = ({
    bpm,
    color,
    isRunning,
    muted,
    onButtonChange,
    onInputChange,
    onInputBlur,
    setBeat,
    setIsRunning,
    setMuted,
}: BpmControlsProps) => (
    <>
        <div className="flex flex-row gap-3">
            <Button className="h-10 w-18" onClick={() => onButtonChange(-10)}>
                -10
            </Button>
            <Button className="h-10 w-18" onClick={() => onButtonChange(-1)}>
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
            <Button className="h-10 w-18" onClick={() => onButtonChange(1)}>
                +1
            </Button>
            <Button className="h-10 w-18" onClick={() => onButtonChange(10)}>
                +10
            </Button>
        </div>
        <div className="flex flex-row gap-3">
            <Button
                className="h-10 w-18"
                disabled={isRunning}
                onClick={() => {
                    setBeat(0);
                    setIsRunning(true);
                }}
            >
                Start
            </Button>
            <Button
                className="h-10 w-18"
                disabled={!isRunning}
                onClick={() => setIsRunning(false)}
            >
                Stop
            </Button>
            <Button
                className="h-10 w-18"
                onClick={() => setBeat(0)}
                disabled={isRunning}
            >
                Reset
            </Button>
            <Button className="h-10 w-18" onClick={() => setMuted((m) => !m)}>
                {muted ? "Unmute" : "Mute"}
            </Button>
        </div>
    </>
);

export default BpmControls;
