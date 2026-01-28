import { Theme } from "@/types/types";
import { describe, expect, it } from "vitest";
import { getColorFromRange } from "./utils";

describe("getColorFromRange", () => {
    it("Should return a neutral color when minValue equals maxValue", () => {
        const result = getColorFromRange(50, 100, 100, Theme.Dark);
        expect(result).toBe("hsl(0, 0%, 50%)");
    });

    it("Should return blue-green for the minimum value (Dark)", () => {
        const result = getColorFromRange(0, 0, 100, Theme.Dark);
        expect(result).toBe("hsl(180, 100%, 60%)");
    });

    it("Should return blue-green for the minimum value (Light)", () => {
        const result = getColorFromRange(0, 0, 100, Theme.Light);
        expect(result).toBe("hsl(180, 100%, 40%)");
    });

    it("Should return red for the maximum value (Dark)", () => {
        const result = getColorFromRange(100, 0, 100, Theme.Dark);
        expect(result).toBe("hsl(0, 100%, 60%)");
    });

    it("Should return red for the maximum value (Light)", () => {
        const result = getColorFromRange(100, 0, 100, Theme.Light);
        expect(result).toBe("hsl(0, 100%, 40%)");
    });

    it("Should return yellow-green for the midpoint value (Dark)", () => {
        const result = getColorFromRange(50, 0, 100, Theme.Dark);
        expect(result).toBe("hsl(90, 100%, 60%)");
    });

    it("Should return yellow-green for the midpoint value (Light)", () => {
        const result = getColorFromRange(50, 0, 100, Theme.Light);
        expect(result).toBe("hsl(90, 100%, 40%)");
    });

    it("Should clamp the value to the minimum if below range (Dark)", () => {
        const result = getColorFromRange(-10, 0, 100, Theme.Dark);
        expect(result).toBe("hsl(180, 100%, 60%)");
    });

    it("Should clamp the value to the maximum if above range (Light)", () => {
        const result = getColorFromRange(150, 0, 100, Theme.Light);
        expect(result).toBe("hsl(0, 100%, 40%)");
    });

    it("should return the correct color for a value within the range 40 to 300 (Dark)", () => {
        const result = getColorFromRange(170, 40, 300, Theme.Dark);
        expect(result).toBe("hsl(90, 100%, 60%)");
    });

    it("should return the correct color for a value within the range 40 to 300 (Light)", () => {
        const result = getColorFromRange(170, 40, 300, Theme.Light);
        expect(result).toBe("hsl(90, 100%, 40%)");
    });
});
