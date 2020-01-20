<template>
	<div>
		<label for="text-field">{{ textLabel }}</label>
		<v-text-field
			solo
			dense
			id="text-field"
			background-color="grey lighten-4"
			prepend-inner-icon="mdi-magnify"
			:placeholder="textPlaceholder"
		/>
	</div>
</template>

<script>
export default {
	props: ['textPlaceholder', 'textLabel']
}
</script>

<style scoped>
label {
	color: whitesmoke;
}
</style>