class Newline extends require( './_Handler' ) {

	constructor() {
		super();
		
		this.TriggerOn = '\n';
		
	}
	
	OnProcess( context ) {
		context.Parser.LineNum++;
		context.Parser.LinePos = 1;
	}
	
}

module.exports = Newline;
