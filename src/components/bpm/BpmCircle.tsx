import { cn } from "@/lib/utils";
import { useEffect, useState, type CSSProperties } from "react";
import { msPerSecond, sPerMinute } from "../constants";

interface BpmCircleProps {
    text: string;
    color: string;
    first: boolean;
    active: boolean;
    bpm: number;
    subdivision: boolean;
    compoundPulse?: boolean;
    mainCircleSizeClass?: string;
    subdivisionSizeClass?: string;
    visible: boolean;
}

export default function BpmCircle({
    text,
    color,
    first,
    active,
    bpm,
    subdivision,
    compoundPulse = false,
    mainCircleSizeClass = "size-12 border-2",
    subdivisionSizeClass = "size-3",
    visible,
}: BpmCircleProps) {
    const [pulse, setPulse] = useState(false);

    // Half a beat in seconds
    const pulseInterval = sPerMinute / bpm / 2;

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
                subdivision ? subdivisionSizeClass : mainCircleSizeClass,
                "aspect-square shrink-0 flex items-center justify-center rounded-full",
                !subdivision && "text-sm font-semibold",
                !first &&
                    !subdivision &&
                    (active ? "bg-foreground" : "bg-foreground/5"),
                subdivision && "bg-foreground/25",
                !first && !subdivision && "border-foreground",
                !first && active && "text-background",
                compoundPulse && !subdivision && !first && "opacity-60",
                !visible && "invisible",
                pulse
                    ? compoundPulse && !subdivision
                        ? "enchanted-pulse"
                        : "pulsate-bck"
                    : "",
                !active ? "paused" : "",
            )}
            style={
                {
                    ...(first || (compoundPulse && !subdivision)
                        ? {
                              borderColor: color,
                              backgroundColor: active ? color : undefined,
                              color: active ? "var(--background)" : color,
                          }
                        : subdivision && active
                          ? { backgroundColor: color }
                          : {}),
                    "--pulse-duration": `${pulseInterval}s`,
                    "--pulse-color": color,
                } as CSSProperties & Record<string, string>
            }
        >
            {text}
        </div>
    );
}
