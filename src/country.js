import axios from 'axios'

export default async () => {
	let res
	
	try {
		res = await axios.get("https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/master/json/estados.json")
	} catch (e) {
		console.log(e)
	}

	return {
		property_name: "name",
		name: "Brasil",
		url: "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson",
		lat: -14,
		lng: -52,
		data: res.data
	}
}