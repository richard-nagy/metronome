import { getColorFromRange } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    defaultBeatCounter,
    defaultBpm,
    maxBpm,
    minBpm,
    msPerMinute,
} from "../constants";
import { useResolvedTheme } from "../ui/useResolvedTheme";
import BpmControls from "./BpmControls";
import BpmVisualCue from "./BpmVisualCue";

const BpmContainer = () => {
    const [bpm, setBpm] = useState(defaultBpm);
    const [isRunning, setIsRunning] = useState(false);
    const [beat, setBeat] = useState<number | undefined>(undefined);
    const [showDownBeats, setShowDownBeats] = useState(false);
    const [beatCounter, setBeatCounter] = useState(defaultBeatCounter);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const resolvedTheme = useResolvedTheme();

    const currentBeatCounter = useMemo(
        () => beatCounter * (showDownBeats ? 2 : 1),
        [beatCounter, showDownBeats],
    );

    const speed = useMemo(
        () => bpm * (showDownBeats ? 2 : 1),
        [bpm, showDownBeats],
    );

    const color = useMemo(
        () => getColorFromRange(bpm, minBpm, maxBpm, resolvedTheme),
        [bpm, resolvedTheme],
    );

    const onButtonChange = useCallback((value: number) => {
        setBpm((oldBpm) => {
            const result = oldBpm + value;
            if (result <= minBpm) {
                return minBpm;
            } else if (result >= maxBpm) {
                return maxBpm;
            }
            return result;
        });
    }, []);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setBeat((prev) =>
                    prev !== undefined ? (prev + 1) % currentBeatCounter : 0,
                );
            }, msPerMinute / speed);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, speed, currentBeatCounter]);

    useEffect(() => {
        if (showDownBeats) {
            setBeat((prev) => (prev !== undefined ? prev * 2 : 0));
        } else {
            setBeat((prev) => (prev !== undefined ? Math.floor(prev / 2) : 0));
        }
    }, [showDownBeats]);

    return (
        <div className="flex flex-col items-center gap-5">
            <h1 className="mb-3 text-center tracking-tight text-balance">
                <span style={{ color }} className="font-bold text-4xl">
                    {bpm}{" "}
                </span>
                <span className="font-light text-secondary-foreground text-3xl">
                    BPM
                </span>
            </h1>
            <BpmVisualCue
                beatCounter={currentBeatCounter}
                bpm={speed}
                beat={beat}
                isRunning={isRunning}
                showDownBeats={showDownBeats}
                color={color}
            />
            <BpmControls
                beat={beat}
                bpm={bpm}
                color={color}
                beatCounter={beatCounter}
                isRunning={isRunning}
                showDownBeats={showDownBeats}
                onButtonChange={onButtonChange}
                setBeatCounter={setBeatCounter}
                setIsRunning={setIsRunning}
                setBeat={setBeat}
                setBpm={setBpm}
                setShowDownBeats={setShowDownBeats}
            />
        </div>
    );
};

export default BpmContainer;
