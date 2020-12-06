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
			data.push( this.Compiler.Stages[ i ]( this ).Process( data[ i ] ) );
		}
		
		console.log( 'FINAL DATA', data.length, data[ data.length - 1 ] );
		
	}
}

module.exports = USObject;
