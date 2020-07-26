class String extends require( './_Handler' ) {

	constructor() {
		super();
		
		this.TriggerOn = '"';
		this.StopOn = this.TriggerOn;
		
	}
	
	OnBegin( context ) {
		context.Parser.IsInsideString = true;
	}
	
	OnProcess( context ) {
		context.Data = {
			string: context.Source.substring( 1, context.Source.length - 1 ), // trim quotes
		};
	}
	
	OnEnd( context ) {
		context.Parser.IsInsideString = false;
	}
	
}

module.exports = String;
