import { Slider } from "../ui/slider";

interface BpmSliderProps {
    bpm: number;
    min: number;
    max: number;
    defaultValue: number;
    color: string;
    onChange: (value: number) => void;
    onDoubleClick: () => void;
}
const BpmSlider = ({
    bpm,
    min,
    max,
    defaultValue,
    color,
    onChange,
    onDoubleClick,
}: BpmSliderProps) => (
    <Slider
        defaultValue={[defaultValue]}
        value={[bpm]}
        min={min}
        max={max}
        step={1}
        fillColor={color}
        className="w-100"
        onValueChange={(value) => onChange(value[0] ?? min)}
        onDoubleClick={onDoubleClick}
    />
);

export default BpmSlider;
