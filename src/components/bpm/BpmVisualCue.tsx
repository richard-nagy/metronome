import BpmCircle from "./BpmCircle";

interface BpmVisualCueProps {
    beatCounter: number;
    bpm: number;
    beat: number | undefined;
    isRunning: boolean;
    showSubdivisions: boolean;
    color: string;
}
const BpmVisualCue = ({
    beatCounter,
    bpm,
    beat,
    isRunning,
    showSubdivisions,
    color,
}: BpmVisualCueProps) => {
    return (
        <div
            className="grid h-40 w-80 place-content-center gap-2"
            style={{
                gridTemplateColumns: "repeat(4, 4rem)",
                gridAutoRows: "4rem",
            }}
        >
            {Array.from({ length: beatCounter }, (_, i) => (
                <div
                    key={i}
                    className="relative flex size-16 items-center justify-center"
                >
                    <BpmCircle
                        text={(i + 1).toString()}
                        bpm={bpm}
                        color={color}
                        first={i === 0}
                        active={
                            isRunning &&
                            (showSubdivisions
                                ? beat === i * 2 || beat === i * 2 + 1
                                : beat === i)
                        }
                        subdivision={false}
                        visible
                    />
                    <div className="absolute left-15.5 top-1/2 -translate-y-1/2">
                        <BpmCircle
                            text=""
                            bpm={bpm}
                            color={color}
                            first={false}
                            active={
                                isRunning &&
                                showSubdivisions &&
                                beat === i * 2 + 1
                            }
                            subdivision
                            visible={showSubdivisions}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BpmVisualCue;
