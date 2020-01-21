<template>
	<div>
		<p>{{ currentLocation }}</p>
		<hr>
		<div 
			id="map"
			@click="selectArea">
		</div>
		<v-tabs centered>
			<v-tab>Ensino Fundamental 1</v-tab>
			<v-tab-item>
				<column-charts id-chart="1" :chart-data="dataF1" ref="dataF1"/>
			</v-tab-item>

			<v-tab>Ensino Fundamental 2</v-tab>
			<v-tab-item>
				<column-charts id-chart="2" :chart-data="dataF2"/>
			</v-tab-item>

			<v-tab>Ensino Médio</v-tab>
			<v-tab-item>
				<column-charts id-chart="3" :chart-data="dataEM"/>
			</v-tab-item>
		</v-tabs>
	</div>
</template>

<script>
import {api} from '../api'
import country from '../country'
import state from '../state'

import columnCharts from './ColumnCharts'

export default {
	beforeMount() {
		window.google.charts.load("current", {packages: ['corechart', 'bar']})
		window.google.charts.setOnLoadCallback(this.drawVisualization)
	},
	async mounted() {
		try {
			const dataIDEB = await api.get("brasil")
			this.dataCountry = await country()

			this.dataCountry.data.forEach(state => {
				this.geoData.push([state.nome])
			});

			this.currentLocation = this.dataCountry.name
			this.geoOptions.mapsOptions.center.lat = this.dataCountry.lat
			this.geoOptions.mapsOptions.center.lng = this.dataCountry.lng
			this.geoOptions.geoJson = this.dataCountry.url
			this.geoOptions.geoJsonOptions.idPropertyName = this.dataCountry.property_name

			this.filterDataF1(dataIDEB.data[0])
			this.filterDataF2(dataIDEB.data[0])
			this.filterDataEM(dataIDEB.data[0])
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
			dataCountry: null,
			currentLocation: "",
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
				let stateName = this.geoData[area.row][0]
				let data = await state(this.dataCountry.data.find(el => el.nome == stateName))

				this.currentLocation = data.name
				this.geoOptions.mapsOptions.center.lat = data.lat
				this.geoOptions.mapsOptions.center.lng = data.lng
				this.geoOptions.geoJson = data.url
				this.geoOptions.geoJsonOptions.idPropertyName = data.property_name
				this.geoOptions.mapsOptions.zoom = data.zoom
				this.geoData = data.data

				this.drawVisualization()
			}
		},
		drawVisualization() {
			let data = new window.google.visualization.DataTable()
			data.addColumn("string", "Estado")
			data.addRows(this.geoData)

			this.geochart = new window.geochart_geojson.GeoChart(document.getElementById("map"))

			this.geochart.draw(data, this.geoOptions)
		},
		filterDataF1(states) {
			for(let cod in states) {
				if (cod[cod.length - 1] == 1) {
					let year = cod.slice(4, 8)
					let grade = states[cod]
					
					this.dataF1.push([year, grade])
				}
			}

			this.$refs.dataF1.drawChart()
		},
		filterDataF2(states) {
			for(let cod in states) {
				if (cod[cod.length - 1] == 2) {
					let year = cod.slice(4, 8)
					let grade = states[cod]
					
					this.dataF2.push([year, grade])
				}
			}
		},
		filterDataEM(states) {
			for(let cod in states) {
				if (cod[cod.length - 1] == 'M') {
					let year = cod.slice(4, 8)
					let grade = states[cod]
					
					this.dataEM.push([year, grade])
				}
			}
		}
	}
}
</script>

<style scoped>
p {
	font-size: 36px;
	text-align: center;
}

#map {
	width: 65%;
	height: 80vh;
	min-height: 500px;
	margin: 50px auto;
	border: 1px solid black;
	border-radius: 5px;
}
</style>