module.exports = class MockResponse {
	constructor() {
		this.statusCode = null
		this.body = null
	}

	json(data) {
		this.body = data
	}

 	status(code) {
		this.statusCode = code
		return this
	 }
}