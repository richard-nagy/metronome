import { type ChangeEvent } from "react";
import { Plus, Minus } from "lucide-react";
import {
    maxBpmRampAmount,
    maxBpmRampBars,
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
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

interface TempoRampSettingsProps {
    enabled: boolean;
    bars: number;
    amount: number;
    isPlaybackActive: boolean;
    onEnabledChange: (enabled: boolean) => void;
    onBarsChange: (bars: number) => void;
    onAmountChange: (amount: number) => void;
}

export function TempoRampSettings({
    enabled,
    bars,
    amount,
    isPlaybackActive,
    onEnabledChange,
    onBarsChange,
    onAmountChange,
}: TempoRampSettingsProps) {
    const disabled = !enabled || isPlaybackActive;

    const onAmountInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.valueAsNumber;
        if (Number.isNaN(value)) {
            return;
        }

        onAmountChange(
            Math.min(
                maxBpmRampAmount,
                Math.max(minBpmRampAmount, Math.round(value)),
            ),
        );
    };

    return (
        <section className="flex flex-col gap-4 sm:col-span-full sm:row-start-5">
            <div className="flex items-center justify-between">
                <Label htmlFor="bpm-ramp-enabled">Tempo ramp</Label>
                <Switch
                    id="bpm-ramp-enabled"
                    checked={enabled}
                    disabled={isPlaybackActive}
                    onCheckedChange={onEnabledChange}
                />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <Label id="bpm-ramp-bars-label">Increase every</Label>
                    <div
                        role="group"
                        aria-labelledby="bpm-ramp-bars-label"
                        className="flex items-center gap-1"
                    >
                        <Button
                            className="size-9"
                            variant="outline"
                            aria-label="Decrease bars between tempo changes"
                            disabled={disabled || bars <= minBpmRampBars}
                            onClick={() =>
                                onBarsChange(Math.max(minBpmRampBars, bars - 1))
                            }
                        >
                            <Minus className="size-4" />
                        </Button>
                        <output
                            aria-disabled={disabled}
                            className={`min-w-16 text-center font-medium tabular-nums ${
                                disabled ? "text-muted-foreground" : ""
                            }`}
                        >
                            {bars} {bars === 1 ? "bar" : "bars"}
                        </output>
                        <Button
                            className="size-9"
                            variant="outline"
                            aria-label="Increase bars between tempo changes"
                            disabled={disabled || bars >= maxBpmRampBars}
                            onClick={() =>
                                onBarsChange(Math.min(maxBpmRampBars, bars + 1))
                            }
                        >
                            <Plus className="size-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="bpm-ramp-amount">BPM change</Label>
                    <InputGroup className="w-24">
                        <InputGroupInput
                            id="bpm-ramp-amount"
                            type="number"
                            min={minBpmRampAmount}
                            max={maxBpmRampAmount}
                            step={1}
                            className="text-right tabular-nums font-bold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            value={amount}
                            disabled={disabled}
                            onChange={onAmountInputChange}
                        />
                        <InputGroupAddon align="inline-end">
                            <span className="font-medium text-lg">BPM</span>
                        </InputGroupAddon>
                    </InputGroup>
                </div>
                <Slider
                    aria-label="BPM change per interval"
                    value={[amount]}
                    min={minBpmRampAmount}
                    max={maxBpmRampAmount}
                    step={1}
                    disabled={disabled}
                    onValueChange={(value) => onAmountChange(value[0] ?? 0)}
                    onDoubleClick={() => onAmountChange(0)}
                />
            </div>
        </section>
    );
}
