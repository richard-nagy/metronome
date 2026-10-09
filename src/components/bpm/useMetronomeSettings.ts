import { SoundOption } from "@/types/types";
import { useEffect, useState } from "react";
import {
    defaultBeatCounter,
    defaultBpm,
    defaultBpmRampAmount,
    defaultBpmRampBars,
    maxBpmRampAmount,
    maxBpmRampBars,
    maxBeatCounter,
    maxBpm,
    minBpmRampAmount,
    minBpmRampBars,
    minBeatCounter,
    minBpm,
} from "../constants";

interface MetronomeSettings {
    bpm: number;
    bpmRampEnabled: boolean;
    bpmRampBars: number;
    bpmRampAmount: number;
    showSubdivisions: boolean;
    showNumbers: boolean;
    countInEnabled: boolean;
    beatCounter: number;
    volume: number;
    soundOption: SoundOption;
}

const settingsStorageKey = "metronome-settings";

const defaultSettings: MetronomeSettings = {
    bpm: defaultBpm,
    bpmRampEnabled: false,
    bpmRampBars: defaultBpmRampBars,
    bpmRampAmount: defaultBpmRampAmount,
    showSubdivisions: false,
    showNumbers: false,
    countInEnabled: true,
    beatCounter: defaultBeatCounter,
    volume: 1,
    soundOption: SoundOption.Full,
};

function loadSettings(): MetronomeSettings {
    if (typeof window === "undefined") {
        return defaultSettings;
    }

    try {
        const storedValue = localStorage.getItem(settingsStorageKey);
        if (!storedValue) {
            return defaultSettings;
        }

        const stored = JSON.parse(storedValue) as Partial<MetronomeSettings>;
        return {
            bpm:
                typeof stored.bpm === "number" && Number.isFinite(stored.bpm)
                    ? Math.min(maxBpm, Math.max(minBpm, Math.round(stored.bpm)))
                    : defaultSettings.bpm,
            bpmRampEnabled:
                typeof stored.bpmRampEnabled === "boolean"
                    ? stored.bpmRampEnabled
                    : defaultSettings.bpmRampEnabled,
            bpmRampBars:
                typeof stored.bpmRampBars === "number" &&
                Number.isInteger(stored.bpmRampBars)
                    ? Math.min(
                          maxBpmRampBars,
                          Math.max(minBpmRampBars, stored.bpmRampBars),
                      )
                    : defaultSettings.bpmRampBars,
            bpmRampAmount:
                typeof stored.bpmRampAmount === "number" &&
                Number.isFinite(stored.bpmRampAmount)
                    ? Math.min(
                          maxBpmRampAmount,
                          Math.max(
                              minBpmRampAmount,
                              Math.round(stored.bpmRampAmount),
                          ),
                      )
                    : defaultSettings.bpmRampAmount,
            showSubdivisions:
                typeof stored.showSubdivisions === "boolean"
                    ? stored.showSubdivisions
                    : defaultSettings.showSubdivisions,
            showNumbers:
                typeof stored.showNumbers === "boolean"
                    ? stored.showNumbers
                    : defaultSettings.showNumbers,
            countInEnabled:
                typeof stored.countInEnabled === "boolean"
                    ? stored.countInEnabled
                    : defaultSettings.countInEnabled,
            beatCounter:
                typeof stored.beatCounter === "number" &&
                Number.isInteger(stored.beatCounter)
                    ? Math.min(
                          maxBeatCounter,
                          Math.max(minBeatCounter, stored.beatCounter),
                      )
                    : defaultSettings.beatCounter,
            volume:
                typeof stored.volume === "number" &&
                Number.isFinite(stored.volume)
                    ? Math.min(1, Math.max(0, stored.volume))
                    : defaultSettings.volume,
            soundOption: Object.values(SoundOption).includes(
                stored.soundOption as SoundOption,
            )
                ? (stored.soundOption as SoundOption)
                : defaultSettings.soundOption,
        };
    } catch {
        return defaultSettings;
    }
}

export function useMetronomeSettings() {
    const [settings, setSettings] = useState(loadSettings);

    useEffect(() => {
        try {
            localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
        } catch {
            // Storage may be unavailable in restricted browser contexts.
        }
    }, [settings]);

    const updateSettings = (updates: Partial<MetronomeSettings>) => {
        setSettings((current) => ({ ...current, ...updates }));
    };

    return { settings, updateSettings };
}
