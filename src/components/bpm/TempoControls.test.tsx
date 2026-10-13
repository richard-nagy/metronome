import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TempoControls } from "./TempoControls";

let root: Root | undefined;
let container: HTMLDivElement | undefined;

function mountTempoControls(onBpmChange: (bpm: number) => void) {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
        root?.render(
            <TempoControls
                bpm={120}
                beatCounter={4}
                beat={undefined}
                isRunning={false}
                isCountingIn={false}
                isPlaybackActive={false}
                subdivisionsPerBeat={1}
                compoundMeter={false}
                showNumbers={false}
                countdown={null}
                color="#000000"
                onBpmChange={onBpmChange}
                onToggle={vi.fn()}
            />,
        );
    });

    const input = container.querySelector<HTMLInputElement>(
        'input[aria-label="Tempo in beats per minute"]',
    );
    if (!input) {
        throw new Error("Tempo input was not rendered");
    }
    return input;
}

function changeInputValue(input: HTMLInputElement, value: string) {
    const valueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
    )?.set;

    act(() => {
        valueSetter?.call(input, value);
        input.dispatchEvent(new Event("input", { bubbles: true }));
    });
}

beforeEach(() => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.stubGlobal(
        "ResizeObserver",
        class MockResizeObserver {
            observe = vi.fn();
            unobserve = vi.fn();
            disconnect = vi.fn();
        },
    );
});

afterEach(() => {
    if (root) {
        act(() => root?.unmount());
        root = undefined;
    }
    container?.remove();
    container = undefined;
    vi.unstubAllGlobals();
});

describe("TempoControls", () => {
    it("allows replacing a cleared tempo and commits it on blur", () => {
        const onBpmChange = vi.fn();
        const input = mountTempoControls(onBpmChange);

        act(() => input.focus());
        changeInputValue(input, "");
        expect(input.value).toBe("");
        expect(onBpmChange).not.toHaveBeenCalled();

        changeInputValue(input, "90");
        expect(input.value).toBe("90");
        expect(onBpmChange).not.toHaveBeenCalled();

        act(() => input.blur());

        expect(onBpmChange).toHaveBeenCalledWith(90);
        expect(input.value).toBe("90");
    });

    it("restores the previous tempo when a cleared value is left blank", () => {
        const onBpmChange = vi.fn();
        const input = mountTempoControls(onBpmChange);

        act(() => input.focus());
        changeInputValue(input, "");
        act(() => input.blur());

        expect(input.value).toBe("120");
        expect(onBpmChange).not.toHaveBeenCalled();
    });
});
