import {
    SoundId,
    SoundOption,
    SubdivisionMode,
    TimeSignature,
} from "@/types/types";
import { useEffect, useState } from "react";
import {
    defaultBpm,
    defaultBpmRampAmount,
    defaultBpmRampBars,
    maxBeatCounter,
    maxBpm,
    maxBpmRampAmount,
    maxBpmRampBars,
    minBeatCounter,
    minBpm,
    minBpmRampAmount,
    minBpmRampBars,
} from "../constants";

export interface MetronomeSettings {
    bpm: number;
    bpmRampEnabled: boolean;
    bpmRampBars: number;
    bpmRampAmount: number;
    subdivisionMode: SubdivisionMode;
    timeSignature: TimeSignature;
    showNumbers: boolean;
    countInEnabled: boolean;
    volume: number;
    soundOption: SoundOption;
    soundId: SoundId;
}

const settingsStorageKey = "metronome-settings";

const defaultSettings: MetronomeSettings = {
    bpm: defaultBpm,
    bpmRampEnabled: false,
    bpmRampBars: defaultBpmRampBars,
    bpmRampAmount: defaultBpmRampAmount,
    subdivisionMode: SubdivisionMode.Off,
    timeSignature: TimeSignature.FourFour,
    showNumbers: false,
    countInEnabled: true,
    volume: 1,
    soundOption: SoundOption.Full,
    soundId: SoundId.Click,
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

        const stored = JSON.parse(storedValue) as Partial<MetronomeSettings> & {
            showSubdivisions?: boolean;
            beatCounter?: number;
        };
        const migratedTimeSignature =
            typeof stored.beatCounter === "number" &&
            Number.isInteger(stored.beatCounter) &&
            stored.beatCounter >= minBeatCounter &&
            stored.beatCounter <= maxBeatCounter
                ? (`${stored.beatCounter}/4` as TimeSignature)
                : defaultSettings.timeSignature;
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
            subdivisionMode: Object.values(SubdivisionMode).includes(
                stored.subdivisionMode as SubdivisionMode,
            )
                ? (stored.subdivisionMode as SubdivisionMode)
                : stored.showSubdivisions === true
                  ? SubdivisionMode.Eighths
                  : SubdivisionMode.Off,
            timeSignature: Object.values(TimeSignature).includes(
                stored.timeSignature as TimeSignature,
            )
                ? (stored.timeSignature as TimeSignature)
                : migratedTimeSignature,
            showNumbers:
                typeof stored.showNumbers === "boolean"
                    ? stored.showNumbers
                    : defaultSettings.showNumbers,
            countInEnabled:
                typeof stored.countInEnabled === "boolean"
                    ? stored.countInEnabled
                    : defaultSettings.countInEnabled,
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
            soundId: Object.values(SoundId).includes(stored.soundId as SoundId)
                ? (stored.soundId as SoundId)
                : defaultSettings.soundId,
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
