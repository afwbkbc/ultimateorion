class US extends require( '../_Module' ) {
	
	constructor() {
		super( module.filename );
		
		this.Compiler = new ( require( './Compiler' ) )();
		
		// compile core
		this.Packages = {
			Core: this.CompilePackage( 'Scripts/ultimateorion-core' ),
		};
		
		process.exit();
	}
	
	CompilePackage( path ) {
		return this.Compiler.CompilePackage( path );
	}
	
}

module.exports = US;
