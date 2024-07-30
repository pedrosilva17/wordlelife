<script setup lang="ts">
import type { GameOption } from '~/interfaces/gameoption';

const { options } = defineProps({
	options: {
		type: Array as PropType<GameOption[]>,
		required: true
	}
});

async function search(q: string) {
	q = q.toLowerCase();
	return options.filter(
		(opt: GameOption) => opt.name.toLowerCase().includes(q) || opt.icon.includes(q)
	);
}

const selected = defineModel();
</script>

<template>
	<UInputMenu
		color="primary"
		variant="outline"
		v-model="selected"
		placeholder="Choose a wrestler!"
		:options="options"
		option-attribute="name"
		:search="search"
		:search-attributes="['name', 'icon']"
		:searchLazy="true"
		:debounce="500"
		trailing
		required
	>
		<template #option="{ option: wrestler }">
			<span class="flex flex-row gap-2">
				<NuxtImg
					:src="`/images/${wrestler.icon}.png`"
					:alt="`${wrestler.icon} company logo`"
					class="object-cover w-8 h-5"
				/>
				<p class="flex my-auto items-center">
					{{ wrestler.name }}
				</p>
			</span>
		</template>
	</UInputMenu>
</template>
