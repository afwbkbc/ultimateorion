class USObject {
	
	constructor( compiler, namespace, code ) {
		this.Compiler = compiler;
		this.Namespace = namespace;
		this.Code = code;
		
/*		for ( let i in this.Stages ) {
			this.Stages[ i ] = require( './Stage/' + this.Stages[ i ] );
		}*/
	}
	
	Compile() {
		
		let data = [ this.Code ];
		
		// multipass processing of data, from raw code to compiled scripts
		for ( let i in this.Compiler.Stages ) {
			let stage = new ( this.Compiler.Stages[ i ] )( this );
			data.push( stage.Process( data[ i ] ) );
		}
		
		console.log( 'DATA', data );
		
/*		let parser = new ( require( './Parser' ) )( this.Compiler );
		this.ParsedData = parser.Parse( this.Namespace, this.Code );
		
		//let sorter = new ( require( './Sorter' ) )( this.Compiler );
		
		console.log( 'COMPILE', this.Namespace, this.ParsedData );*/
		
	}
}

module.exports = USObject;
