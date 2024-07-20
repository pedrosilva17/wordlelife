export enum DiffType {
	Alphabetical,
	Binary,
	Coords,
	Numeric
}

export interface GuessColumn {
	key: string;
	displayKey?: string;
	suffix?: string;
	label: string;
	diffType: DiffType;
	diffBoundary?: number;
}

export const imperialUnits = ref(false);
export const toRadians = (v: number) => (v * Math.PI) / 180;
