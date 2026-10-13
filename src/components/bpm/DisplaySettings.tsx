import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface DisplaySettingsProps {
    showNumbers: boolean;
    countInEnabled: boolean;
    onNumbersChange: (showNumbers: boolean) => void;
    onCountInChange: (countInEnabled: boolean) => void;
}

export function DisplaySettings({
    showNumbers,
    countInEnabled,
    onNumbersChange,
    onCountInChange,
}: DisplaySettingsProps) {
    return (
        <section className="flex flex-col gap-4 sm:col-span-full sm:row-start-3">
            <h2 className="text-sm font-medium">Display</h2>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex min-h-11 items-center justify-between sm:min-h-0">
                    <Label
                        htmlFor="show-numbers"
                        className="flex min-h-11 flex-1 cursor-pointer items-center sm:min-h-0"
                    >
                        Numbers
                    </Label>
                    <Switch
                        id="show-numbers"
                        className="h-6 w-11 sm:h-[1.15rem] sm:w-8"
                        checked={showNumbers}
                        onCheckedChange={onNumbersChange}
                    />
                </div>
                <div className="flex min-h-11 items-center justify-between sm:min-h-0">
                    <Label
                        htmlFor="count-in-enabled"
                        className="flex min-h-11 flex-1 cursor-pointer items-center sm:min-h-0"
                    >
                        Countdown
                    </Label>
                    <Switch
                        id="count-in-enabled"
                        className="h-6 w-11 sm:h-[1.15rem] sm:w-8"
                        checked={countInEnabled}
                        onCheckedChange={onCountInChange}
                    />
                </div>
            </div>
        </section>
    );
}
