class Identifier extends require( './_Handler' ) {

	constructor() {
		super();
		
		this.TriggerOn = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		this.ContinueOn = this.TriggerOn + '1234567890';
		
	}

	OnProcess( context ) {
		context.Data = {
			name: context.Source,
		};
	}
	
}

module.exports = Identifier;
