import { useEffect, useState } from "react";
import {
    normalizeMetronomeSettings,
    type MetronomeSettings,
} from "./useMetronomeSettings";

export interface MetronomePreset {
    id: string;
    name: string;
    settings: MetronomeSettings;
}

const presetsStorageKey = "metronome-presets";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function parsePreset(value: unknown): MetronomePreset | null {
    if (
        !isRecord(value) ||
        typeof value.id !== "string" ||
        value.id.trim().length === 0 ||
        typeof value.name !== "string" ||
        value.name.trim().length === 0 ||
        !isRecord(value.settings)
    ) {
        return null;
    }

    return {
        id: value.id,
        name: value.name.trim(),
        settings: normalizeMetronomeSettings(value.settings),
    };
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
        return Array.isArray(stored)
            ? stored.flatMap((preset) => {
                  const parsedPreset = parsePreset(preset);
                  return parsedPreset ? [parsedPreset] : [];
              })
            : [];
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
