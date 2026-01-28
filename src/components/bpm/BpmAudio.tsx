import { useEffect, useRef } from "react";

interface BpmAudioProps {
    beat: number | undefined;
    volume: number;
    soundOnFirstBeat: boolean;
}
const BpmAudio = ({ beat, volume, soundOnFirstBeat }: BpmAudioProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current && beat !== undefined) {
            if (soundOnFirstBeat && beat !== 0) {
                return;
            }
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    }, [beat, soundOnFirstBeat]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.muted = volume === 0;
        }
    }, [volume]);

    return (
        <audio
            ref={audioRef}
            src="/buttonclick.wav"
            preload="auto"
            className="hidden"
        />
    );
};

export default BpmAudio;
