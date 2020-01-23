<template>
	<v-navigation-drawer color="indigo darken-3" app>
		<v-list height="100vh">
			<v-list-item-content class="app-name">
				<v-list-item-title class="app-title">ISE</v-list-item-title>
				<v-list-item-subtitle>Informando Sobre Educação</v-list-item-subtitle>
			</v-list-item-content>
			<hr>
			<search 
			text-label="Pesquisar"
			class="search"
			:options="options"
			@change-value="selectSearch"/>

			<search 
			text-label="Estado"
			class="search"
			v-if="showState"
			:options="optionsStates"
			@change-value="selectState"/>

			<search
			text-label="Município"
			class="search"
			v-if="showCity"
			:options="optionsCities"
			@change-value="selectCity"/>

			<search
			text-label="Escola"
			class="search"
			v-if="showSchool"/>
			<!-- :options="optionsCities"
			@change-value="selectCity"/> -->

			<div style="text-align: center;" v-if="searchSelected">
				<v-btn @click="emitEvent">Pesquisar</v-btn>
			</div>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
import {statesUF} from '../state'
import {getCitiesName} from '../city'

import search from './Search'

export default {
	components: {
		search
	},
	data() {
		return {
			options: [
				'Estado',
				'Município',
				'Escola',
				'Melhor escola do município'
			],
			optionsStates: statesUF,
			optionsCities: [],
			searchSelected: false,
			showState: false,
			showCity: false,
			showSchool: false,
			stateSelected: null,
			citySelected: null
		}
	},
	methods: {
		selectSearch(search) {
			this.searchSelected = search
			this.showSchool = this.showCity = this.showSchool = false

			if (search == 'Estado') {
				this.showState = true
			} else if (search == 'Município') {
				this.showState = this.showCity = true
			} else if (search == 'Escola') {
				this.showState = this.showCity = this.showSchool = true
			} else {
				this.showState = this.showCity = this.showSchool = false
			}
		},
		async selectState(state) {
			this.optionsCities = await getCitiesName(state)
			this.stateSelected = state
		},
		selectCity(city) {
			this.citySelected = city
		},
		emitEvent() {
			if (this.searchSelected == 'Estado') {
				this.$emit("change-state", this.stateSelected)
			} else if (this.searchSelected == 'Município') {
				this.$emit("change-city", this.citySelected)
			}
			// } else if (search == 'Escola') {
			// 	this.showState = this.showCity = this.showSchool = true
			// } else {
			// 	this.showState = this.showCity = this.showSchool = false
			// }
		}
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
	width: 90%;
	margin: 10px auto;
}
</style>