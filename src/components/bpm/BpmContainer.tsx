import { getColorFromRange } from "@/lib/utils";
import { maxBpm, minBpm } from "../constants";
import { useResolvedTheme } from "../ui/useResolvedTheme";
import { RhythmSettings } from "./RhythmSettings";
import { SoundSettings } from "./SoundSettings";
import { TempoControls } from "./TempoControls";
import { TempoRampSettings } from "./TempoRampSettings";
import { useMetronomeScheduler } from "./useMetronomeScheduler";
import { useMetronomeSettings } from "./useMetronomeSettings";

const BpmContainer = () => {
    //#region State
    const { settings, updateSettings } = useMetronomeSettings();
    const {
        bpm,
        bpmRampEnabled,
        bpmRampBars,
        bpmRampAmount,
        showSubdivisions,
        showNumbers,
        countInEnabled,
        beatCounter,
        volume,
        soundOption,
    } = settings;
    const resolvedTheme = useResolvedTheme();
    const { beat, isRunning, countdown, isCountingIn, toggle } =
        useMetronomeScheduler({
            bpm,
            bpmRampEnabled,
            bpmRampBars,
            bpmRampAmount,
            beatsPerBar: beatCounter,
            showSubdivisions,
            countInEnabled,
            volume,
            soundOption,
            onBpmChange: (nextBpm) => updateSettings({ bpm: nextBpm }),
        });

    const updateTimingSettings = (updates: {
        bpm?: number;
        showSubdivisions?: boolean;
        showNumbers?: boolean;
        countInEnabled?: boolean;
        beatCounter?: number;
    }) => {
        updateSettings(updates);
    };

    const isPlaybackActive = isRunning || isCountingIn;

    //#endregion

    //#region Derived values
    const tickRate = bpm * (showSubdivisions ? 2 : 1);
    const color = getColorFromRange(bpm, minBpm, maxBpm, resolvedTheme);
    //#endregion

    //#region Functions
    //#endregion

    //#region Render
    return (
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4">
            <TempoControls
                bpm={bpm}
                beatCounter={beatCounter}
                beat={beat}
                isRunning={isRunning}
                isCountingIn={isCountingIn}
                isPlaybackActive={isPlaybackActive}
                showSubdivisions={showSubdivisions}
                showNumbers={showNumbers}
                countdown={countdown}
                tickRate={tickRate}
                color={color}
                onBpmChange={(nextBpm) =>
                    updateTimingSettings({ bpm: nextBpm })
                }
                onToggle={toggle}
            />
            <div className="grid w-full grid-cols-1 gap-x-8 gap-y-6 border-t pt-5 sm:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)]">
                <SoundSettings
                    volume={volume}
                    soundOption={soundOption}
                    onVolumeChange={(nextVolume) =>
                        updateSettings({ volume: nextVolume })
                    }
                    onSoundOptionChange={(nextSoundOption) =>
                        updateSettings({ soundOption: nextSoundOption })
                    }
                />
                <div
                    aria-hidden="true"
                    className="h-px w-full bg-border sm:hidden"
                />
                <RhythmSettings
                    beatCounter={beatCounter}
                    showSubdivisions={showSubdivisions}
                    showNumbers={showNumbers}
                    countInEnabled={countInEnabled}
                    isPlaybackActive={isPlaybackActive}
                    onBeatCounterChange={(nextBeatCounter) =>
                        updateTimingSettings({ beatCounter: nextBeatCounter })
                    }
                    onSubdivisionsChange={(checked) =>
                        updateTimingSettings({ showSubdivisions: checked })
                    }
                    onNumbersChange={(checked) =>
                        updateTimingSettings({ showNumbers: checked })
                    }
                    onCountInChange={(checked) =>
                        updateTimingSettings({ countInEnabled: checked })
                    }
                />
                <div
                    aria-hidden="true"
                    className="hidden bg-border sm:col-start-2 sm:row-start-1 sm:block"
                />
                <div
                    aria-hidden="true"
                    className="h-px w-full bg-border sm:col-span-full sm:row-start-2"
                />
                <TempoRampSettings
                    enabled={bpmRampEnabled}
                    bars={bpmRampBars}
                    amount={bpmRampAmount}
                    isPlaybackActive={isPlaybackActive}
                    onEnabledChange={(enabled) =>
                        updateSettings({ bpmRampEnabled: enabled })
                    }
                    onBarsChange={(bars) =>
                        updateSettings({ bpmRampBars: bars })
                    }
                    onAmountChange={(amount) =>
                        updateSettings({ bpmRampAmount: amount })
                    }
                />
            </div>
        </div>
    );
    //#endregion
};

export default BpmContainer;
