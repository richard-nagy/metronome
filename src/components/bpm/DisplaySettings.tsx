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
                <div className="flex items-center justify-between">
                    <Label htmlFor="show-numbers">Numbers</Label>
                    <Switch
                        id="show-numbers"
                        checked={showNumbers}
                        onCheckedChange={onNumbersChange}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="count-in-enabled">Countdown</Label>
                    <Switch
                        id="count-in-enabled"
                        checked={countInEnabled}
                        onCheckedChange={onCountInChange}
                    />
                </div>
            </div>
        </section>
    );
}
