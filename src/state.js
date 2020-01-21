import axios from 'axios'

export default async (state) => {
	let res
	let cities = []
	let lat
	let lng

	try {
		res = await axios.get(`https://raw.githubusercontent.com/luizpedone/municipal-brazilian-geodata/master/data/${state.uf}.json`)
		let capitalCity = await axios.get("https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/master/json/municipios.json")
		
		res.data.features.forEach(el => {
			let city = el.properties

			if (city.UF == state.uf) {
				cities.push([city.NOME])
			}
		});

		let capital = capitalCity.data.find(el => el.capital && el.codigo_uf == state.codigo_uf)
		lat = capital.latitude
		lng = capital.longitude
	} catch (e) {
		console.log(e)
	}

	return {
		property_name: "NOME",
		name: `${state.nome}`,
		lat,
		lng,
		zoom: 5,
		url: `https://raw.githubusercontent.com/luizpedone/municipal-brazilian-geodata/master/data/${state.uf}.json`,
		data: cities
	}
}