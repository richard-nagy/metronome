import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

const msPerMinute = 60000;
const beatCounter = 4;

interface BeatCounterProps {
    color: string;
    bpm: number;
}
const BeatCounter = ({ color, bpm }: BeatCounterProps) => {
    const [isRunning, setIsRunning] = useState(false);
    const [currentBeat, setCurrentBeat] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setCurrentBeat((prev) => (prev + 1) % beatCounter);
            }, msPerMinute / bpm);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, bpm]);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-6 mb-4">
                {Array.from({ length: beatCounter }, (_, i) => (
                    <div
                        key={i}
                        className="w-12 h-12 rounded-full border-2"
                        style={{
                            borderColor: color,
                            background:
                                currentBeat === i ? color : "transparent",
                        }}
                    />
                ))}
            </div>
            <div className="flex flex-row gap-3 mt-3">
                <Button
                    onClick={() => {
                        setCurrentBeat(0);
                        setIsRunning(true);
                    }}
                    disabled={isRunning}
                >
                    Start
                </Button>
                <Button
                    onClick={() => setIsRunning(false)}
                    disabled={!isRunning}
                >
                    Stop
                </Button>
                <Button onClick={() => setCurrentBeat(0)} disabled={isRunning}>
                    Reset
                </Button>
            </div>
        </div>
    );
};

export default BeatCounter;
