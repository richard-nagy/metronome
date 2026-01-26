import { getColorFromRange } from "@/helpers/utils";
import { useCallback, useMemo, useState } from "react";
import BpmControls from "../bpm/BpmControls";
import BpmCounter from "../bpm/BpmCounter";
import BpmPulse from "../bpm/BpmPulse";
import BpmSlider from "../bpm/BpmSlider";
import { ThemeToggle } from "../ThemeToggle";

const maxValue = 300;
const minValue = 40;
const defaultValue = 120;

export default function Layout() {
    const [bpm, setBpm] = useState(defaultValue);
    const [isRunning, setIsRunning] = useState(false);
    const [currentBeat, setCurrentBeat] = useState(0);

    const color = useMemo(
        () => getColorFromRange(bpm, minValue, maxValue),
        [bpm],
    );

    const onButtonChange = useCallback((value: number) => {
        setBpm((oldBpm) => {
            const result = oldBpm + value;
            if (result <= minValue) {
                return minValue;
            } else if (result >= maxValue) {
                return maxValue;
            }
            return result;
        });
    }, []);

    const onInputChange = useCallback((value: number) => {
        setBpm(value);
    }, []);

    const onInputBlur = useCallback(() => {
        setBpm((oldBpm) => {
            if (oldBpm <= minValue) {
                return minValue;
            } else if (oldBpm >= maxValue) {
                return maxValue;
            }
            return oldBpm;
        });
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 p-2 ml-auto">
                <ThemeToggle />
            </header>
            <main className="flex flex-1 flex-col gap-5 items-center justify-center min-w-100">
                <BpmPulse
                    isRunning={isRunning}
                    color={color}
                    bpm={bpm}
                    currentBeat={currentBeat}
                />
                <BpmCounter
                    color={color}
                    bpm={bpm}
                    isRunning={isRunning}
                    currentBeat={currentBeat}
                    setIsRunning={setIsRunning}
                    setCurrentBeat={setCurrentBeat}
                />
                <BpmSlider
                    bpm={bpm}
                    min={minValue}
                    max={maxValue}
                    defaultValue={defaultValue}
                    color={color}
                    onChange={setBpm}
                    onDoubleClick={() => setBpm(defaultValue)}
                />
                <BpmControls
                    bpm={bpm}
                    min={minValue}
                    max={maxValue}
                    color={color}
                    onButtonChange={onButtonChange}
                    onInputChange={onInputChange}
                    onInputBlur={onInputBlur}
                />
            </main>
        </div>
    );
}
