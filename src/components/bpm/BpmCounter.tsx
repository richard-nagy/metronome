import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

const msPerMinute = 60000;
const beatCounter = 4;

interface BpmCounterProps {
    color: string;
    bpm: number;
    isRunning: boolean;
    currentBeat: number;
    setIsRunning: (isRunning: boolean) => void;
    setCurrentBeat: (beat: number) => void;
}
const BpmCounter = ({
    color,
    bpm,
    isRunning,
    currentBeat: parentCurrentBeat,
    setIsRunning,
    setCurrentBeat,
}: BpmCounterProps) => {
    const [muted, setMuted] = useState(false);
    const [currentBeat, setLocalCurrentBeat] = useState(parentCurrentBeat);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        setLocalCurrentBeat(parentCurrentBeat);
    }, [parentCurrentBeat]);

    useEffect(() => {
        setCurrentBeat(currentBeat);
    }, [currentBeat, setCurrentBeat]);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setLocalCurrentBeat((prev) => (prev + 1) % beatCounter);
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

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = muted ? 0 : 1;
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    }, [currentBeat, muted]);

    return (
        <div className="flex flex-col items-center gap-4">
            <audio
                ref={audioRef}
                src="/buttonclick.wav"
                preload="auto"
                className="hidden"
            />
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
                        setLocalCurrentBeat(0);
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
                <Button
                    onClick={() => setLocalCurrentBeat(0)}
                    disabled={isRunning}
                >
                    Reset
                </Button>
                <Button onClick={() => setMuted((m) => !m)}>
                    {muted ? "Unmute" : "Mute"}
                </Button>
            </div>
        </div>
    );
};

export default BpmCounter;
