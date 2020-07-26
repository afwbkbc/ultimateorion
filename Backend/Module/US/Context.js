class Context {
	
	constructor( parser, handler ) {
		this.Parser = parser;
		this.Handler = handler;
		this.Source = '';
	}
	
	CreateError( message ) {
		return this.Parser.CreateError( message, this.Source.length );
	}
	
}

module.exports = Context;
