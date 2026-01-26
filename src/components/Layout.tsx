import { getColorFromRange } from "@/lib/utils";
import { useCallback, useMemo, useState } from "react";
import BeatCounter from "./BeatCounter";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";

const maxValue = 300;
const minValue = 40;
const defaultValue = 120;

export default function Layout() {
    const [bpm, setBpm] = useState(defaultValue);

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
                <BeatCounter color={color} bpm={bpm} />
                <Slider
                    defaultValue={[defaultValue]}
                    value={[bpm]}
                    min={minValue}
                    max={maxValue}
                    step={1}
                    fillColor={color}
                    className="w-100"
                    onValueChange={(value) => setBpm(value[0] ?? minValue)}
                    onDoubleClick={() => setBpm(defaultValue)}
                />
                <div className="flex flex-row gap-3">
                    <Button
                        className="h-10 w-18"
                        onClick={() => onButtonChange(-10)}
                    >
                        -10
                    </Button>
                    <Button
                        className="h-10 w-18"
                        onClick={() => onButtonChange(-1)}
                    >
                        -1
                    </Button>
                    <Input
                        value={bpm}
                        min={minValue}
                        max={maxValue}
                        type="number"
                        className="h-10 w-18 text-center"
                        style={{ color: color }}
                        onChange={(e) => setBpm(parseInt(e.target.value))}
                        onBlur={onInputBlur}
                    />
                    <Button
                        className="h-10 w-18"
                        onClick={() => onButtonChange(1)}
                    >
                        +1
                    </Button>
                    <Button
                        className="h-10 w-18"
                        onClick={() => onButtonChange(10)}
                    >
                        +10
                    </Button>
                </div>
            </main>
        </div>
    );
}
