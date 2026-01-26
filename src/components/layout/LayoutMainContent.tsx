import BpmControls from "../bpm/BpmControls";
import BpmCounter from "../bpm/BpmCounter";
import BpmPulse from "../bpm/BpmPulse";
import BpmSlider from "../bpm/BpmSlider";

interface MainContentProps {
    bpm: number;
    color: string;
    minValue: number;
    maxValue: number;
    defaultValue: number;
    isRunning: boolean;
    currentBeat: number;
    setBpm: (bpm: number) => void;
    onButtonChange: (value: number) => void;
    onInputChange: (value: number) => void;
    onInputBlur: () => void;
    setIsRunning: (isRunning: boolean) => void;
    setCurrentBeat: (beat: number) => void;
}

export default function MainContent({
    bpm,
    color,
    minValue,
    maxValue,
    defaultValue,
    isRunning,
    currentBeat,
    setBpm,
    onButtonChange,
    onInputChange,
    onInputBlur,
    setIsRunning,
    setCurrentBeat,
}: MainContentProps) {
    return (
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
    );
}
