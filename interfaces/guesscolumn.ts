export interface GuessColumn {
	key: string;
	displayKey?: string;
	suffix?: string;
	label: string;
	diffType: DiffType;
	diffBoundary?: number;
}
