<template>
  <v-app>
    <v-content fluid>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}
</style>