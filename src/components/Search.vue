<template>
	<div>
		<v-select
		outlined
		dense
		v-model="selected"
		background-color="grey lighten-4"
		no-data-text="----------"
		:append-icon="selectIcon()"
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
		},
		selectIcon() {
			return (this.selected) ? undefined : 'mdi-magnify'
		}
	}
}
</script>
