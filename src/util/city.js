import axios from "axios";

export default async function getCity(cityName, state, zoom) {
	const res = await axios.get(
		"https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/main/json/municipios.json"
	);
	const cityData = res.data.find(
		(el) => el.nome == cityName && el.codigo_uf == state.codigo_uf
	);

	const lat = cityData.latitude;
	const lng = cityData.longitude;
	const codIDBE = cityData.codigo_ibge;

	return {
		property_name: "NOME",
		name: cityName,
		url: `https://raw.githubusercontent.com/luizpedone/municipal-brazilian-geodata/master/data/${state.uf}.json`,
		lat,
		lng,
		zoom: zoom + 0.8,
		codIBGE: codIDBE,
		data: [[cityName]]
	};
}

export async function getCitiesName(UF) {
	const cities = [];

	const resStates = await axios.get(
		"https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/main/json/estados.json"
	);
	const resCities = await axios.get(
		"https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/main/json/municipios.json"
	);
	const state = resStates.data.find((el) => el.uf == UF);

	resCities.data.find((city) => {
		if (city.codigo_uf == state.codigo_uf) {
			cities.push(city.nome);
		}
	});

	return cities;
}

export async function getIBGECodCity(UF, cityName) {
	const res = await axios.get(
		"https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/main/json/municipios.json"
	);
	const states = await axios.get(
		"https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/main/json/estados.json"
	);
	const codState = states.data.find((el) => el.uf == UF).codigo_uf;

	const data = res.data.find(
		(el) => el.nome == cityName && el.codigo_uf == codState
	);

	return data.codigo_ibge;
}
