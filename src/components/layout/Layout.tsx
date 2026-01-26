import { getColorFromRange } from "@/helpers/utils";
import { useCallback, useMemo, useState } from "react";
import Header from "./LayoutHeader";
import MainContent from "./LayoutMainContent";

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
            <Header />
            <MainContent
                bpm={bpm}
                setBpm={setBpm}
                color={color}
                minValue={minValue}
                maxValue={maxValue}
                defaultValue={defaultValue}
                isRunning={isRunning}
                currentBeat={currentBeat}
                onButtonChange={onButtonChange}
                onInputChange={onInputChange}
                onInputBlur={onInputBlur}
                setIsRunning={setIsRunning}
                setCurrentBeat={setCurrentBeat}
            />
        </div>
    );
}
