import { describe, expect, it } from "vitest";
import { SubdivisionMode, TimeSignature } from "@/types/types";
import { getTimeSignatureConfig } from "./constants";

describe("getTimeSignatureConfig", () => {
    it.each([
        {
            signature: TimeSignature.FourFour,
            subdivisionMode: SubdivisionMode.Eighths,
            beatsPerBar: 4,
            subdivisionsPerBeat: 2,
            compound: false,
        },
        {
            signature: TimeSignature.SixEight,
            subdivisionMode: SubdivisionMode.Off,
            beatsPerBar: 2,
            subdivisionsPerBeat: 3,
            compound: true,
        },
        {
            signature: TimeSignature.NineEight,
            subdivisionMode: SubdivisionMode.Triplets,
            beatsPerBar: 3,
            subdivisionsPerBeat: 3,
            compound: true,
        },
    ])(
        "maps $signature to $beatsPerBar main beats with $subdivisionsPerBeat subdivisions",
        ({ signature, subdivisionMode, ...expected }) => {
            expect(getTimeSignatureConfig(signature, subdivisionMode)).toEqual(
                expected,
            );
        },
    );
});
