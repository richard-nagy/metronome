import { defaultBpm, maxBpm, minBpm } from "../constants";
import { Slider } from "../ui/slider";

interface BpmSliderProps {
    bpm: number;
    color: string;
    onChange: (value: number) => void;
    onDoubleClick: () => void;
}
const BpmSlider = ({ bpm, color, onChange, onDoubleClick }: BpmSliderProps) => (
    <Slider
        defaultValue={[defaultBpm]}
        value={[bpm]}
        min={minBpm}
        max={maxBpm}
        step={1}
        thumbColor={color}
        className="w-100"
        onValueChange={(value) => onChange(value[0] ?? minBpm)}
        onDoubleClick={onDoubleClick}
    />
);

export default BpmSlider;
