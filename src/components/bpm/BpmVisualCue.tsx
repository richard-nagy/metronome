import BpmCircle from "./BpmCircle";

interface BpmVisualCueProps {
    beatCounter: number;
    bpm: number;
    beat: number | undefined;
    isRunning: boolean;
    subdivisionsPerBeat: number;
    compoundMeter: boolean;
    showNumbers: boolean;
    countdown: number | null;
    color: string;
}
const BpmVisualCue = ({
    beatCounter,
    bpm,
    beat,
    isRunning,
    subdivisionsPerBeat,
    compoundMeter,
    showNumbers,
    countdown,
    color,
}: BpmVisualCueProps) => {
    return (
        <div className="relative mt-2 flex h-40 w-full max-w-80 flex-col items-center justify-center gap-2">
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
                                    className="relative flex size-15 shrink-0 items-center justify-center min-[360px]:size-16 sm:size-18"
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
                                            beat !== undefined &&
                                            Math.floor(
                                                beat / subdivisionsPerBeat,
                                            ) === i
                                        }
                                        subdivision={false}
                                        mainCircleSizeClass="size-11 border-2 min-[360px]:size-12 sm:size-13"
                                        compoundPulse={compoundMeter}
                                        visible
                                    />
                                    {subdivisionsPerBeat > 1 && (
                                        <div
                                            className="absolute top-1/2 flex -translate-y-1/2 flex-col gap-1"
                                            style={{ left: "calc(100% - 2px)" }}
                                        >
                                            {Array.from(
                                                {
                                                    length:
                                                        subdivisionsPerBeat - 1,
                                                },
                                                (_, subdivisionIndex) => {
                                                    const tickWithinBeat =
                                                        subdivisionIndex + 1;
                                                    const tickIndex =
                                                        i *
                                                            subdivisionsPerBeat +
                                                        tickWithinBeat;

                                                    return (
                                                        <BpmCircle
                                                            key={tickWithinBeat}
                                                            text=""
                                                            bpm={
                                                                bpm *
                                                                subdivisionsPerBeat
                                                            }
                                                            color={color}
                                                            first={false}
                                                            active={
                                                                isRunning &&
                                                                beat ===
                                                                    tickIndex
                                                            }
                                                            subdivision
                                                            subdivisionSizeClass="size-3"
                                                            visible
                                                        />
                                                    );
                                                },
                                            )}
                                        </div>
                                    )}
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
                        className="pointer-events-none absolute left-1/2 top-1/2 z-10 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/90"
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
