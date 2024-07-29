<script setup lang="ts">
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import type { PropType } from 'vue';
import type { Wrestler } from '~/interfaces/wrestler';
import { DiffType, type GuessColumn } from '@/utils/utils';

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

function enter(el: Element, done: Function) {
	done();
}

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
	return !boundary
		? 'Wrong.'
		: isClose(diff, boundary)
			? `This is at most ${boundary} ${unit}s away from the answer.`
			: `This is more than ${boundary} ${unit}s away from the answer.`;
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
	boundary: number | undefined
) {
	let diff = 0;
	switch (type) {
		case DiffType.Alphabetical: {
			input = input.replaceAll(/[^a-zA-Z]/g, '');
			target = target.replaceAll(/[^a-zA-Z]/g, '');
			diff = target.charCodeAt(0) - input.charCodeAt(0);
			if (input !== target && diff == 0) target < input ? (diff -= 1) : (diff += 1);
			return {
				color: computeColor(diff, boundary),
				icon: computeIcon(diff, false),
				infoText: computeDiffInfo(diff, 'letter', boundary)
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
				infoText: computeDiffInfo(diff, 'km', boundary)
			};
		}
		case DiffType.Numeric: {
			input = input.replaceAll(/[a-zA-Z]/g, '').trim();
			target = target.replaceAll(/[a-zA-Z]/g, '').trim();
			diff = parseInt(input) - parseInt(target);
			let unit = 'unit';
			switch (column.key) {
				case 'age': {
					unit = 'year';
					break;
				}
				case 'height_cm': {
					unit = 'cm';
					break;
				}
				case 'weight_kg': {
					unit = 'kg';
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

const comparison: {
	color: string;
	icon: string;
	infoText: string;
} = computeDifference(
	guess[column.key as keyof Wrestler].toString(),
	answer[column.key as keyof Wrestler].toString(),
	column.diffType,
	column.diffBoundary
);

const open = ref(false);
</script>

<template>
	<UPopover mode="hover" v-model:open="open" @touchstart="open = !open" class="min-w-20">
		<Transition name="fade" :style="`transition-delay: ${animationDelay}ms`" appear>
			<div
				:class="`transition-opacity flex flex-col ${guess[(column.displayKey ?? column.key) as keyof Wrestler].toString().length > 35 ? 'text-sm' : 'text-md'} w-full relative p-4 rounded-md h-28 justify-center items-center drop-shadow-lg ${comparison.color}`"
			>
				<template v-if="column.key === 'promotion'">
					<NuxtImg
						:title="guess['promotion']"
						:src="`/images/${guess['promotion'].toLowerCase()}.png`"
						width="100px"
					/>
				</template>
				<template v-else>
					{{
						column.displayKey?.includes('height') && imperialUnits === true
							? guess['height_ft']
							: column.displayKey?.includes('weight') && imperialUnits === true
								? guess['weight_lbs']
								: guess[(column.displayKey ?? column.key) as keyof Wrestler]
					}}
				</template>
				<span v-if="column.key === 'birth_place'">{{ getUnicodeFlagIcon(guess.cc) }}</span>
				<UIcon :name="comparison.icon" class="absolute top-1 right-1" />
			</div>
		</Transition>
		<template #panel>
			<div class="p-4">{{ comparison.infoText }}</div>
		</template>
	</UPopover>
</template>
~/types/wrestler~/utils/utils
