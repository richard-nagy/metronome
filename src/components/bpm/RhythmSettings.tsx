import { SubdivisionMode, TimeSignature } from "@/types/types";
import { ChevronDown } from "lucide-react";
import { timeSignatureOptions } from "../constants";
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

interface RhythmSettingsProps {
    timeSignature: TimeSignature;
    compoundMeter: boolean;
    subdivisionMode: SubdivisionMode;
    isPlaybackActive: boolean;
    onTimeSignatureChange: (timeSignature: TimeSignature) => void;
    onSubdivisionModeChange: (mode: SubdivisionMode) => void;
}

export function RhythmSettings({
    timeSignature,
    compoundMeter,
    subdivisionMode,
    isPlaybackActive,
    onTimeSignatureChange,
    onSubdivisionModeChange,
}: RhythmSettingsProps) {
    return (
        <section className="flex flex-col gap-4 sm:col-start-3 sm:row-start-1">
            <h2 className="text-sm font-medium">Rhythm</h2>
            <div className="flex items-center justify-between gap-4">
                <Label>Time signature</Label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="h-9 w-24 justify-between px-2 font-normal"
                            variant="outline"
                            disabled={isPlaybackActive}
                            aria-label={`Time signature: ${timeSignature}`}
                        >
                            <span>{timeSignature}</span>
                            <ChevronDown className="size-4 opacity-60" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuRadioGroup
                            value={timeSignature}
                            aria-label="Time signature"
                            onValueChange={(value) =>
                                onTimeSignatureChange(value as TimeSignature)
                            }
                        >
                            {timeSignatureOptions.map((option) => (
                                <DropdownMenuRadioItem
                                    key={option}
                                    value={option}
                                    disabled={isPlaybackActive}
                                >
                                    {option}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {compoundMeter ? (
                <div className="flex items-center justify-between">
                    <Label>Subdivisions</Label>
                    <span className="text-sm text-muted-foreground">
                        Grouped in 3
                    </span>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    <Label id="subdivision-mode-label">Subdivisions</Label>
                    <RadioGroup
                        aria-labelledby="subdivision-mode-label"
                        value={subdivisionMode}
                        className="grid grid-cols-2 gap-2"
                        onValueChange={(value) =>
                            onSubdivisionModeChange(value as SubdivisionMode)
                        }
                    >
                        <div className="flex items-center gap-2">
                            <RadioGroupItem
                                value={SubdivisionMode.Off}
                                id="subdivisions-off"
                            />
                            <Label htmlFor="subdivisions-off">Off</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem
                                value={SubdivisionMode.Eighths}
                                id="subdivisions-eighths"
                            />
                            <Label htmlFor="subdivisions-eighths">
                                Eighths
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem
                                value={SubdivisionMode.Triplets}
                                id="subdivisions-triplets"
                            />
                            <Label htmlFor="subdivisions-triplets">
                                Triplets
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem
                                value={SubdivisionMode.Sixteenths}
                                id="subdivisions-sixteenths"
                            />
                            <Label htmlFor="subdivisions-sixteenths">
                                Sixteenths
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            )}
        </section>
    );
}
