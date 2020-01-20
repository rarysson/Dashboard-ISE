<template>
	<div>
		<p>Brasil</p>
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
import axios from 'axios'
import {api} from '../api'

import columnCharts from './ColumnCharts'

export default {
	beforeMount() {
		window.google.charts.load("current", {packages: ['corechart', 'bar']})
		window.google.charts.setOnLoadCallback(this.drawVisualization)
	},
	async mounted() {
		try {
			const resStates = await axios.get("https://raw.githubusercontent.com/felipefdl/cidades-estados-brasil-json/master/Estados.json")
			const resCountry = await api.get("brasil")
			
			resStates.data.forEach(state => {
				this.geoData.push([state.Nome])
			});

			this.filterDataF1(resCountry.data[0])
			this.filterDataF2(resCountry.data[0])
			this.filterDataEM(resCountry.data[0])
			this.drawVisualization()
		} catch (e) {
			console.log(e)
		}
	},
	data() {
		return {
			geochart: null,
			geoData: [],
			dataF1: [],
			dataF2: [],
			dataEM: []
		}
	},
	components: {
		'column-charts': columnCharts
	},
	methods: {
		selectArea() {
			let area = this.geochart.getSelection()[0]

			if (area !== undefined) {
				console.log(this.geoData[area.row])
			}
		},
		drawVisualization() {
			let data = new window.google.visualization.DataTable()
			data.addColumn("string", "Estado")
			data.addRows(this.geoData)

			this.geochart = new window.geochart_geojson.GeoChart(document.getElementById("map"))

			let options = {
				mapsOptions: {
					center: {lat: -14, lng: -52},
					zoom: 4
				},
				geoJson: "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson",
				geoJsonOptions: {
					idPropertyName: "name"
				}
			}

			this.geochart.draw(data, options)
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