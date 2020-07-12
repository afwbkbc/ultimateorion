class _Module extends require( '../_Base' ) {
	
	constructor( fname ) {
		super( fname );
		
		this.ModuleDeps = [];
	}
	
	DependsOn( dependencies ) {
		for ( var dep of dependencies )
			this.ModuleDeps.push( dep );
	}
	
	// dummy Init() to be overridden if needed
	Init() {
		return new Promise( ( next, fail ) => {
			
			return next();
		})
	}
	
}

module.exports = _Module;
