class _Module extends require( '../_Base' ) {
	
	constructor( fname ) {
		super( fname );
		
	}
	
	// dummy Init() to be overridden if needed
	Init() {
		return new Promise( ( next, fail ) => {
			
			return next();
		})
	}
	
}

module.exports = _Module;
