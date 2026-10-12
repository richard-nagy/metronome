import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    SoundId,
    SoundOption,
    SubdivisionMode,
    TimeSignature,
} from "@/types/types";
import type { MetronomeSettings } from "./useMetronomeSettings";
import { useMetronomePresets } from "./useMetronomePresets";

const presetsStorageKey = "metronome-presets";

let presetsResult: ReturnType<typeof useMetronomePresets>;
let root: Root | undefined;

function PresetsHarness() {
    presetsResult = useMetronomePresets();
    return null;
}

function mountPresets() {
    root = createRoot(document.createElement("div"));
    act(() => root?.render(<PresetsHarness />));
}

function unmountPresets() {
    if (!root) {
        return;
    }
    act(() => root?.unmount());
    root = undefined;
}

const settings: MetronomeSettings = {
    bpm: 148,
    bpmRampEnabled: true,
    bpmRampBars: 4,
    bpmRampAmount: 5,
    subdivisionMode: SubdivisionMode.Triplets,
    timeSignature: TimeSignature.SixEight,
    showNumbers: true,
    countInEnabled: false,
    volume: 0.7,
    soundOption: SoundOption.First,
    soundId: SoundId.Wood,
};

beforeEach(() => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    localStorage.clear();
});

afterEach(() => {
    unmountPresets();
    localStorage.clear();
    vi.unstubAllGlobals();
});

describe("useMetronomePresets", () => {
    it("saves named settings snapshots and restores them after remount", () => {
        mountPresets();

        act(() => presetsResult.savePreset("Triplet practice", settings));
        unmountPresets();
        mountPresets();

        expect(presetsResult.presets).toHaveLength(1);
        expect(presetsResult.presets[0]).toMatchObject({
            name: "Triplet practice",
            settings,
        });
    });

    it("deletes a saved preset from persistent storage", () => {
        mountPresets();
        act(() => presetsResult.savePreset("Triplet practice", settings));

        const presetId = presetsResult.presets[0]?.id;
        expect(presetId).toBeDefined();

        act(() => presetsResult.deletePreset(presetId!));

        expect(presetsResult.presets).toEqual([]);
        expect(
            JSON.parse(localStorage.getItem(presetsStorageKey) ?? "[]"),
        ).toEqual([]);
    });
});
