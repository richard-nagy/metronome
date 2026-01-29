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
        <div className="flex gap-6 mb-4 max-w-80 flex-wrap flex-row justify-center">
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
