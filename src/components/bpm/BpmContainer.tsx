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
import { type ChangeEvent } from "react";
import {
    defaultBpm,
    maxBeatCounter,
    maxBpm,
    maxBpmRampAmount,
    maxBpmRampBars,
    minBeatCounter,
    minBpm,
    minBpmRampAmount,
    minBpmRampBars,
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
import { useMetronomeSettings } from "./useMetronomeSettings";

const BpmContainer = () => {
    //#region State
    const { settings, updateSettings } = useMetronomeSettings();
    const {
        bpm,
        bpmRampEnabled,
        bpmRampBars,
        bpmRampAmount,
        showSubdivisions,
        showNumbers,
        countInEnabled,
        beatCounter,
        volume,
        soundOption,
    } = settings;
    const resolvedTheme = useResolvedTheme();
    const { beat, isRunning, countdown, isCountingIn, toggle } =
        useMetronomeScheduler({
            bpm,
            bpmRampEnabled,
            bpmRampBars,
            bpmRampAmount,
            beatsPerBar: beatCounter,
            showSubdivisions,
            countInEnabled,
            volume,
            soundOption,
            onBpmChange: (nextBpm) => updateSettings({ bpm: nextBpm }),
        });

    const updateTimingSettings = (updates: {
        bpm?: number;
        showSubdivisions?: boolean;
        showNumbers?: boolean;
        countInEnabled?: boolean;
        beatCounter?: number;
    }) => {
        updateSettings(updates);
    };

    const isPlaybackActive = isRunning || isCountingIn;

    //#endregion

    //#region Derived values
    const tickRate = bpm * (showSubdivisions ? 2 : 1);
    const color = getColorFromRange(bpm, minBpm, maxBpm, resolvedTheme);
    //#endregion

    //#region Functions
    const onButtonChange = (value: number) => {
        updateTimingSettings({
            bpm: Math.min(maxBpm, Math.max(minBpm, bpm + value)),
        });
    };

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.valueAsNumber;
        if (Number.isNaN(value)) {
            return;
        }

        updateTimingSettings({
            bpm: Math.min(maxBpm, Math.max(minBpm, value)),
        });
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
                showNumbers={showNumbers}
                countdown={countdown}
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
                onValueChange={(value) =>
                    updateTimingSettings({ bpm: value[0] ?? minBpm })
                }
                onDoubleClick={() => updateTimingSettings({ bpm: defaultBpm })}
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
                    onClick={toggle}
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
            <div className="grid w-full grid-cols-1 gap-x-8 gap-y-6 border-t pt-5 sm:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)]">
                <section className="flex flex-col gap-4 sm:col-start-1 sm:row-start-1">
                    <h2 className="text-sm font-medium">Sound</h2>
                    <div className="flex items-center gap-3">
                        <Button
                            className="size-9 shrink-0"
                            variant="ghost"
                            aria-label={volume === 0 ? "Unmute" : "Mute"}
                            onClick={() =>
                                updateSettings({ volume: volume === 0 ? 1 : 0 })
                            }
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
                            onValueChange={(value) =>
                                updateSettings({ volume: value[0] ?? 0 })
                            }
                            onDoubleClick={() => updateSettings({ volume: 1 })}
                        />
                    </div>
                    <RadioGroup
                        value={soundOption}
                        aria-label="Accent pattern"
                        className="gap-2"
                        onValueChange={(value) =>
                            updateSettings({
                                soundOption: value as SoundOption,
                            })
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
                <div
                    aria-hidden="true"
                    className="h-px w-full bg-border sm:hidden"
                />
                <section className="flex flex-col gap-4 sm:col-start-3 sm:row-start-1">
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
                                disabled={
                                    isPlaybackActive ||
                                    beatCounter <= minBeatCounter
                                }
                                onClick={() =>
                                    updateTimingSettings({
                                        beatCounter: Math.max(
                                            minBeatCounter,
                                            beatCounter - 1,
                                        ),
                                    })
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
                                disabled={
                                    isPlaybackActive ||
                                    beatCounter >= maxBeatCounter
                                }
                                onClick={() =>
                                    updateTimingSettings({
                                        beatCounter: Math.min(
                                            maxBeatCounter,
                                            beatCounter + 1,
                                        ),
                                    })
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
                            onCheckedChange={(checked) =>
                                updateTimingSettings({
                                    showSubdivisions: checked,
                                })
                            }
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="show-numbers">Numbers</Label>
                        <Switch
                            id="show-numbers"
                            checked={showNumbers}
                            onCheckedChange={(checked) =>
                                updateTimingSettings({ showNumbers: checked })
                            }
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="count-in-enabled">Countdown</Label>
                        <Switch
                            id="count-in-enabled"
                            checked={countInEnabled}
                            onCheckedChange={(checked) =>
                                updateTimingSettings({
                                    countInEnabled: checked,
                                })
                            }
                        />
                    </div>
                </section>
                <div
                    aria-hidden="true"
                    className="hidden bg-border sm:col-start-2 sm:row-start-1 sm:block"
                />
                <div
                    aria-hidden="true"
                    className="h-px w-full bg-border sm:col-span-full sm:row-start-2"
                />
                <section className="flex flex-col gap-4 sm:col-span-full sm:row-start-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="bpm-ramp-enabled">Tempo ramp</Label>
                        <Switch
                            id="bpm-ramp-enabled"
                            checked={bpmRampEnabled}
                            disabled={isPlaybackActive}
                            onCheckedChange={(checked) =>
                                updateSettings({ bpmRampEnabled: checked })
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">
                            <Label id="bpm-ramp-bars-label">
                                Increase every
                            </Label>
                            <div
                                role="group"
                                aria-labelledby="bpm-ramp-bars-label"
                                className="flex items-center gap-1"
                            >
                                <Button
                                    className="size-9"
                                    variant="outline"
                                    aria-label="Decrease bars between tempo changes"
                                    disabled={
                                        !bpmRampEnabled ||
                                        isPlaybackActive ||
                                        bpmRampBars <= minBpmRampBars
                                    }
                                    onClick={() =>
                                        updateSettings({
                                            bpmRampBars: Math.max(
                                                minBpmRampBars,
                                                bpmRampBars - 1,
                                            ),
                                        })
                                    }
                                >
                                    <Minus className="size-4" />
                                </Button>
                                <output className="min-w-16 text-center font-medium tabular-nums">
                                    {bpmRampBars}{" "}
                                    {bpmRampBars === 1 ? "bar" : "bars"}
                                </output>
                                <Button
                                    className="size-9"
                                    variant="outline"
                                    aria-label="Increase bars between tempo changes"
                                    disabled={
                                        !bpmRampEnabled ||
                                        isPlaybackActive ||
                                        bpmRampBars >= maxBpmRampBars
                                    }
                                    onClick={() =>
                                        updateSettings({
                                            bpmRampBars: Math.min(
                                                maxBpmRampBars,
                                                bpmRampBars + 1,
                                            ),
                                        })
                                    }
                                >
                                    <Plus className="size-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label id="bpm-ramp-amount-label">BPM change</Label>
                            <output
                                aria-labelledby="bpm-ramp-amount-label"
                                className="font-medium tabular-nums"
                            >
                                {bpmRampAmount > 0 ? "+" : ""}
                                {bpmRampAmount} BPM
                            </output>
                        </div>
                        <Slider
                            aria-label="BPM change per interval"
                            value={[bpmRampAmount]}
                            min={minBpmRampAmount}
                            max={maxBpmRampAmount}
                            step={1}
                            disabled={!bpmRampEnabled || isPlaybackActive}
                            onValueChange={(value) =>
                                updateSettings({
                                    bpmRampAmount: value[0] ?? 10,
                                })
                            }
                        />
                    </div>
                </section>
            </div>
        </div>
    );
    //#endregion
};

export default BpmContainer;
