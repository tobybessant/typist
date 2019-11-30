module.exports = class MockRequest {
	constructor(body) {
		this.body = body || {}
	}
}