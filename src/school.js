import axios from 'axios'

export default async function getSchoolIDEB(codSchool) {
	let dataIDEB

	try {
		const res = await axios.get(`https://api-infoedu.herokuapp.com/escola/${codSchool}`)
		dataIDEB = res.data
	} catch (e) {
		throw e
	}

	return dataIDEB
}