<script setup lang="ts">
import type { Wrestler } from '@/interfaces/wrestler';
import { DiffType, type GuessColumn } from '@/utils/utils';

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

const columns: GuessColumn[] = [
	{
		key: 'name',
		label: 'Name',
		diffType: DiffType.Alphabetical,
		diffBoundary: 4 // differences between ascii code of first letter
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
		diffBoundary: 3
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
		displayKey: imperialUnits.value ? 'height_ft' : 'height_cm',
		label: 'Height',
		diffType: DiffType.Numeric,
		diffBoundary: 10
	},
	{
		key: 'weight_kg',
		displayKey: imperialUnits.value ? 'weight_lbs' : 'weight_kg',
		label: 'Weight',
		diffType: DiffType.Numeric,
		diffBoundary: 15
	},
	{
		key: 'promotion',
		label: 'Promotion',
		diffType: DiffType.Binary
	}
];
</script>

<template>
	<template v-if="guesses.length === 0">
		<p>Good luck!</p>
	</template>
	<template v-else>
		<span
			class="flex flex-col-reverse max-w-xs sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-[90%] max-h-96 overflow-scroll"
		>
			<div class="grid w-full gap-3 grid-cols-game">
				<div v-for="column in columns" class="border-b">{{ column.label }}</div>
				<template v-for="guess in guesses" :key="guess.id" class="flex flex-row">
					<GameTableCell
						v-for="column in columns"
						:key="column.key"
						:column="column"
						:guess="guess"
						:answer="answer"
					/>
				</template>
			</div>
		</span>
	</template>
</template>
~/utils/utils
