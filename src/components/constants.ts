import { SubdivisionMode } from "@/types/types";

export const defaultBeatCounter = 4;
export const minBeatCounter = 2;
export const maxBeatCounter = 8;
export const maxBpm = 300;
export const minBpm = 40;
export const defaultBpm = 120;
export const minBpmRampBars = 1;
export const maxBpmRampBars = 100;
export const defaultBpmRampBars = 1;
export const minBpmRampAmount = -50;
export const maxBpmRampAmount = 50;
export const defaultBpmRampAmount = 0;
export const sPerMinute = 60;
export const msPerMinute = 60000;
export const msPerSecond = 1000;

export function getSubdivisionsPerBeat(mode: SubdivisionMode): number {
    switch (mode) {
        case SubdivisionMode.Eighths:
            return 2;
        case SubdivisionMode.Triplets:
            return 3;
        case SubdivisionMode.Sixteenths:
            return 4;
        case SubdivisionMode.Off:
            return 1;
    }
}
