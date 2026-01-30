import { SoundOption } from "@/types/types";
import { useEffect, useRef } from "react";

interface BpmAudioProps {
    beat: number | undefined;
    volume: number;
    soundOption: SoundOption;
    showDownBeats: boolean;
}
const BpmAudio = ({
    beat,
    volume,
    soundOption,
    showDownBeats,
}: BpmAudioProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playAudioFromStart = () => {
        if (audioRef?.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    };

    useEffect(() => {
        if (beat !== undefined) {
            switch (soundOption) {
                case SoundOption.All:
                    playAudioFromStart();
                    break;
                case SoundOption.First:
                    if (beat === 0) {
                        playAudioFromStart();
                        break;
                    }
                    break;
                case SoundOption.Full:
                    if (showDownBeats && beat % 2 === 0) {
                        playAudioFromStart();
                    } else {
                        playAudioFromStart();
                    }
                    break;
                default:
                    break;
            }
        }
    }, [beat, showDownBeats, soundOption]);

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
