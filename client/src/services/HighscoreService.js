export default class HighscoreController {
	constructor(axios) {
		this.baseUrl = "http://localhost:9000/api/highscore/"
		this.axios = axios
	}
	async save(data) {
		const response = await this.axios.post(this.baseUrl + "save", data)
		if (response.status === 200) {
			return { message: response.data.message }
		} else {
			return { error: response.data.error }
		}
	}

	async fetchAll() {
		const response = await this.axios.get(this.baseUrl + "fetchAll")
		return response.data.results
	}
}
