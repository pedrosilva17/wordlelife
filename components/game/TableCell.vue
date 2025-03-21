<script setup lang="ts">
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import type { PropType } from 'vue';
import type { Wrestler } from '~/interfaces/wrestler';
import { DiffType, useImperialUnits, useHardMode } from '@/utils/utils';
import { computed } from 'vue';
import type { GuessColumn } from '@/interfaces/guesscolumn';

const { column, guess, answer } = defineProps({
	column: {
		type: Object as PropType<GuessColumn>,
		required: true
	},
	guess: {
		type: Object as PropType<Wrestler>,
		required: true
	},
	answer: {
		type: Object as PropType<Wrestler>,
		required: true
	},
	animationDelay: {
		type: Number,
		required: true
	}
});

function isClose(diff: number, boundary: number = 0) {
	return Math.abs(diff) <= boundary;
}

function computeColor(diff: number, boundary: number | undefined = undefined) {
	return diff === 0 ? 'bg-green-500' : isClose(diff, boundary) ? 'bg-yellow-500' : 'bg-red-500';
}

function computeIcon(diff: number, isBinary: boolean) {
	if (isBinary) return diff === 0 ? 'i-mdi-check-thick' : 'i-mdi-close-thick';
	return diff === 0
		? 'i-mdi-check-thick'
		: diff < 0
			? 'i-mdi-arrow-up-thick'
			: 'i-mdi-arrow-down-thick';
}

function computeDirectionalIcon(latDiff: number, lonDiff: number) {
	if (latDiff === 0 && lonDiff === 0) return 'i-mdi-check-thick';
	if (Math.abs(latDiff) > 3 * Math.abs(lonDiff)) {
		return latDiff > 0 ? 'i-mdi-arrow-up-thick' : 'i-mdi-arrow-down-thick';
	} else if (Math.abs(lonDiff) > 3 * Math.abs(latDiff)) {
		return lonDiff > 0 ? 'i-mdi-arrow-right-thick' : 'i-mdi-arrow-left-thick';
	} else {
		if (latDiff > 0 && lonDiff > 0) {
			return 'i-mdi-arrow-top-right-thick';
		} else if (latDiff > 0 && lonDiff < 0) {
			return 'i-mdi-arrow-top-left-thick';
		} else if (latDiff < 0 && lonDiff > 0) {
			return 'i-mdi-arrow-bottom-right-thick';
		} else {
			return 'i-mdi-arrow-bottom-left-thick';
		}
	}
}

function computeDiffInfo(
	diff: number,
	unit: string | undefined = undefined,
	boundary: number | undefined = undefined
) {
	if (diff === 0) return 'Correct!';
	if (useHardMode.value && column.key === 'name') return 'Wrong.';
	const displayBoundary = computed(() => {
		if (!boundary) return boundary;
		switch (column.key) {
			case 'birth_place':
				return useImperialUnits.value ? Math.round(boundary * 0.621371) : boundary; // km to miles
			case 'height_cm':
				return useImperialUnits.value ? Math.round(boundary * 0.393701) : boundary; // cm to inches
			case 'weight_kg':
				return useImperialUnits.value ? Math.round(boundary * 2.20462) : boundary; // kg to lbs
			default:
				return boundary;
		}
	});

	return computed(() =>
		!boundary
			? 'Wrong.'
			: isClose(diff, boundary)
				? `This is at most ${displayBoundary.value} ${unit} away from the answer.`
				: `This is more than ${displayBoundary.value} ${unit} away from the answer.`
	);
}

function getDelta(coord1: number, coord2: number) {
	return toRadians(coord1 - coord2);
}

