class USObject {
	
	constructor( compiler, namespace, code ) {
		this.Compiler = compiler;
		this.Namespace = namespace;
		this.Code = code;
	}
	
	Compile() {
		
		// start with raw code
		let data = [ this.Code ];
		
		// multipass processing of data, from raw code to compiled scripts
		for ( let i in this.Compiler.Stages ) {
			let stage = this.Compiler.Stages[ i ]( this );
			data.push( stage.Process( data[ i ] ) );
		}
		
		console.log( 'DATA', data );
		
	}
}

module.exports = USObject;
