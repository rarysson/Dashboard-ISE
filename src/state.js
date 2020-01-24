import axios from 'axios'

const centralPoints = {
    AC: [-8.77, -70.55],
	AL: [-9.62, -36.82],
	AM: [-3.47, -65.10],
	AP: [1.41, -51.77],
	BA: [-13.29, -41.71],
	CE: [-5.20, -39.53],
	DF: [-15.83, -47.86],
	ES: [-19.19, -40.34],
	GO: [-15.98, -49.86],
	MA: [-5.42, -45.44],
	MT: [-12.64, -55.42],
	MS: [-20.51, -54.54],
	MG: [-18.10, -44.38],
	PA: [-3.79, -52.48],
	PB: [-7.28, -36.72],
	PR: [-24.89, -51.55],
	PE: [-8.38, -37.86],
	PI: [-6.60, -42.28],
	RJ: [-22.25, -42.66],
	RN: [-5.81, -36.59],
	RO: [-10.83, -63.34],
	RS: [-30.17, -53.50],
	RR: [1.99, -61.33],
	SC: [-27.45, -50.95],
	SE: [-10.57, -37.45],
	SP: [-22.19, -48.79],
	TO: [-9.46, -48.26]
}

const zoomState = {
	AC: 6.8,
	AL: 8.1,
	AM: 5.7,
	AP: 6.7,
	BA: 6,
	CE: 6.9,
	DF: 8.5,
	ES: 7.3,
	GO: 6.5,
	MA: 6.1,
	MT: 5.9,
	MS: 6.4,
	MG: 6,
	PA: 5.7,
	PB: 7.7,
	PR: 6.9,
	PE: 7,
	PI: 6.3,
	RJ: 7.7,
	RN: 7.9,
	RO: 6.8,
	RS: 6.3,
	RR: 6.7,
	SC: 7.2,
	SE: 8.2,
	SP: 6.7,
	TO: 6.3
}

export async function getState(state) {
	let lat, lng
	let cities = []

	try {
		const res = await axios.get(`https://raw.githubusercontent.com/luizpedone/municipal-brazilian-geodata/master/data/${state.uf}.json`)
		
		res.data.features.forEach(el => {
			let city = el.properties

			if (city.UF == state.uf) {
				cities.push([city.NOME])
			}
		});

		lat = centralPoints[state.uf][0]
		lng = centralPoints[state.uf][1]
	} catch (e) {
		throw e
	}

	return {
		property_name: "NOME",
		name: `${state.nome}`,
		lat,
		lng,
		zoom: zoomState[state.uf],
		url: `https://raw.githubusercontent.com/luizpedone/municipal-brazilian-geodata/master/data/${state.uf}.json`,
		data: cities
	}
}

export function ufToName(UF) {
	const states = {
		AC: "Acre",
		AL: "Alagoas",
		AM: "Amazonas",
		AP: "Amapá",
		BA: "Bahia",
		CE: "Ceará",
		DF: "Distrito Federal",
		ES: "Espírito Santo",
		GO: "Goiás",
		MA: "Maranhão",
		MT: "Mato Grosso",
		MS: "Mato Grosso do Sul",
		MG: "Minas Gerais",
		PA: "Pará",
		PB: "Paraíba",
		PR: "Paraná",
		PE: "Pernanbuco",
		PI: "Piauí",
		RJ: "Rio de Janeiro",
		RN: "Rio Grande do Norte",
		RO: "Rondônia",
		RS: "Rio Grande do Sul",
		RR: "Roraima",
		SC: "Santa Catarina",
		SE: "Sergipe",
		SP: "São Paulo",
		TO: "Tocantins"
	}

	return states[UF]
}

export const statesUF = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 
'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']