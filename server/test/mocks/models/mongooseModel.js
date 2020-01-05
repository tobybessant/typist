module.exports = class MongooseModel {

	constructor(properties) {
		this.properties = properties
	}

	save() {
		return this.properties
	}
}
