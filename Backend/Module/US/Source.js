class Source {
	
	constructor( compiler, namespace, code ) {
		this.Compiler = compiler;
		this.Namespace = namespace;
		this.US = code;
	}
	
	Compile() {
		console.log( 'COMPILE', this.US );
		
	}
}

module.exports = Source;
