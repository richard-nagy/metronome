import BpmCircle from "./BpmCircle";

interface BpmVisualCueProps {
    beatCounter: number;
    bpm: number;
    beat: number | undefined;
    isRunning: boolean;
    showSubdivisions: boolean;
    showNumbers: boolean;
    countdown: number | null;
    color: string;
}
const BpmVisualCue = ({
    beatCounter,
    bpm,
    beat,
    isRunning,
    showSubdivisions,
    showNumbers,
    countdown,
    color,
}: BpmVisualCueProps) => {
    return (
        <div className="relative flex h-40 w-80 flex-col items-center justify-center gap-2">
            {Array.from({ length: Math.ceil(beatCounter / 4) }, (_, row) => {
                const firstBeat = row * 4;
                const beatsInRow = Math.min(4, beatCounter - firstBeat);

                return (
                    <div
                        key={row}
                        className="relative z-10 flex justify-center gap-2"
                    >
                        {Array.from({ length: beatsInRow }, (_, column) => {
                            const i = firstBeat + column;

                            return (
                                <div
                                    key={i}
                                    className="relative flex size-16 items-center justify-center"
                                >
                                    <BpmCircle
                                        text={
                                            showNumbers
                                                ? (i + 1).toString()
                                                : ""
                                        }
                                        bpm={bpm}
                                        color={color}
                                        first={i === 0}
                                        active={
                                            isRunning &&
                                            (showSubdivisions
                                                ? beat === i * 2 ||
                                                  beat === i * 2 + 1
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
                            );
                        })}
                    </div>
                );
            })}
            {countdown !== null && (
                <>
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute left-1/2 top-1/2 z-10 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/90"
                    />
                    <span
                        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center text-7xl font-bold tabular-nums"
                        aria-live="polite"
                        style={{ color }}
                    >
                        {countdown}
                    </span>
                </>
            )}
        </div>
    );
};

export default BpmVisualCue;
