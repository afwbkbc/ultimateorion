class Source {
	
	constructor( compiler, namespace, code ) {
		this.Compiler = compiler;
		this.Namespace = namespace;
		this.Code = code;
		
		this.Parser = null;
		this.ParsedData = null;
	}
	
	Compile() {
		
		if ( !this.Parser )
			this.Parser = new ( require( './Parser' ) )( this.Compiler );
		
		this.ParsedData = this.Parser.Parse( this.Namespace, this.Code );
		
		//console.log( 'COMPILE', this.Namespace, this.ParsedData );
		
	}
}

module.exports = Source;
