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

const scrollContainer = ref<HTMLDivElement | null>(null);
const scrollToBottom = () => {
	if (scrollContainer.value) {
		scrollContainer.value.scrollTo({
			top: scrollContainer.value.scrollHeight,
			behavior: 'smooth'
		});
	}
};

defineExpose({ scrollToBottom });
</script>

<template>
	<template v-if="guesses.length === 0">
		<p>Good luck!</p>
	</template>
	<template v-else>
		<div class="flex flex-col container max-h-[50vh]">
			<div class="grid w-full gap-3 grid-cols-game overflow-x-auto">
				<div v-for="column in columns" :key="column.key" class="border-b">
					{{ column.label }}
				</div>
				<div
					ref="scrollContainer"
					class="col-span-full grid grid-cols-subgrid gap-y-3 overflow-y-auto"
				>
					<template v-for="guess in guesses" :key="guess.id">
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
			</div>
		</div>
	</template>
</template>
~/utils/utils
