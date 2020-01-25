<template>
	<div class="alert" @click="closeAlert">
		<v-alert
		dismissible
		type="error"
		:value="show">
			<strong>{{ message }}</strong>
		</v-alert>
	</div>
</template>

<script>
export default {
	props: ['message'],
	data() {
		return {
			show: false
		}
	},
	methods: {
		activeMsg() {
			this.show = true
		},
		closeAlert() {
			this.show = false
		}
	}
}
</script>

<style scoped>
.alert {
	position: fixed;
	right: 0;
	z-index: 10;
}
</style>