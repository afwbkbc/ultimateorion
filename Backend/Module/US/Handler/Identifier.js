class Identifier extends require( './_Handler' ) {

	constructor() {
		super();
		
		this.TriggerOn = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		this.ContinueOn = this.TriggerOn + '1234567890';
		
	}
	
}

module.exports = Identifier;
