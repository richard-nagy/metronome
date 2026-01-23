import { describe, expect, it } from "vitest";
import { getColorFromRange } from "./utils";

describe("getColorFromRange", () => {
    it("Should return a neutral color when minValue equals maxValue", () => {
        const result = getColorFromRange(50, 100, 100);
        expect(result).toBe("hsl(0, 0%, 50%)");
    });

    it("Should return blue-green for the minimum value", () => {
        const result = getColorFromRange(0, 0, 100);
        expect(result).toBe("hsl(180, 100%, 50%)");
    });

    it("Should return red for the maximum value", () => {
        const result = getColorFromRange(100, 0, 100);
        expect(result).toBe("hsl(0, 100%, 50%)");
    });

    it("Should return yellow-green for the midpoint value", () => {
        const result = getColorFromRange(50, 0, 100);
        expect(result).toBe("hsl(90, 100%, 50%)");
    });

    it("Should clamp the value to the minimum if below range", () => {
        const result = getColorFromRange(-10, 0, 100);
        expect(result).toBe("hsl(180, 100%, 50%)");
    });

    it("Should clamp the value to the maximum if above range", () => {
        const result = getColorFromRange(150, 0, 100);
        expect(result).toBe("hsl(0, 100%, 50%)");
    });

    it("should return the correct color for a value within the range 40 to 300", () => {
        const result = getColorFromRange(170, 40, 300);
        expect(result).toBe("hsl(90, 100%, 50%)");
    });
});
