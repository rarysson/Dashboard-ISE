import axios from "axios";

export default async () => {
	const res = await axios.get(
		"https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/main/json/estados.json"
	);

	return {
		property_name: "name",
		name: "Brasil",
		url:
			"https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson",
		lat: -14,
		lng: -52,
		zoom: 4,
		data: res.data
	};
};
