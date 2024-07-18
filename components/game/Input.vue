<script setup lang="ts">
const { options } = defineProps({
	options: {
		type: Array as PropType<string[]>,
		required: true
	}
});

const selected = defineModel();
</script>

<template>
	<UInputMenu color="primary" variant="outline" v-model="selected" placeholder="Choose a wrestler!" :options="options" required/>
</template>
