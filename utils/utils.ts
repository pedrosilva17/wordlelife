export enum DiffType {
	Alphabetical,
	Binary,
	Coords,
	Numeric
}

export const imperialUnits = ref(false);

export interface GuessColumn {
	key: string;
	displayKey?: string;
	suffix?: string;
	label: string;
	diffType: DiffType;
	diffBoundary?: number;
}
