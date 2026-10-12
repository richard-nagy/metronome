import { Plus, Minus } from "lucide-react";
import { maxBeatCounter, minBeatCounter } from "../constants";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface RhythmSettingsProps {
    beatCounter: number;
    showSubdivisions: boolean;
    showNumbers: boolean;
    countInEnabled: boolean;
    isPlaybackActive: boolean;
    onBeatCounterChange: (beatCounter: number) => void;
    onSubdivisionsChange: (showSubdivisions: boolean) => void;
    onNumbersChange: (showNumbers: boolean) => void;
    onCountInChange: (countInEnabled: boolean) => void;
}

export function RhythmSettings({
    beatCounter,
    showSubdivisions,
    showNumbers,
    countInEnabled,
    isPlaybackActive,
    onBeatCounterChange,
    onSubdivisionsChange,
    onNumbersChange,
    onCountInChange,
}: RhythmSettingsProps) {
    return (
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
                            isPlaybackActive || beatCounter <= minBeatCounter
                        }
                        onClick={() =>
                            onBeatCounterChange(
                                Math.max(minBeatCounter, beatCounter - 1),
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
                        disabled={
                            isPlaybackActive || beatCounter >= maxBeatCounter
                        }
                        onClick={() =>
                            onBeatCounterChange(
                                Math.min(maxBeatCounter, beatCounter + 1),
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
                    onCheckedChange={onSubdivisionsChange}
                />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="show-numbers">Numbers</Label>
                <Switch
                    id="show-numbers"
                    checked={showNumbers}
                    onCheckedChange={onNumbersChange}
                />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="count-in-enabled">Countdown</Label>
                <Switch
                    id="count-in-enabled"
                    checked={countInEnabled}
                    onCheckedChange={onCountInChange}
                />
            </div>
        </section>
    );
}
