import { SubdivisionMode, TimeSignature } from "@/types/types";
import { timeSignatureOptions } from "../constants";
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
                <Label htmlFor="time-signature">Time signature</Label>
                <select
                    id="time-signature"
                    aria-label="Time signature"
                    className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                    value={timeSignature}
                    disabled={isPlaybackActive}
                    onChange={(event) =>
                        onTimeSignatureChange(
                            event.target.value as TimeSignature,
                        )
                    }
                >
                    {timeSignatureOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
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
