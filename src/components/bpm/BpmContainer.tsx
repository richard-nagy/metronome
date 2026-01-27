import { getColorFromRange } from "@/helpers/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    beatCounter,
    defaultBpm,
    maxBpm,
    minBpm,
    msPerMinute,
} from "../constants";
import BpmAudio from "./BpmAudio";
import BpmControls from "./BpmControls";
import BpmSlider from "./BpmSlider";
import BpmVisualCue from "./BpmVisualCue";

const BpmContainer = () => {
    const [muted, setMuted] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [bpm, setBpm] = useState(defaultBpm);
    const [isRunning, setIsRunning] = useState(false);
    const [beat, setBeat] = useState(0);

    const color = useMemo(() => getColorFromRange(bpm, minBpm, maxBpm), [bpm]);

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

    const onInputChange = useCallback((value: number) => {
        setBpm(value);
    }, []);

    const onInputBlur = useCallback(() => {
        setBpm((oldBpm) => {
            if (oldBpm <= minBpm) {
                return minBpm;
            } else if (oldBpm >= maxBpm) {
                return maxBpm;
            }
            return oldBpm;
        });
    }, []);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setBeat((prev) => (prev + 1) % beatCounter);
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
            <BpmVisualCue
                beatCounter={beatCounter}
                bpm={bpm}
                color={color}
                beat={beat}
                isRunning={isRunning}
            />
            <BpmSlider
                bpm={bpm}
                color={color}
                onChange={setBpm}
                onDoubleClick={() => setBpm(defaultBpm)}
            />
            <BpmControls
                bpm={bpm}
                color={color}
                isRunning={isRunning}
                muted={muted}
                onButtonChange={onButtonChange}
                onInputChange={onInputChange}
                onInputBlur={onInputBlur}
                setBeat={setBeat}
                setIsRunning={setIsRunning}
                setMuted={setMuted}
            />
            <BpmAudio beat={beat} muted={muted} />
        </div>
    );
};

export default BpmContainer;
