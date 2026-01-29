import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { msPerSecond, sPerMinute } from "../constants";

interface BpmCircleProps {
    color: string;
    first: boolean;
    active: boolean;
    bpm: number;
    downBeat: boolean;
}

export default function BpmCircle({
    color,
    first,
    active,
    bpm,
    downBeat,
}: BpmCircleProps) {
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
                "w-14 h-14 rounded-full border-2",
                !first && active
                    ? "bg-foreground"
                    : !first
                      ? "bg-foreground/5"
                      : undefined,
                !first && "border-foreground",
                downBeat ? "border-dashed" : "",
                pulse ? "pulsate-bck" : "",
                !active ? "paused" : "",
            )}
            style={
                {
                    ...(first
                        ? {
                              borderColor: color,
                              backgroundColor: active ? color : undefined,
                          }
                        : {}),
                    "--pulse-duration": `${pulseInterval}s`,
                } as React.CSSProperties & Record<string, string>
            }
        />
    );
}
