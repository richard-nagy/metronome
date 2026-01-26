import BpmControls from "../bpm/BpmControls";
import BpmCounter from "../bpm/BpmCounter";
import BpmSlider from "../bpm/BpmSlider";

interface MainContentProps {
    bpm: number;
    setBpm: (bpm: number) => void;
    color: string;
    minValue: number;
    maxValue: number;
    defaultValue: number;
    onButtonChange: (value: number) => void;
    onInputChange: (value: number) => void;
    onInputBlur: () => void;
}

export default function MainContent({
    bpm,
    setBpm,
    color,
    minValue,
    maxValue,
    defaultValue,
    onButtonChange,
    onInputChange,
    onInputBlur,
}: MainContentProps) {
    return (
        <main className="flex flex-1 flex-col gap-5 items-center justify-center min-w-100">
            <BpmCounter color={color} bpm={bpm} />
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
