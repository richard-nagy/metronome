import BpmCircle from "./BpmCircle";

interface BpmVisualCueProps {
    beatCounter: number;
    bpm: number;
    beat: number | undefined;
    isRunning: boolean;
    showDownBeats: boolean;
    color: string;
}
const BpmVisualCue = ({
    beatCounter,
    bpm,
    beat,
    isRunning,
    showDownBeats,
    color,
}: BpmVisualCueProps) => {
    return (
        <div className="flex mb-4 gap-4 w-74 h-74 flex-wrap flex-row justify-center items-center">
            {Array.from({ length: beatCounter }, (_, i) => (
                <BpmCircle
                    key={i}
                    bpm={bpm}
                    color={color}
                    first={i === 0}
                    active={isRunning && beat === i}
                    downBeat={showDownBeats && i % 2 !== 0}
                />
            ))}
        </div>
    );
};

export default BpmVisualCue;
