import { cn } from "@/helpers/utils";
import { useEffect, useMemo, useState } from "react";
import { msPerSecond, sPerMinute } from "../constants";

interface BpmCircleProps {
    active: boolean;
    bpm: number;
}

export default function BpmCircle({ active, bpm }: BpmCircleProps) {
    const [pulse, setPulse] = useState(false);

    // Half a beat in seconds
    const pulseInterval = useMemo(() => sPerMinute / bpm / 2, [bpm]);

    useEffect(() => {
        if (active) {
            setPulse(true);
            const timeout = setTimeout(
                () => setPulse(false),
                pulseInterval * msPerSecond, // Half a beat duration in milliseconds
            );
            return () => clearTimeout(timeout);
        } else {
            setPulse(false);
        }
    }, [bpm, pulseInterval, active]);

    return (
        <div
            className={cn(
                "w-12 h-12 rounded-full border-2 border-foreground",
                `${active ? "bg-foreground" : "bg-transparent"}`,
                pulse ? "pulsate-bck" : "",
                !active ? "paused" : "",
            )}
            style={
                {
                    "--pulse-duration": `${pulseInterval}s`,
                } as React.CSSProperties & Record<string, string>
            }
        />
    );
}
