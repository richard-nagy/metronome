import { getColorFromRange } from "@/lib/utils";
import { SoundOption } from "@/types/types";
import {
    Minus,
    Pause,
    Play,
    Plus,
    Volume1,
    Volume2,
    VolumeX,
} from "lucide-react";
import { useState, type ChangeEvent } from "react";
import {
    defaultBeatCounter,
    defaultBpm,
    maxBeatCounter,
    maxBpm,
    minBeatCounter,
    minBpm,
} from "../constants";
import { Button } from "../ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "../ui/input-group";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { useResolvedTheme } from "../ui/useResolvedTheme";
import BpmVisualCue from "./BpmVisualCue";
import { useMetronomeScheduler } from "./useMetronomeScheduler";

const BpmContainer = () => {
    //#region State
    const [bpm, setBpm] = useState(defaultBpm);
    const [showSubdivisions, setShowSubdivisions] = useState(false);
    const [beatCounter, setBeatCounter] = useState(defaultBeatCounter);
    const [volume, setVolume] = useState(1);
    const [soundOption, setSoundOption] = useState(SoundOption.Full);
    const resolvedTheme = useResolvedTheme();
    const { beat, isRunning, toggle } = useMetronomeScheduler({
        bpm,
        beatsPerBar: beatCounter,
        showSubdivisions,
        volume,
        soundOption,
    });
    //#endregion

    //#region Derived values
    const tickRate = bpm * (showSubdivisions ? 2 : 1);
    const color = getColorFromRange(bpm, minBpm, maxBpm, resolvedTheme);
    //#endregion

    //#region Functions
    const onButtonChange = (value: number) => {
        setBpm((oldBpm) => {
            const result = oldBpm + value;
            if (result <= minBpm) {
                return minBpm;
            } else if (result >= maxBpm) {
                return maxBpm;
            }
            return result;
        });
    };

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value);

        if (value < minBpm) {
            value = minBpm;
        } else if (value > maxBpm) {
            value = maxBpm;
        }

        setBpm(value);
    };
    //#endregion

    //#region Render
    return (
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4">
            <BpmVisualCue
                beatCounter={beatCounter}
                bpm={tickRate}
                beat={beat}
                isRunning={isRunning}
                showSubdivisions={showSubdivisions}
                color={color}
            />
            <div className="flex flex-row gap-2 items-center">
                <InputGroup className="w-40 h-14 ">
                    <InputGroupInput
                        aria-label=""
                        type="number"
                        max={300}
                        min={40}
                        className="text-4xl md:text-4xl font-bold text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        value={bpm}
                        style={{ color }}
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
                onValueChange={(value) => setBpm(value[0] ?? minBpm)}
                onDoubleClick={() => setBpm(defaultBpm)}
            />
            <div className="flex flex-row justify-center w-full items-center gap-3">
                <Button
                    className="h-14 w-14"
                    variant="outline"
                    onClick={() => onButtonChange(-10)}
                >
                    -10
                </Button>
                <Button
                    className="h-14 w-14"
                    variant="outline"
                    onClick={() => onButtonChange(-1)}
                >
                    -1
                </Button>
                <Button
                    className="size-14"
                    variant="outline"
                    aria-label={
                        isRunning ? "Pause metronome" : "Start metronome"
                    }
                    onClick={toggle}
                >
                    {isRunning ? (
                        <Pause className="size-7" />
                    ) : (
                        <Play className="size-7" />
                    )}
                </Button>
                <Button
                    className="h-14 w-14"
                    variant="outline"
                    onClick={() => onButtonChange(1)}
                >
                    +1
                </Button>
                <Button
                    className="h-14 w-14"
                    variant="outline"
                    onClick={() => onButtonChange(10)}
                >
                    +10
                </Button>
            </div>
            <div className="grid w-full grid-cols-1 gap-x-8 gap-y-6 border-t pt-5 sm:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)]">
                <section className="flex flex-col gap-4">
                    <h2 className="text-sm font-medium">Rhythm</h2>
                    <div className="flex items-center justify-between gap-4">
                        <Label id="beat-number-label">Beats per bar</Label>
                        <div
                            role="group"
                            aria-labelledby="beat-number-label"
                            className="flex items-center gap-1"
                        >
                            <Button
                                className="size-9"
                                variant="outline"
                                aria-label="Decrease beats per bar"
                                disabled={beatCounter <= minBeatCounter}
                                onClick={() =>
                                    setBeatCounter((value) =>
                                        Math.max(minBeatCounter, value - 1),
                                    )
                                }
                            >
                                <Minus className="size-4" />
                            </Button>
                            <output className="min-w-8 text-center font-medium tabular-nums">
                                {beatCounter}
                            </output>
                            <Button
                                className="size-9"
                                variant="outline"
                                aria-label="Increase beats per bar"
                                disabled={beatCounter >= maxBeatCounter}
                                onClick={() =>
                                    setBeatCounter((value) =>
                                        Math.min(maxBeatCounter, value + 1),
                                    )
                                }
                            >
                                <Plus className="size-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="show-subdivisions">Subdivisions</Label>
                        <Switch
                            id="show-subdivisions"
                            checked={showSubdivisions}
                            onCheckedChange={setShowSubdivisions}
                        />
                    </div>
                </section>
                <div aria-hidden="true" className="hidden bg-border sm:block" />
                <section className="flex flex-col gap-4">
                    <h2 className="text-sm font-medium">Sound</h2>
                    <div className="flex items-center gap-3">
                        <Button
                            className="size-9 shrink-0"
                            variant="ghost"
                            aria-label={volume === 0 ? "Unmute" : "Mute"}
                            onClick={() => setVolume((v) => (v === 0 ? 1 : 0))}
                        >
                            {volume === 0 && <VolumeX className="size-5" />}
                            {volume > 0 && volume <= 0.5 && (
                                <Volume1 className="size-5" />
                            )}
                            {volume > 0.5 && <Volume2 className="size-5" />}
                        </Button>
                        <Slider
                            aria-label="Output volume"
                            id="volume"
                            className="min-w-0 w-40"
                            min={0}
                            max={1}
                            step={0.1}
                            value={[volume]}
                            onValueChange={(value) => setVolume(value[0] ?? 0)}
                            onDoubleClick={() => setVolume(1)}
                        />
                    </div>
                    <RadioGroup
                        value={soundOption}
                        aria-label="Accent pattern"
                        className="gap-2"
                        onValueChange={(value) =>
                            setSoundOption(value as SoundOption)
                        }
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
                </section>
            </div>
        </div>
    );
    //#endregion
};

export default BpmContainer;
