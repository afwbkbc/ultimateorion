class String extends require( './_Handler' ) {

	constructor() {
		super();
		
		this.TriggerOn = '"';
		this.StopOn = this.TriggerOn;
		
	}
	
}

module.exports = String;
