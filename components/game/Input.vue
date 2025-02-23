<script setup lang="ts">
import type { ModelRef } from 'vue';
import type { GameOption } from '~/interfaces/gameoption';

function search(q: string) {
	q = q.toLowerCase();
	return options.value?.filter(
		(opt: GameOption) => opt.name.toLowerCase().includes(q) || opt.icon.includes(q)
	);
}

const selected = defineModel();
const options: ModelRef<GameOption[] | undefined> = defineModel('options');
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
				<UIcon
					v-if="wrestler.icon === 'indy'"
					aria="Indy wrestler"
					name="i-mdi-briefcase"
					class="text-black-50 dark:text-white-50 w-8 h-5"
				/>
				<NuxtImg
					v-else
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
