<template>
	<div>
		<p>Brasil</p>
		<hr>
		<div 
			id="map"
			@click="selectArea">
		</div>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	beforeMount() {
		window.google.charts.load("current")
		window.google.charts.setOnLoadCallback(this.drawVisualization)
	},
	async mounted() {
		try {
			const res = await axios.get("https://raw.githubusercontent.com/felipefdl/cidades-estados-brasil-json/master/Estados.json")
			
			res.data.forEach(state => {
				this.geoData.push([state.Nome])
			});

			this.drawVisualization()
		} catch (e) {
			console.log(e)
		}
	},
	data() {
		return {
			geochart: null,
			geoData: []
		}
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
			data.addColumn("string", "City")
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
		}
	}
}
</script>

<style scoped>
p {
	font-size: 36px;
	margin-left: 50px;
}

#map {
	width: 65%;
	height: 80vh;
	margin-top: 50px;
	margin-left: 50px;
	border: 1px solid black;
	border-radius: 5px;
}
</style>