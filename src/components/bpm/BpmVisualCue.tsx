import BpmCircle from "./BpmCircle";

interface BpmVisualCueProps {
    beatCounter: number;
    bpm: number;
    beat: number;
    isRunning: boolean;
}
const BpmVisualCue = ({
    beatCounter,
    bpm,
    beat,
    isRunning,
}: BpmVisualCueProps) => {
    return (
        <div className="flex gap-6 mb-4">
            {Array.from({ length: beatCounter }, (_, i) => (
                <BpmCircle key={i} bpm={bpm} active={isRunning && beat === i} />
            ))}
        </div>
    );
};

export default BpmVisualCue;
