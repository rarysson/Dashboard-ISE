<template>
	<div>
		<p>{{ currentLocationName }}</p>
		<hr>

		<v-container>
			<v-row>
				<v-col align-self="center" class="col-btn">
					<v-btn
					@click="goBack"
					title="Voltar para localização anterior">
						Voltar
					</v-btn>
				</v-col>

				<v-col cols="12" md="10">
					<div
					id="map"
					@click="selectArea">
					</div>
				</v-col>

				<v-col></v-col>
			</v-row>
		</v-container>

		<v-tabs centered background-color="transparent">
			<v-tab>Ensino Fundamental 1</v-tab>
			<v-tab-item>
				<v-card flat color="grey lighten-5">
					<column-charts
					id-chart="1"
					:chart-data="dataF1"
					:location-name="locationF1Name"/>
				</v-card>
			</v-tab-item>

			<v-tab>Ensino Fundamental 2</v-tab>
			<v-tab-item>
				<v-card flat color="grey lighten-5">
					<column-charts
					id-chart="2"
					:chart-data="dataF2"
					:location-name="locationF2Name"/>
				</v-card>
			</v-tab-item>

			<v-tab>Ensino Médio</v-tab>
			<v-tab-item>
				<v-card flat color="grey lighten-5">
					<column-charts
					id-chart="3"
					:chart-data="dataEM"
					:location-name="locationEMName"/>
				</v-card>
			</v-tab-item>
		</v-tabs>
	</div>
</template>

<script>
import {api} from '../util/api'
import getCountry from '../util/country'
import {getState} from '../util/state'
import getCity, { getIBGECodCity } from '../util/city'
import getSchoolIDEB from '../util/school'

import columnCharts from './ColumnCharts'

