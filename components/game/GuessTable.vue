<script setup lang="ts">
import type { Wrestler } from '@/interfaces/wrestler';
import { DiffType } from '@/utils/utils';
import type { GuessColumn } from '~/interfaces/guesscolumn';

const { guesses, answer } = defineProps({
	guesses: {
		type: Array as PropType<Wrestler[]>,
		required: true
	},
	answer: {
		type: Object as PropType<Wrestler>,
		required: true
	}
});

console.log(answer.height_ft);

const columns: ComputedRef<GuessColumn[]> = computed(() => {
	return [
		{
			key: 'name',
			label: 'Name',
			diffType: DiffType.Alphabetical,
			diffBoundary: 4
		},
		{
			key: 'gender',
			label: 'Gender',
			diffType: DiffType.Binary
		},
		{
			key: 'age',
			label: 'Age',
			diffType: DiffType.Numeric,
			diffBoundary: 5
		},
		{
			key: 'birth_place',
			label: 'Birthplace',
			diffType: DiffType.Coords,
			diffBoundary: 1000 // km
		},
		{
			key: 'billed_from',
			label: 'Billed from',
			diffType: DiffType.Binary
		},
		{
			key: 'height_cm',
			displayKey: 'height_cm',
			label: 'Height',
			diffType: DiffType.Numeric,
			diffBoundary: 10 // cm
		},
		{
			key: 'weight_kg',
			displayKey: 'weight_kg',
			label: 'Weight',
			diffType: DiffType.Numeric,
			diffBoundary: 15 // kg
		},
		{
			key: 'promotion',
			label: 'Promotion',
			diffType: DiffType.Binary
		}
	];
});
</script>

<template>
	<template v-if="guesses.length === 0">
		<p>Good luck!</p>
	</template>
	<template v-else>
		<span
			class="flex flex-col-reverse max-w-xs sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-[90%] max-h-96 overflow-auto"
		>
			<div class="grid w-full gap-3 grid-cols-game">
				<div v-for="column in columns" :key="column.key" class="border-b">
					{{ column.label }}
				</div>
				<template v-for="guess in guesses" :key="guess.id" class="flex flex-row">
					<GameTableCell
						v-for="(column, idx) in columns"
						:key="column.key"
						:column="column"
						:guess="guess"
						:answer="answer"
						:animation-delay="idx * 300"
					/>
				</template>
			</div>
		</span>
	</template>
</template>
~/utils/utils
