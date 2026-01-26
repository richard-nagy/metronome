import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface BpmControlsProps {
    bpm: number;
    min: number;
    max: number;
    color: string;
    onButtonChange: (value: number) => void;
    onInputChange: (value: number) => void;
    onInputBlur: () => void;
}

const BpmControls = ({
    bpm,
    min,
    max,
    color,
    onButtonChange,
    onInputChange,
    onInputBlur,
}: BpmControlsProps) => (
    <div className="flex flex-row gap-3">
        <Button className="h-10 w-18" onClick={() => onButtonChange(-10)}>
            -10
        </Button>
        <Button className="h-10 w-18" onClick={() => onButtonChange(-1)}>
            -1
        </Button>
        <Input
            value={bpm}
            min={min}
            max={max}
            type="number"
            className="h-10 w-18 text-center"
            style={{ color }}
            onChange={(e) => onInputChange(parseInt(e.target.value))}
            onBlur={onInputBlur}
        />
        <Button className="h-10 w-18" onClick={() => onButtonChange(1)}>
            +1
        </Button>
        <Button className="h-10 w-18" onClick={() => onButtonChange(10)}>
            +10
        </Button>
    </div>
);

export default BpmControls;
