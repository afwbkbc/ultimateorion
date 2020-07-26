class Parent extends require( './_Handler' ) {

	constructor() {
		super();
		
		this.TriggerOn = '@';
		
	}
	
	OnProcess( context ) {
		context.Data = null;
	}
	
}

module.exports = Parent;
