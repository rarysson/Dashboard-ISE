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
			:options="searchOptions"
			@change-value="selectSearch"/>

			<search 
			text-label="Estado"
			class="search"
			v-if="showState"
			:options="statesOptions"
			@change-value="selectState"/>

			<search
			text-label="Município"
			class="search"
			v-if="showCity"
			:options="citiesOptions"
			@change-value="selectCity"/>

			<search
			text-label="Escola"
			class="search"
			v-if="showSchool"
			:options="schoolsOptions"
			@change-value="selectSchool"/>

			<div style="text-align: center;" v-if="selectedSearch">
				<v-btn @click="emitEvent">
					Pesquisar
				</v-btn>
			</div>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
import {statesUF, ufToName} from '../state'
import {getCitiesName, getIBGECodCity} from '../city'
import {api} from '../api'

import search from './Search'

export default {
	components: {
		search
	},
	mounted() {
		statesUF.forEach(uf => {
			this.statesOptions.push(ufToName(uf))
			this.states[ufToName(uf)] = uf
		})
	},
	data() {
		return {
			searchOptions: ['Estado', 'Município', 'Escola', 'Melhor escola do município'],
			statesOptions: [],
			citiesOptions: [],
			schoolsOptions: [],
			states: {},
			schools: {},
			showState: false,
			showCity: false,
			showSchool: false,
			selectedSearch: null,
			selectedState: null,
			selectedCity: null,
			selectedSchool: null
		}
	},
	methods: {
		selectSearch(search) {
			this.selectedSearch = search
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
			try {
				this.citiesOptions = await getCitiesName(this.states[state])
				this.selectedState = state
			} catch (e) {
				this.$emit("error-server", e)
			}			
		},
		async selectCity(city) {
			this.selectedCity = city

			if (this.selectedSearch == 'Escola') {
				try {
					const cityCod = await getIBGECodCity(this.states[this.selectedState], this.selectedCity)
					const resSchools = await api.get(`escola/municipio/${cityCod}`)
					
					resSchools.data.forEach(school => {
						this.schoolsOptions.push(school.NomeEscola)
						this.schools[school.NomeEscola] = school.CodigoEscola
					})
				} catch (e) {
					this.$emit("error-server", e)
				}
			}
		},
		selectSchool(school) {
			this.selectedSchool = school
		},
		emitEvent() {
			if (this.selectedSearch == 'Estado' && this.selectedState) {
				this.$emit("change-state", this.selectedState)
			} else if (this.selectedSearch == 'Município' && this.selectedCity) {
				this.$emit("change-city", this.selectedState, this.selectedCity)
			} else if (this.selectedSearch == 'Escola' && this.selectedSchool) {
				this.$emit("change-school", this.selectedState, this.selectedCity, {name: this.selectedSchool, cod: this.schools[this.selectedSchool]})
			} else {
				this.showState = this.showCity = this.showSchool = false
			}
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