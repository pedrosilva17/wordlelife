export enum DiffType {
	Alphabetical,
	Binary,
	Coords,
	Numeric
}

export const useImperialUnits = ref(true);
export const useHardMode = ref(false);
export const isGameStarted = ref(false);

export function initializeSettings() {
	const imperialUnitsCookie = useCookie<boolean>('imperialUnitsCookie');
	const hardModeCookie = useCookie<boolean>('hardModeCookie');

	if (imperialUnitsCookie.value !== undefined) {
		useImperialUnits.value = imperialUnitsCookie.value;
	}
	if (hardModeCookie.value !== undefined) {
		useHardMode.value = hardModeCookie.value;
	}

	watch(useImperialUnits, (newValue) => {
		imperialUnitsCookie.value = newValue;
	});

	watch(useHardMode, (newValue) => {
		hardModeCookie.value = newValue;
	});
}

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