function haversineDistance(point1: [number, number], point2: [number, number]) {
	const earthRadiusKm = 6371;
	const deltaLatitude = getDelta(point2[0], point1[0]);
	const deltaLongitude = getDelta(point2[1], point1[1]);
	const a =
		Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
		Math.cos(toRadians(point1[0])) *
			Math.cos(toRadians(point2[0])) *
			Math.sin(deltaLongitude / 2) *
			Math.sin(deltaLongitude / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return earthRadiusKm * c;
}

function computeDifference(
	input: string,
	target: string,
	type: DiffType,
	boundary: number | undefined,
	isImperialUnit: boolean
) {
	let diff = 0;
	switch (type) {
		case DiffType.Alphabetical: {
			input = input.replaceAll(/[^a-zA-Z]/g, '');
			target = target.replaceAll(/[^a-zA-Z]/g, '');
			diff = target.charCodeAt(0) - input.charCodeAt(0);
			if (input !== target && diff == 0) target < input ? (diff -= 1) : (diff += 1);
			return {
				color: computeColor(diff, useHardMode.value ? 0 : boundary),
				icon: computeIcon(diff, useHardMode.value),
				infoText: computeDiffInfo(diff, 'positions in the alphabet', boundary)
			};
		}
		case DiffType.Binary: {
			diff = +(input !== target);
			return {
				color: computeColor(diff),
				icon: computeIcon(diff, true),
				infoText: computeDiffInfo(diff)
			};
		}
		case DiffType.Coords: {
			const inputPoint: [number, number] = [guess.latitude, guess.longitude];
			const targetPoint: [number, number] = [answer.latitude, answer.longitude];
			diff = haversineDistance(targetPoint, inputPoint);
			return {
				color: computeColor(diff, 1000),
				icon: computeDirectionalIcon(
					getDelta(targetPoint[0], inputPoint[0]),
					getDelta(targetPoint[1], inputPoint[1])
				),
				infoText: computeDiffInfo(diff, isImperialUnit ? 'mi' : 'kms', boundary)
			};
		}
		case DiffType.Numeric: {
			input = input.replaceAll(/[a-zA-Z]/g, '').trim();
			target = target.replaceAll(/[a-zA-Z]/g, '').trim();
			diff = parseInt(input) - parseInt(target);
			let unit = 'units';
			switch (column.key) {
				case 'age': {
					unit = 'years';
					break;
				}
				case 'height_cm': {
					unit = isImperialUnit ? 'in' : 'cm';
					break;
				}
				case 'weight_kg': {
					unit = isImperialUnit ? 'lbs' : 'kg';
					break;
				}
			}
			return {
				color: computeColor(diff, boundary),
				icon: computeIcon(diff, false),
				infoText: computeDiffInfo(diff, unit, boundary)
			};
		}
	}
}

const comparison: ComputedRef<{
	color: string;
	icon: string;
	infoText: string | ComputedRef<string>;
}> = computed(() => {
	const isImperial = useImperialUnits.value;

	return computeDifference(
		guess[column.key as keyof Wrestler].toString(),
		answer[column.key as keyof Wrestler].toString(),
		column.diffType,
		// Proximity calculations are done using metric units, for simplicity. imperial units are used for display purposes if wanted by the user.
		column.diffBoundary,
		isImperial
	);
});

const open = ref(false);
</script>

<template>
	<UPopover mode="hover" v-model:open="open" class="min-w-20">
		<Transition name="fade" :style="`transition-delay: ${animationDelay}ms`" appear>
			<button
				:class="`transition-opacity flex flex-col ${guess[(column.displayKey ?? column.key) as keyof Wrestler].toString().length > 30 ? 'text-sm' : 'text-base'} w-full relative p-4 rounded-md h-28 justify-center items-center drop-shadow-lg text-gray-950 ${comparison.color}`"
				type="button"
				@click="open = !open"
			>
				<template v-if="column.key === 'promotion'">
					<NuxtImg
						:title="guess['promotion']"
						:src="`/images/${guess['promotion'].toLowerCase()}.png`"
						:alt="`${guess['promotion']} company logo`"
						width="100px"
					/>
				</template>
				<template v-else>
					{{
						column.displayKey?.includes('height') && useImperialUnits === true
							? guess['height_ft']
							: column.displayKey?.includes('weight') && useImperialUnits === true
								? guess['weight_lbs']
								: guess[(column.displayKey ?? column.key) as keyof Wrestler]
					}}
				</template>
				<span v-if="column.key === 'birth_place'">{{ getUnicodeFlagIcon(guess.cc) }}</span>
				<UIcon :name="comparison.icon" class="absolute top-1 right-1" />
			</button>
		</Transition>
		<template #panel>
			<div class="p-4">{{ comparison.infoText }}</div>
		</template>
	</UPopover>
</template>
~/types/wrestler~/utils/utils
