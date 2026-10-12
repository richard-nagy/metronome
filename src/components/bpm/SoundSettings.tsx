import { SoundId, SoundOption } from "@/types/types";
import { ChevronDown, Play, Volume1, Volume2, VolumeX } from "lucide-react";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Slider } from "../ui/slider";
import { soundOptions } from "../constants";

interface SoundSettingsProps {
    volume: number;
    soundOption: SoundOption;
    soundId: SoundId;
    onVolumeChange: (volume: number) => void;
    onSoundOptionChange: (option: SoundOption) => void;
    onSoundIdChange: (soundId: SoundId) => void;
    onPreviewSound: (soundId: SoundId) => void;
}

export function SoundSettings({
    volume,
    soundOption,
    soundId,
    onVolumeChange,
    onSoundOptionChange,
    onSoundIdChange,
    onPreviewSound,
}: SoundSettingsProps) {
    return (
        <section className="flex flex-col gap-4 sm:col-start-1 sm:row-start-1">
            <h2 className="text-sm font-medium">Sound</h2>
            <div className="flex items-end gap-2">
                <div className="flex min-w-0 flex-col gap-2">
                    <Label>Metronome sound</Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="h-9 w-40 justify-between px-3 font-normal"
                                variant="outline"
                                aria-label={`Metronome sound: ${soundOptions.find((option) => option.id === soundId)?.label ?? "Classic click"}`}
                            >
                                <span>
                                    {soundOptions.find(
                                        (option) => option.id === soundId,
                                    )?.label ?? "Classic click"}
                                </span>
                                <ChevronDown className="size-4 opacity-60" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40">
                            <DropdownMenuRadioGroup
                                value={soundId}
                                aria-label="Metronome sound"
                                onValueChange={(value) =>
                                    onSoundIdChange(value as SoundId)
                                }
                            >
                                {soundOptions.map((option) => (
                                    <DropdownMenuRadioItem
                                        key={option.id}
                                        value={option.id}
                                    >
                                        {option.label}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Button
                    className="size-9 shrink-0"
                    variant="ghost"
                    aria-label="Preview selected sound"
                    title="Preview selected sound"
                    disabled={volume === 0}
                    onClick={() => onPreviewSound(soundId)}
                >
                    <Play className="size-4" />
                </Button>
            </div>
            <div className="flex items-center gap-3">
                <Button
                    className="size-9 shrink-0"
                    variant="ghost"
                    aria-label={volume === 0 ? "Unmute" : "Mute"}
                    onClick={() => onVolumeChange(volume === 0 ? 1 : 0)}
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
                    onValueChange={(value) => onVolumeChange(value[0] ?? 0)}
                    onDoubleClick={() => onVolumeChange(1)}
                />
            </div>
            <RadioGroup
                value={soundOption}
                aria-label="Beat pattern"
                className="gap-2"
                onValueChange={(value) =>
                    onSoundOptionChange(value as SoundOption)
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
    );
}
