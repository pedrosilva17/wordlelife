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
	}
});

const cellClasses = 'min-w-16 relative py-2 px-4 rounded-md justify-center items-center';

function isClose(diff: number, boundary: number = 0) {
	return Math.abs(diff) <= boundary;
}

function computeColor(diff: number, boundary: number | undefined = undefined) {
	return diff === 0 ? 'bg-green-500' : isClose(diff, boundary) ? 'bg-yellow-500' : 'bg-red-500';
}

function computeIcon(diff: number, isBinary: boolean) {
	if (isBinary) return diff === 0 ? 'i-mdi-check-bold' : 'i-mdi-minus-thick';
	else
		return diff === 0
			? 'i-mdi-check-bold'
			: diff < 0
				? 'i-mdi-arrow-up-bold'
				: 'i-mdi-arrow-down-bold';
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
			if (input !== target) diff < 0 ? (diff -= 1) : (diff += 1);
			return {
				color: computeColor(diff, boundary),
				icon: computeIcon(diff, false)
			};
		}
		case DiffType.Binary: {
			return {
				color: computeColor(+(input !== target)),
				icon: computeIcon(+(input !== target), true)
			};
		}
		case DiffType.Numeric: {
			input = input.replaceAll(/[a-zA-Z]/g, '').trim();
			target = target.replaceAll(/[a-zA-Z]/g, '').trim();
			diff = parseInt(input) - parseInt(target);
			return {
				color: computeColor(diff, boundary),
				icon: computeIcon(diff, false)
			};
		}
		default: {
			return {
				color: 'bg-gray-500',
				icon: 'i-mdi-help'
			};
		}
	}
}

const comparison: {
	color: string;
	icon: string;
} = computeDifference(
	guess[column.key as keyof Wrestler].toString(),
	answer[column.key as keyof Wrestler].toString(),
	column.diffType,
	column.diffBoundary
);
</script>

<template>
	<th scope="row" v-if="column.key === 'name'" :class="`${cellClasses} ${comparison.color}`">
		{{ guess[(column.displayKey ?? column.key) as keyof Wrestler] }}
		<UIcon :name="comparison.icon" class="absolute top-1 right-1" />
	</th>
	<td v-else :class="`${cellClasses} ${comparison.color}`">
		{{ guess[(column.displayKey ?? column.key) as keyof Wrestler] }}
		<UIcon :name="comparison.icon" class="absolute top-1 right-1" />
	</td>
</template>
~/types/wrestler~/utils/utils
