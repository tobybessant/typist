module.exports = class MockGameModel {
	
	constructor(properties){
		this.properties = properties
	}
	
	save() {
		return this.properties
	}
}