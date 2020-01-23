import axios from 'axios'

export default async (name, state, zoom) => {
	let res
	let lat
	let lng
	let data
	zoom += 0.8
	
	try {
		res = await axios.get("https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/master/json/municipios.json")
		
		data = res.data.find(el => el.nome == name && el.codigo_uf == state.codigo_uf)
		lat = data.latitude
		lng = data.longitude
	} catch (e) {
		console.log(e)
	}

	return {
		property_name: "NOME",
		name,
		url: `https://raw.githubusercontent.com/luizpedone/municipal-brazilian-geodata/master/data/${state.uf}.json`,
		lat,
		lng,
		zoom,
		codIBGE: data.codigo_ibge,
		data: [[name]]
	}
}