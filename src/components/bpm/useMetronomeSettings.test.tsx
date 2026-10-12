import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    SoundId,
    SoundOption,
    SubdivisionMode,
    TimeSignature,
} from "@/types/types";
import {
    defaultBpm,
    defaultBpmRampAmount,
    defaultBpmRampBars,
} from "../constants";
import { useMetronomeSettings } from "./useMetronomeSettings";

const settingsStorageKey = "metronome-settings";

let settingsResult: ReturnType<typeof useMetronomeSettings>;
let root: Root | undefined;

function SettingsHarness() {
    settingsResult = useMetronomeSettings();
    return null;
}

function mountSettings() {
    root = createRoot(document.createElement("div"));
    act(() => root?.render(<SettingsHarness />));
}

function unmountSettings() {
    if (!root) {
        return;
    }
    act(() => root?.unmount());
    root = undefined;
}

beforeEach(() => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    localStorage.clear();
});

afterEach(() => {
    unmountSettings();
    localStorage.clear();
    vi.unstubAllGlobals();
});

describe("useMetronomeSettings", () => {
    it("persists updated settings across remounts", () => {
        mountSettings();

        act(() => {
            settingsResult.updateSettings({
                bpm: 148,
                subdivisionMode: SubdivisionMode.Triplets,
                timeSignature: TimeSignature.SixEight,
                soundOption: SoundOption.First,
                soundId: SoundId.Wood,
            });
        });
        unmountSettings();

        mountSettings();

        expect(settingsResult.settings).toMatchObject({
            bpm: 148,
            subdivisionMode: SubdivisionMode.Triplets,
            timeSignature: TimeSignature.SixEight,
            soundOption: SoundOption.First,
            soundId: SoundId.Wood,
        });
    });

    it("migrates a saved beat count to a quarter-note time signature", () => {
        localStorage.setItem(
            settingsStorageKey,
            JSON.stringify({ beatCounter: 6 }),
        );

        mountSettings();

        expect(settingsResult.settings.timeSignature).toBe(
            TimeSignature.SixFour,
        );
    });

    it("migrates enabled legacy subdivisions to eighth notes", () => {
        localStorage.setItem(
            settingsStorageKey,
            JSON.stringify({ showSubdivisions: true }),
        );

        mountSettings();

        expect(settingsResult.settings.subdivisionMode).toBe(
            SubdivisionMode.Eighths,
        );
    });

    it("uses defaults and replaces malformed stored JSON", () => {
        localStorage.setItem(settingsStorageKey, "{");

        mountSettings();

        expect(settingsResult.settings).toMatchObject({
            bpm: defaultBpm,
            bpmRampEnabled: false,
            bpmRampBars: defaultBpmRampBars,
            bpmRampAmount: defaultBpmRampAmount,
            subdivisionMode: SubdivisionMode.Off,
            showNumbers: false,
            countInEnabled: true,
            timeSignature: TimeSignature.FourFour,
            volume: 1,
            soundOption: SoundOption.Full,
            soundId: SoundId.Click,
        });
        expect(
            JSON.parse(localStorage.getItem(settingsStorageKey) ?? "{}"),
        ).toMatchObject(settingsResult.settings);
    });

    it("clamps out-of-range values and defaults invalid fields", () => {
        localStorage.setItem(
            settingsStorageKey,
            JSON.stringify({
                bpm: 500,
                bpmRampEnabled: "true",
                bpmRampBars: 0,
                bpmRampAmount: -100,
                beatCounter: 1,
                volume: 2,
                soundOption: "invalid",
                soundId: "invalid",
            }),
        );

        mountSettings();

        expect(settingsResult.settings).toMatchObject({
            bpm: 300,
            bpmRampEnabled: false,
            bpmRampBars: 1,
            bpmRampAmount: -50,
            timeSignature: TimeSignature.FourFour,
            volume: 1,
            soundOption: SoundOption.Full,
            soundId: SoundId.Click,
        });
    });
});
