<template>
	<v-navigation-drawer color="indigo darken-4" app>
		<v-list height="100vh">
			<v-list-item-content class="app-name">
				<v-list-item-title class="app-title">ISE</v-list-item-title>
				<v-list-item-subtitle>Informando Sobre Educação</v-list-item-subtitle>
			</v-list-item-content>

			<hr>

			<search
				class="search"
				text-label="Melhor escola do município"
				text-placeholder="Digite o município..."/>
			<search 
				class="search"
				text-label="Pesquisar escola"
				text-placeholder="Digite a escola..."/>
			<search
				class="search"
				text-label="Pesquisar município" 
				text-placeholder="Digite o município..."/>
			<search
				class="search"
				text-label="Pesquisar estado" 
				text-placeholder="Digite o estado..."/>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
import search from './Search'

export default {
	components: {
		search
	}
}
</script>

<style scoped>
.app-name {
	text-align: center;
	color: whitesmoke;
	margin-bottom: 30px;
}

.app-title {
	font-size: 36px;
}

hr {
	border: 1px solid black;
	margin: 30px 0;
}

.search {
	width: 80%;
	margin: 10px auto;
}
</style>