export default {
	beforeMount() {
		window.google.charts.load("current", {packages: ['corechart', 'bar']})
	},
	async mounted() {
		try {
			const resIDEB = await api.get("brasil")
			const dataCountry = await getCountry()
			const dataIDEB = resIDEB.data[0]
			this.states = dataCountry.data
			dataCountry.data = []

			this.states.forEach(state => {
				dataCountry.data.push([state.nome])
			});

			this.changeDashboardData(dataCountry, dataIDEB, {data: dataCountry, dataIDEB})
		} catch (e) {
			this.$emit("error-server", e)
		}
	},
	data() {
		return {
			geochart: null,
			geoData: [],
			dataF1: [], //Ensino Fundamental 1
			dataF2: [], //Ensino Fundamental 2
			dataEM: [], //Ensino Médio
			locationF1Name: "",
			locationF2Name: "",
			locationEMName: "",
			states: null,
			locations: [],
			currentIndex: 0,
			currentState: {},
			currentLocationName: "",
			geoOptions: {
				mapsOptions: {
					center: {
						lat: 0,
						lng: 0
					},
					zoom: 4
				},
				geoJson: "",
				geoJsonOptions: {
					idPropertyName: "name"
				}
			}
		}
	},
	components: {
		'column-charts': columnCharts
	},
	watch: {
		geoData() {
			this.drawVisualization()
		},
		currentLocationName(value) {
			this.locationF1Name = this.locationF2Name = this.locationEMName = value
		}
	},
	methods: {
		async selectArea() {
			let area = this.geochart.getSelection()[0]

			if (area !== undefined) {
				if (this.currentIndex === 0) { //Indo para estado
					let stateName = this.geoData[area.row][0]
					const state = await this.getDataState(stateName)
					this.currentState = state.stateData

					this.changeDashboardData(this.currentState, state.dataIDEB, {data: this.currentState, dataIDEB: state.dataIDEB})
					this.currentIndex++
				} else if (this.currentIndex === 1) { //Indo para município
					let cityName = this.geoData[area.row][0]
					const city = await this.getDataCity(this.currentState.name, cityName)

					this.changeDashboardData(city.cityData, city.dataIDEB, {data: city.cityData, dataIDEB: city.dataIDEB})
					this.currentIndex++
				}
			}
		},
		changeDataIDEB(dataIDEB) {
			this.filterDataF1(dataIDEB)
			this.filterDataF2(dataIDEB)
			this.filterDataEM(dataIDEB)
		},
		changeMapOptions(data) {
			this.currentLocationName = data.name
			this.geoOptions.mapsOptions.center.lat = data.lat
			this.geoOptions.mapsOptions.center.lng = data.lng
			this.geoOptions.geoJson = data.url
			this.geoOptions.geoJsonOptions.idPropertyName = data.property_name
			this.geoOptions.mapsOptions.zoom = data.zoom
			this.geoData = data.data
		},
		drawVisualization() {
			let data = new window.google.visualization.DataTable()
			data.addColumn("string", "Local")
			data.addRows(this.geoData)

			this.geochart = new window.geochart_geojson.GeoChart(document.getElementById("map"))

			this.geochart.draw(data, this.geoOptions)
		},
		filterDataF1(locations) {
			this.dataF1 = []

			for(let cod in locations) {
				if (cod[cod.length - 1] == 1) {
					let year = cod.slice(4, 8)
					let grade = locations[cod]

					this.dataF1.push([year, grade])
				}
			}
		},
		filterDataF2(locations) {
			this.dataF2 = []

			for(let cod in locations) {
				if (cod[cod.length - 1] == 2) {
					let year = cod.slice(4, 8)
					let grade = locations[cod]

					this.dataF2.push([year, grade])
				}
			}
		},
		filterDataEM(locations) {
			this.dataEM = []

			for(let cod in locations) {
				if (cod[cod.length - 1] == 'M') {
					let year = cod.slice(4, 8)
					let grade = locations[cod]

					this.dataEM.push([year, grade])
				}
			}
		},
		goBack() {
			if (this.currentIndex === 0) {
				return;
			}

			this.locations.pop()
			this.currentIndex--
			this.changeMapOptions(this.locations[this.currentIndex].data)
			this.changeDataIDEB(this.locations[this.currentIndex].dataIDEB)
		},
		changeDashboardData(mapOptions, dataIDEB, locationObject) {
			this.changeMapOptions(mapOptions)
			this.changeDataIDEB(dataIDEB)
			this.locations.push(locationObject)
		},
		async getDataState(stateName) {
			let stateData, dataIDEB

			try {
				stateData = await getState(this.states.find(el => el.nome == stateName))
				const resIDEB = await api.get(`regiao/${stateName}`)
				dataIDEB = resIDEB.data[0]
			} catch (e) {
				this.$emit("error-server", e)
			}

			return {
				stateData,
				dataIDEB
			}
		},
		async getDataCity(stateName, cityName) {
			let cityData, dataIDEB

			try {
				let stateData = this.states.find(el => el.nome == stateName)
				cityData = await getCity(cityName, stateData, this.currentState.zoom)
				const resIDEB = await api.get(`municipio/${cityData.codIBGE}`)
				dataIDEB = resIDEB.data
			} catch (e) {
				this.$emit("error-server", e)
			}

			return {
				cityData,
				dataIDEB
			}
		},
		async changeState(stateName) {
			if (this.currentIndex === 0) { //Primeira mudança
				this.currentIndex++ //Vai acrescentar um lugar
			} else if (this.currentIndex === 1) { //Já escolheu outro estado
				this.locations.pop() //Remove o estado escolhido
			} else if (this.currentIndex === 2) { //Está numa cidade
				this.locations.splice(1, 2) //Remove dois lugares
				this.currentIndex--
			} else if (this.currentIndex === 3) { //Está numa escola
				this.locations.splice(1, 3)
				this.currentIndex-= 2
			}

			const state = await this.getDataState(stateName)
			this.currentState = state.stateData

			this.changeDashboardData(this.currentState, state.dataIDEB, {data: this.currentState, dataIDEB: state.dataIDEB})
		},
		async changeCity(stateName, cityName) {
			let needToGetState = false

			if (this.currentIndex === 0) { //Primeira mudança
				needToGetState = true
				this.currentIndex+= 2 //+2 pq vai acrescentar 2 locais
			} else if (this.currentIndex === 1) { //Está em um estado
				if (stateName !== this.currentState.name) {
					this.locations.pop()
					needToGetState = true
				}

				this.currentIndex++
			} else if (this.currentIndex === 2) { //Está em outra cidade
				if (stateName !== this.currentState.name) {
					this.locations.splice(1, 2)
					needToGetState = true
				} else {
					this.locations.pop()
				}
			} else if (this.currentIndex === 3) {
				if (stateName !== this.currentState.name) {
					this.locations.splice(1, 3)
					needToGetState = true
				} else {
					this.locations.splice(2, 2)
				}
			}

			if (needToGetState) {
				const state = await this.getDataState(stateName)
				this.currentState = state.stateData

				this.locations.push({data: this.currentState, dataIDEB: state.dataIDEB})
			}

			const city = await this.getDataCity(stateName, cityName)

			this.changeDashboardData(city.cityData, city.dataIDEB, {data: city.cityData, dataIDEB: city.dataIDEB})
		},
		async changeSchool(stateName, cityName, school) {
			let dataIDEB

			await this.changeCity(stateName, cityName)

			try {
				dataIDEB = await getSchoolIDEB(school.cod)
			} catch (e) {
				this.$emit("error-server", e)
			}

			if (this.currentIndex !== 3) { //Não está numa escola
				this.currentIndex++
			}

			this.currentLocationName = school.name
			this.changeDataIDEB(dataIDEB)
			this.locations.push({data: null, dataIDEB})
		},
		async showBestSchool(state, cityName) {
			await this.changeCity(state.name, cityName)
			this.currentLocationName = `Melhores escolas de ${this.currentLocationName}`

			let escolas

			try {
				const cityCod = await getIBGECodCity(state.uf, cityName)
				const res = await api.get(`escola/melhor/ideb/${cityCod}`)
				escolas = res.data
			} catch (e) {
				this.$emit("server-error", e)
			}

			this.filterDataF1(escolas["Ensino Fundamental 1"][0])
			this.locationF1Name = escolas["Ensino Fundamental 1"][0].NomeEscola

			this.filterDataF2(escolas["Ensino Fundamental 2"][0])
			this.locationF2Name = escolas["Ensino Fundamental 2"][0].NomeEscola

			this.filterDataEM(escolas["Ensino Medio"][0])
			this.locationEMName = escolas["Ensino Medio"][0].NomeEscola
		}
	}
}
</script>

<style scoped>
p {
	font-size: 36px;
	text-align: center;
}

.col-btn {
	text-align: right;
}

#map {
	height: 80vh;
	min-height: 500px;
	margin: 0 10px;
	border: 1px solid black;
	border-radius: 5px;
}
</style>
