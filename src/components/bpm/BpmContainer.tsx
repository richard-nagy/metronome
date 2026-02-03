import { getColorFromRange } from "@/lib/utils";
import { SoundOption } from "@/types/types";
import { Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    defaultBeatCounter,
    defaultBpm,
    maxBpm,
    minBpm,
    msPerMinute,
} from "../constants";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { useResolvedTheme } from "../ui/useResolvedTheme";
import BpmAudio from "./BpmAudio";
import BpmVisualCue from "./BpmVisualCue";

const BpmContainer = () => {
    //#region State
    const [bpm, setBpm] = useState(defaultBpm);
    const [isRunning, setIsRunning] = useState(false);
    const [beat, setBeat] = useState<number | undefined>(undefined);
    const [showDownBeats, setShowDownBeats] = useState(false);
    const [beatCounter, setBeatCounter] = useState(defaultBeatCounter);
    const [volume, setVolume] = useState(1);
    const [soundOption, setSoundOption] = useState(SoundOption.Full);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const resolvedTheme = useResolvedTheme();
    //#endregion

    //#region Memos
    const currentBeatCounter = useMemo(
        () => beatCounter * (showDownBeats ? 2 : 1),
        [beatCounter, showDownBeats],
    );

    const speed = useMemo(
        () => bpm * (showDownBeats ? 2 : 1),
        [bpm, showDownBeats],
    );

    const color = useMemo(
        () => getColorFromRange(bpm, minBpm, maxBpm, resolvedTheme),
        [bpm, resolvedTheme],
    );
    //#endregion

    //#region Callbacks
    const onButtonChange = useCallback((value: number) => {
        setBpm((oldBpm) => {
            const result = oldBpm + value;
            if (result <= minBpm) {
                return minBpm;
            } else if (result >= maxBpm) {
                return maxBpm;
            }
            return result;
        });
    }, []);
    //#endregion

    //#region Effects
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setBeat((prev) =>
                    prev !== undefined ? (prev + 1) % currentBeatCounter : 0,
                );
            }, msPerMinute / speed);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, speed, currentBeatCounter]);

    useEffect(() => {
        if (showDownBeats) {
            setBeat((prev) => (prev !== undefined ? prev * 2 : 0));
        } else {
            setBeat((prev) => (prev !== undefined ? Math.floor(prev / 2) : 0));
        }
    }, [showDownBeats]);
    //#endregion

    //#region Render
    return (
        <div className="flex flex-col items-center gap-5">
            <h1 className="mb-3 text-center tracking-tight text-balance">
                <span style={{ color }} className="font-bold text-4xl">
                    {bpm}{" "}
                </span>
                <span className="font-light text-secondary-foreground text-3xl">
                    BPM
                </span>
            </h1>
            <BpmVisualCue
                beatCounter={currentBeatCounter}
                bpm={speed}
                beat={beat}
                isRunning={isRunning}
                showDownBeats={showDownBeats}
                color={color}
            />
            <Slider
                defaultValue={[defaultBpm]}
                value={[bpm]}
                min={minBpm}
                max={maxBpm}
                step={1}
                thumbColor={color}
                className="w-100"
                onValueChange={(value) => setBpm(value[0] ?? minBpm)}
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
            <div className="flex flex-row gap-3">
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
                    onDoubleClick={() =>
                        setBeatCounter(() => defaultBeatCounter)
                    }
                />
                <div className="flex items-center space-x-2">
                    <Label htmlFor="show-down-beats">Show down beats</Label>
                    <Switch
                        id="show-down-beats"
                        checked={showDownBeats}
                        onCheckedChange={setShowDownBeats}
                    />
                </div>
            </div>
            <div className="flex flex-row gap-3">
                <BpmAudio
                    beat={beat}
                    volume={volume}
                    soundOption={soundOption}
                    showDownBeats={showDownBeats}
                />
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
                    className="w-30 mr-3"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[volume]}
                    onValueChange={(value) => setVolume(() => value?.[0] ?? 0)}
                    onDoubleClick={() => setVolume(() => 1)}
                />
            </div>
            <RadioGroup
                value={soundOption}
                className="w-fit"
                onValueChange={(value) => setSoundOption(value as SoundOption)}
            >
                <div className="flex items-center gap-3">
                    <RadioGroupItem value={SoundOption.All} id="r1" />
                    <Label htmlFor="r1">On all beats</Label>
                </div>
                <div className="flex items-center gap-3">
                    <RadioGroupItem value={SoundOption.Full} id="r2" />
                    <Label htmlFor="r2">On full beats</Label>
                </div>
                <div className="flex items-center gap-3">
                    <RadioGroupItem value={SoundOption.First} id="r3" />
                    <Label htmlFor="r3">On first beat</Label>
                </div>
            </RadioGroup>
        </div>
    );
    //#endregion
};

export default BpmContainer;
