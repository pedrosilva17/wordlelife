export enum DiffType {
	Alphabetical,
	Binary,
	Coords,
	Numeric
}

export const imperialUnits = ref(true);
export const toRadians = (v: number) => (v * Math.PI) / 180;
export type Color = 'primary' | 'gray' | 'green' | 'yellow' | 'red';
export const sizeMap = {
	xs: 'w-8',
	sm: 'w-16',
	md: 'w-24',
	lg: 'w-40',
	xl: 'w-64'
};
export type Size = keyof typeof sizeMap;
