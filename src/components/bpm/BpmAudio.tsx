import { useEffect, useRef } from "react";

interface BpmAudioProps {
    muted: boolean;
    beat: number;
}
const BpmAudio = ({ muted, beat }: BpmAudioProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = muted ? 0 : 1;
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    }, [beat, muted]);

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
