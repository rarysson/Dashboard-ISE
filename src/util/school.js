import axios from "axios";

export default async function getSchoolIDEB(codSchool) {
	const res = await axios.get(
		`https://api-infoedu.herokuapp.com/escola/${codSchool}`
	);

	return res.data;
}
