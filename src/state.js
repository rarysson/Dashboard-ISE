import axios from 'axios'

const centralPoints = {
    AC: [ -8.77, -70.55],
	AL: [ -9.71, -35.73],
	AM: [ -4.37, -65.23],
	AP: [  1.41, -51.77],
	BA: [-12.96, -38.51],
	CE: [ -3.71, -38.54],
	DF: [-15.83, -47.86],
	ES: [-19.19, -40.34],
	GO: [-16.64, -49.31],
	MA: [ -2.55, -44.30],
	MT: [-12.64, -55.42],
	MS: [-20.51, -54.54],
	MG: [-18.10, -44.38],
	PA: [ -5.53, -52.29],
	PB: [ -7.06, -35.55],
	PR: [-24.89, -51.55],
	PE: [ -8.28, -35.07],
	PI: [ -8.28, -43.68],
	RJ: [-22.84, -43.15],
	RN: [ -5.22, -36.52],
	RO: [-11.22, -62.80],
	RS: [-30.01, -51.22],
	RR: [  1.99, -61.33],
	SC: [-27.33, -49.44],
	SE: [-10.90, -37.07],
	SP: [-23.55, -46.64],
	TO: [-10.25, -48.25]
}

export default async (state) => {
	let res
	let cities = []
	let lat
	let lng

	try {
		res = await axios.get(`https://raw.githubusercontent.com/luizpedone/municipal-brazilian-geodata/master/data/${state.uf}.json`)
		
		res.data.features.forEach(el => {
			let city = el.properties

			if (city.UF == state.uf) {
				cities.push([city.NOME])
			}
		});

		let capital = centralPoints[state.uf]
		lat = capital[0]
		lng = capital[1]
	} catch (e) {
		console.log(e)
	}

	return {
		property_name: "NOME",
		name: `${state.nome}`,
		lat,
		lng,
		zoom: 5.5,
		url: `https://raw.githubusercontent.com/luizpedone/municipal-brazilian-geodata/master/data/${state.uf}.json`,
		data: cities
	}
}