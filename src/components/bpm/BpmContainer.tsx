import { getColorFromRange } from "@/lib/utils";
import { SoundId, SubdivisionMode, TimeSignature } from "@/types/types";
import { getTimeSignatureConfig, maxBpm, minBpm } from "../constants";
import { useResolvedTheme } from "../ui/useResolvedTheme";
import { DisplaySettings } from "./DisplaySettings";
import { PresetsSettings } from "./PresetsSettings";
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
        subdivisionMode,
        showNumbers,
        countInEnabled,
        timeSignature,
        volume,
        soundOption,
        soundId,
    } = settings;
    const meter = getTimeSignatureConfig(timeSignature, subdivisionMode);
    const resolvedTheme = useResolvedTheme();
    const { beat, isRunning, countdown, isCountingIn, toggle, previewSound } =
        useMetronomeScheduler({
            bpm,
            bpmRampEnabled,
            bpmRampBars,
            bpmRampAmount,
            beatsPerBar: meter.beatsPerBar,
            subdivisionsPerBeat: meter.subdivisionsPerBeat,
            compoundMeter: meter.compound,
            countInEnabled,
            volume,
            soundOption,
            soundId,
            onBpmChange: (nextBpm) => updateSettings({ bpm: nextBpm }),
        });

    const updateTimingSettings = (updates: {
        bpm?: number;
        subdivisionMode?: SubdivisionMode;
        showNumbers?: boolean;
        countInEnabled?: boolean;
        timeSignature?: TimeSignature;
    }) => {
        updateSettings(updates);
    };

    const isPlaybackActive = isRunning || isCountingIn;

    //#endregion

    //#region Derived values
    const subdivisionsPerBeat = meter.subdivisionsPerBeat;
    const color = getColorFromRange(bpm, minBpm, maxBpm, resolvedTheme);
    //#endregion

    //#region Functions
    //#endregion

    //#region Render
    return (
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4">
            <TempoControls
                bpm={bpm}
                beatCounter={meter.beatsPerBar}
                beat={beat}
                isRunning={isRunning}
                isCountingIn={isCountingIn}
                isPlaybackActive={isPlaybackActive}
                subdivisionsPerBeat={subdivisionsPerBeat}
                compoundMeter={meter.compound}
                showNumbers={showNumbers}
                countdown={countdown}
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
                    soundId={soundId}
                    isPlaybackActive={isPlaybackActive}
                    onVolumeChange={(nextVolume) =>
                        updateSettings({ volume: nextVolume })
                    }
                    onSoundOptionChange={(nextSoundOption) =>
                        updateSettings({ soundOption: nextSoundOption })
                    }
                    onSoundIdChange={(nextSoundId: SoundId) =>
                        updateSettings({ soundId: nextSoundId })
                    }
                    onPreviewSound={previewSound}
                />
                <div
                    aria-hidden="true"
                    className="h-px w-full bg-border sm:hidden"
                />
                <RhythmSettings
                    timeSignature={timeSignature}
                    compoundMeter={meter.compound}
                    subdivisionMode={subdivisionMode}
                    isPlaybackActive={isPlaybackActive}
                    onTimeSignatureChange={(nextTimeSignature) =>
                        updateTimingSettings({
                            timeSignature: nextTimeSignature,
                        })
                    }
                    onSubdivisionModeChange={(mode) =>
                        updateTimingSettings({ subdivisionMode: mode })
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
                <DisplaySettings
                    showNumbers={showNumbers}
                    countInEnabled={countInEnabled}
                    onNumbersChange={(checked) =>
                        updateTimingSettings({ showNumbers: checked })
                    }
                    onCountInChange={(checked) =>
                        updateTimingSettings({ countInEnabled: checked })
                    }
                />
                <div
                    aria-hidden="true"
                    className="h-px w-full bg-border sm:col-span-full sm:row-start-4"
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
            <PresetsSettings
                settings={settings}
                isPlaybackActive={isPlaybackActive}
                onApplyPreset={(presetSettings) =>
                    updateSettings(presetSettings)
                }
            />
        </div>
    );
    //#endregion
};

export default BpmContainer;
