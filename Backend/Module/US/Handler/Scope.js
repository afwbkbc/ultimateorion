class Scope extends require( './_Recursive' ) {

	constructor() {
		super();
		
		this.TriggerOn = '{';
		this.StopOn = '}';
		
	}
	
}

module.exports = Scope;
