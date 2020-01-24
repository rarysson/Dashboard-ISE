import axios from 'axios'

export default async function getCity(cityName, state, zoom) {
	let lat, lng, codIDBE
	
	try {
		const res = await axios.get("https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/master/json/municipios.json")		
		const cityData = res.data.find(el => el.nome == cityName && el.codigo_uf == state.codigo_uf)

		lat = cityData.latitude
		lng = cityData.longitude
		codIDBE = cityData.codigo_ibge
	} catch (e) {
		throw e
	}

	return {
		property_name: "NOME",
		name: cityName,
		url: `https://raw.githubusercontent.com/luizpedone/municipal-brazilian-geodata/master/data/${state.uf}.json`,
		lat,
		lng,
		zoom: zoom + 0.8,
		codIBGE: codIDBE,
		data: [[cityName]]
	}
}

export async function getCitiesName(UF) {
	let cities = []

	try {
		const resStates = await axios.get("https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/master/json/estados.json")
		const resCities = await axios.get("https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/master/json/municipios.json")
		const state = resStates.data.find(el => el.uf == UF)

		resCities.data.find(city => {
			if (city.codigo_uf == state.codigo_uf) {
				cities.push(city.nome)
			}
		})
	} catch (e) {
		throw e
	}

	return cities
}

export async function getIBGECodCity(UF, cityName) {
	let data

	try {
		const res = await axios.get("https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/master/json/municipios.json")
		const states = await axios.get("https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/master/json/estados.json")
		const codState = states.data.find(el => el.uf == UF).codigo_uf

		data = res.data.find(el => el.nome == cityName && el.codigo_uf == codState)
	} catch (e) {
		throw e
	}

	return data.codigo_ibge
}