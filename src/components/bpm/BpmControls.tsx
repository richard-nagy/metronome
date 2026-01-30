import { Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";
import { defaultBeatCounter, defaultBpm } from "../constants";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import BpmSlider from "./BpmSlider";
import { Switch } from "../ui/switch";

interface BpmControlsProps {
    bpm: number;
    color: string;
    volume: number;
    beatCounter: number;
    isRunning: boolean;
    soundOnFirstBeat: boolean;
    showDownBeats: boolean;
    onButtonChange: (value: number) => void;
    setBeat: (beat: number) => void;
    setVolume: (volume: (v: number) => number) => void;
    setBeatCounter: (beatCounter: (bc: number) => number) => void;
    setIsRunning: (isRunning: (ir: boolean) => boolean) => void;
    setBpm: (bpm: number) => void;
    setSoundOnFirstBeat: (value: boolean) => void;
    setShowDownBeats: (value: boolean) => void;
}

const BpmControls = ({
    bpm,
    color,
    isRunning,
    volume,
    beatCounter,
    soundOnFirstBeat,
    showDownBeats,
    onButtonChange,
    setBeat,
    setIsRunning,
    setVolume,
    setBeatCounter,
    setBpm,
    setSoundOnFirstBeat,
    setShowDownBeats,
}: BpmControlsProps) => (
    <>
        <BpmSlider
            bpm={bpm}
            color={color}
            onChange={setBpm}
            onDoubleClick={() => setBpm(defaultBpm)}
        />
        <div className="flex flex-row gap-3">
            <Button
                className="h-10 w-14"
                variant="outline"
                onClick={() => onButtonChange(-10)}
            >
                -10
            </Button>
            <Button
                className="h-10 w-14"
                variant="outline"
                onClick={() => onButtonChange(-1)}
            >
                -1
            </Button>
            <div className="flex flex-row gap-3">
                <Button
                    className="h-14 w-14"
                    variant="outline"
                    onClick={() => {
                        setBeat(0);
                        setIsRunning((prev) => !prev);
                    }}
                >
                    {isRunning ? (
                        <Pause className="size-7" />
                    ) : (
                        <Play className="size-7" />
                    )}
                </Button>
                <Button
                    className="h-14 w-14 text-xl"
                    variant="outline"
                    disabled
                >
                    Tap
                </Button>
            </div>
            <Button
                className="h-10 w-14"
                variant="outline"
                onClick={() => onButtonChange(1)}
            >
                +1
            </Button>
            <Button
                className="h-10 w-14"
                variant="outline"
                onClick={() => onButtonChange(10)}
            >
                +10
            </Button>
        </div>
        <div className="flex flex-row gap-3 w-110 flex-wrap justify-center">
            <Button
                className="h-10 w-10"
                variant="ghost"
                onClick={() => setVolume((v) => (v === 0 ? 1 : 0))}
            >
                {volume === 0 && <VolumeX className="size-5" />}
                {volume > 0 && volume <= 0.5 && <Volume1 className="size-5" />}
                {volume > 0.5 && <Volume2 className="size-5" />}
            </Button>
            <Slider
                className="w-30 mr-3"
                min={0}
                max={1}
                step={0.1}
                value={[volume]}
                onValueChange={(value) => setVolume(() => value?.[0] ?? 0)}
                onDoubleClick={() => setVolume(() => 1)}
            />
            <Label htmlFor="beat-number">Beat number: {beatCounter}</Label>
            <Slider
                id="beat-number"
                className="w-30"
                min={2}
                max={8}
                step={1}
                value={[beatCounter]}
                onValueChange={(value) =>
                    setBeatCounter(() => value?.[0] ?? defaultBeatCounter)
                }
                onDoubleClick={() => setBeatCounter(() => defaultBeatCounter)}
            />
            <div className="flex items-center space-x-2 mr-3">
                <Label htmlFor="sound-on-first-beat">
                    Play sound only on first beat
                </Label>
                <Switch
                    id="sound-on-first-beat"
                    checked={soundOnFirstBeat}
                    onCheckedChange={setSoundOnFirstBeat}
                />
            </div>
            <div className="flex items-center space-x-2">
                <Label htmlFor="show-down-beats">Show down beats</Label>
                <Switch
                    id="show-down-beats"
                    checked={showDownBeats}
                    onCheckedChange={setShowDownBeats}
                />
            </div>
        </div>
    </>
);

export default BpmControls;
