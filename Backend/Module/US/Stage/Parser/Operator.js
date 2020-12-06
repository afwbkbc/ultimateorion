class Operator extends require( './_Handler' ) {

	constructor() {
		super();
		
		this.TriggerOn = '+-=/*%<>&^|?!~,';
		this.ContinueOn = this.TriggerOn;
		
		this.ValidOperators = [
			// js operators
			'=', '+', '-', '*', '/', '%', '**', '<<', '>>', '>>>', '&', '^', '~', '|', '&&', '||', '??', '++', '--', '!',
			'+=', '-=', '*=', '/=', '%=', '**=', '<<=', '>>=', '>>>=', '&=', '^=', '|=', '&&=', '||=', '??=',
			'==', '!=', '===', '!==', '>', '>=', '<', '<=', '?', ':', ','
		];
		
	}
	
	OnProcess( context ) {
		if ( this.ValidOperators.indexOf( context.Source ) < 0 )
			throw context.CreateError( 'invalid operator ' + context.Source, context.Source.length );
		context.Data = {
			operator: context.Source,
		};
	}
	
}

module.exports = Operator;
