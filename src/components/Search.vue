<template>
	<div>
		<v-select 
		outlined
		dense
		v-model="selected"
		append-icon="mdi-magnify"
		background-color="grey lighten-4"
		no-data-text="----------"
		:label="textLabel"
		:items="options"
		@change="emitChangeEvent"/> 
	</div>
</template>

<script>
export default {
	props: ['options', 'textLabel', 'changeFunc'],
	data() {
		return {
			selected: null
		}
	},
	methods: {
		emitChangeEvent() {
			this.$emit("change-value", this.selected)
		}
	}
}
</script>