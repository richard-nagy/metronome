import {
    SoundId,
    SoundOption,
    SubdivisionMode,
    TimeSignature,
} from "@/types/types";
import { useEffect, useState } from "react";
import type { MetronomeSettings } from "./useMetronomeSettings";

export interface MetronomePreset {
    id: string;
    name: string;
    settings: MetronomeSettings;
}

const presetsStorageKey = "metronome-presets";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isMetronomePreset(value: unknown): value is MetronomePreset {
    if (!isRecord(value) || !isRecord(value.settings)) {
        return false;
    }

    const settings = value.settings;
    return (
        typeof value.id === "string" &&
        typeof value.name === "string" &&
        value.name.trim().length > 0 &&
        typeof settings.bpm === "number" &&
        Number.isFinite(settings.bpm) &&
        typeof settings.bpmRampEnabled === "boolean" &&
        Number.isInteger(settings.bpmRampBars) &&
        typeof settings.bpmRampAmount === "number" &&
        Number.isFinite(settings.bpmRampAmount) &&
        Object.values(SubdivisionMode).includes(
            settings.subdivisionMode as SubdivisionMode,
        ) &&
        Object.values(TimeSignature).includes(
            settings.timeSignature as TimeSignature,
        ) &&
        typeof settings.showNumbers === "boolean" &&
        typeof settings.countInEnabled === "boolean" &&
        typeof settings.volume === "number" &&
        Number.isFinite(settings.volume) &&
        Object.values(SoundOption).includes(
            settings.soundOption as SoundOption,
        ) &&
        Object.values(SoundId).includes(settings.soundId as SoundId)
    );
}

function loadPresets(): MetronomePreset[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const storedValue = localStorage.getItem(presetsStorageKey);
        if (!storedValue) {
            return [];
        }

        const stored: unknown = JSON.parse(storedValue);
        return Array.isArray(stored) ? stored.filter(isMetronomePreset) : [];
    } catch {
        return [];
    }
}

export function useMetronomePresets() {
    const [presets, setPresets] = useState(loadPresets);

    useEffect(() => {
        try {
            localStorage.setItem(presetsStorageKey, JSON.stringify(presets));
        } catch {
            // Storage may be unavailable in restricted browser contexts.
        }
    }, [presets]);

    const savePreset = (name: string, settings: MetronomeSettings) => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            return;
        }

        const preset: MetronomePreset = {
            id: crypto.randomUUID(),
            name: trimmedName,
            settings: { ...settings },
        };
        setPresets((current) => [...current, preset]);
    };

    const deletePreset = (presetId: string) => {
        setPresets((current) =>
            current.filter((preset) => preset.id !== presetId),
        );
    };

    return { presets, savePreset, deletePreset };
}
