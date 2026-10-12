import { SoundOption, SubdivisionMode } from "@/types/types";
import { Save, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { soundOptions } from "../constants";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { MetronomeSettings } from "./useMetronomeSettings";
import { useMetronomePresets } from "./useMetronomePresets";

interface PresetsSettingsProps {
    settings: MetronomeSettings;
    isPlaybackActive: boolean;
    onApplyPreset: (settings: MetronomeSettings) => void;
}

const subdivisionLabels: Record<SubdivisionMode, string> = {
    [SubdivisionMode.Off]: "No subdivisions",
    [SubdivisionMode.Eighths]: "Eighth notes",
    [SubdivisionMode.Triplets]: "Triplets",
    [SubdivisionMode.Sixteenths]: "Sixteenth notes",
};

const soundPatternLabels: Record<SoundOption, string> = {
    [SoundOption.All]: "Every beat",
    [SoundOption.Full]: "Main beats",
    [SoundOption.First]: "First beat only",
};

function summarizeSettings(settings: MetronomeSettings) {
    const soundName =
        soundOptions.find((option) => option.id === settings.soundId)?.label ??
        "Classic click";
    const ramp = settings.bpmRampEnabled
        ? `on (+${settings.bpmRampAmount} BPM every ${settings.bpmRampBars} bars)`
        : "off";

    return [
        `${settings.bpm} BPM`,
        settings.timeSignature,
        subdivisionLabels[settings.subdivisionMode],
        soundName,
        soundPatternLabels[settings.soundOption],
        `${Math.round(settings.volume * 100)}% volume`,
        `Count-in ${settings.countInEnabled ? "on" : "off"}`,
        `Numbers ${settings.showNumbers ? "on" : "off"}`,
        `Ramp ${ramp}`,
    ].join(" | ");
}

export function PresetsSettings({
    settings,
    isPlaybackActive,
    onApplyPreset,
}: PresetsSettingsProps) {
    const { presets, savePreset, deletePreset } = useMetronomePresets();
    const [isSaving, setIsSaving] = useState(false);
    const [presetName, setPresetName] = useState("");

    const handleSave = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const name = presetName.trim();
        if (!name) {
            return;
        }

        savePreset(name, settings);
        setPresetName("");
        setIsSaving(false);
    };

    const presetForm = (
        <form className="flex w-full items-end gap-2" onSubmit={handleSave}>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Label htmlFor="preset-name">Preset name</Label>
                <Input
                    id="preset-name"
                    autoFocus
                    maxLength={40}
                    value={presetName}
                    onChange={(event) => setPresetName(event.target.value)}
                    placeholder="e.g. Slow triplets"
                />
            </div>
            <Button type="submit" disabled={!presetName.trim()}>
                Save
            </Button>
            <Button
                type="button"
                variant="ghost"
                onClick={() => {
                    setIsSaving(false);
                    setPresetName("");
                }}
            >
                Cancel
            </Button>
        </form>
    );

    return (
        <section className="flex w-full flex-col gap-3 border-t pt-5">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-medium">Presets</h2>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setIsSaving((current) => !current)}
                >
                    <Save className="size-4" />
                    Save preset
                </Button>
            </div>
            {presets.length === 0 ? (
                <div className="flex h-20 items-center">
                    {isSaving ? (
                        presetForm
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No saved presets.
                        </p>
                    )}
                </div>
            ) : (
                <>
                    {isSaving && presetForm}
                    <ul
                        aria-label="Saved presets"
                        className="divide-y rounded-md border"
                    >
                        {presets.map((preset) => (
                            <li
                                key={preset.id}
                                className="flex min-w-0 items-center gap-1 px-1"
                            >
                                <button
                                    type="button"
                                    className="flex min-w-0 flex-1 flex-col gap-1 rounded-sm px-2 py-2 text-left outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label={`Apply preset ${preset.name}`}
                                    disabled={isPlaybackActive}
                                    onClick={() =>
                                        onApplyPreset(preset.settings)
                                    }
                                >
                                    <span className="w-full truncate text-sm font-medium">
                                        {preset.name}
                                    </span>
                                    <span className="w-full text-xs leading-snug text-muted-foreground">
                                        {summarizeSettings(preset.settings)}
                                    </span>
                                </button>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="size-8 shrink-0"
                                    aria-label={`Delete preset ${preset.name}`}
                                    title={`Delete preset ${preset.name}`}
                                    onClick={() => deletePreset(preset.id)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </section>
    );
}
