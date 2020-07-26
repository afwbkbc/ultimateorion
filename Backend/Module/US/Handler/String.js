class String extends require( './_Handler' ) {

	constructor() {
		super();
		
		this.TriggerOn = '"';
		this.StopOn = this.TriggerOn;
		
	}
	
	OnBegin( context ) {
		context.Parser.IsInsideString = true;
	}
	
	OnEnd( context ) {
		context.Parser.IsInsideString = false;
	}
	
}

module.exports = String;
