import { useEffect, useRef } from "react";

interface BpmAudioProps {
    beat: number;
    volume: number;
}
const BpmAudio = ({ beat, volume }: BpmAudioProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    }, [beat]);

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
