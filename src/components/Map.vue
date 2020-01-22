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
				<v-col cols="8">
					<div
						id="map"
						@click="selectArea">
					</div>
				</v-col>
				<v-col></v-col>
			</v-row>
		</v-container>
		<v-tabs centered>
			<v-tab>Ensino Fundamental 1</v-tab>
			<v-tab-item>
				<column-charts 
					id-chart="1" 
					:chart-data="dataF1"
					:location-name="currentLocationName"
					ref="dataF1"/>
			</v-tab-item>

			<v-tab>Ensino Fundamental 2</v-tab>
			<v-tab-item>
				<column-charts 
					id-chart="2" 
					:chart-data="dataF2"
					:location-name="currentLocationName"/>
			</v-tab-item>

			<v-tab>Ensino Médio</v-tab>
			<v-tab-item>
				<column-charts 
					id-chart="3" 
					:chart-data="dataEM"
					:location-name="currentLocationName"/>
			</v-tab-item>
		</v-tabs>
	</div>
</template>

<script>
import {api} from '../api'
import getCountry from '../country'
import getState from '../state'

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

			this.changeMapOptions(dataCountry)
			this.locations.push({data: dataCountry, dataIDEB})
			
			this.filterDataF1(dataIDEB)
			this.filterDataF2(dataIDEB)
			this.filterDataEM(dataIDEB)
			this.drawVisualization()
		} catch (e) {
			console.log(e)
		}
	},
	data() {
		return {
			geochart: null,
			geoData: [],
			dataF1: [], //Ensino Fundamental 1
			dataF2: [], //Ensino Fundamental 2
			dataEM: [], //Ensino Médio
			states: null,
			locations: [],
			currentIndex: 0,
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
	methods: {
		async selectArea() {
			let area = this.geochart.getSelection()[0]

			if (area !== undefined) {
				if (this.currentIndex === 0) { //Indo para estado
					let stateName = this.geoData[area.row][0]
					let data = await getState(this.states.find(el => el.nome == stateName))
					const resIDEB = await api.get(`regiao/${stateName}`)
					const dataIDEB = resIDEB.data[0]

					this.changeMapOptions(data)
					this.changeDataIDEB(dataIDEB)
					this.drawVisualization()
					this.locations.push({data, dataIDEB})
					this.currentIndex++
				}
			}
		},
		changeDataIDEB(dataIDEB) {
			this.dataF1 = []
			this.dataF2 = []
			this.dataEM = []
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
			for(let cod in locations) {
				if (cod[cod.length - 1] == 1) {
					let year = cod.slice(4, 8)
					let grade = locations[cod]
					
					this.dataF1.push([year, grade])
				}
			}
		},
		filterDataF2(locations) {
			for(let cod in locations) {
				if (cod[cod.length - 1] == 2) {
					let year = cod.slice(4, 8)
					let grade = locations[cod]
					
					this.dataF2.push([year, grade])
				}
			}
		},
		filterDataEM(locations) {
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
			console.log(JSON.stringify(this.locations[this.currentIndex].dataIDEB))
			this.drawVisualization()
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