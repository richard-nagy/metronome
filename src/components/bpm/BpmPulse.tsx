import { useEffect, useMemo, useState } from "react";

const sPerMinute = 60;
const msPerSecond = 1000;

interface BpmPulseProps {
    isRunning: boolean;
    bpm: number;
    color: string;
    currentBeat: number;
}

export default function BpmPulse({
    isRunning,
    color,
    bpm,
    currentBeat,
}: BpmPulseProps) {
    const [pulse, setPulse] = useState(false);

    // Half a beat in seconds
    const pulseInterval = useMemo(() => sPerMinute / bpm / 2, [bpm]);

    useEffect(() => {
        if (isRunning) {
            setPulse(true);
            const timeout = setTimeout(
                () => setPulse(false),
                pulseInterval * msPerSecond, // Half a beat duration in milliseconds
            );
            return () => clearTimeout(timeout);
        } else {
            setPulse(false);
        }
        // Include currentBeat in dependencies to retrigger effect on beat change
    }, [bpm, isRunning, pulseInterval, currentBeat]);

    return (
        <div
            className={`rounded-full w-24 h-24 flex items-center text-black justify-center text-2xl font-bold ${pulse ? "pulsate-bck" : ""} ${!isRunning ? "paused" : ""}`}
            style={
                {
                    "--pulse-duration": `${pulseInterval}s`,
                    backgroundColor: color,
                } as React.CSSProperties & Record<string, string>
            }
        >
            {isRunning ? currentBeat + 1 : "#"}
        </div>
    );
}
