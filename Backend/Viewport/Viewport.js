class Viewport extends require( './_ElementBase' ) {

	constructor( filename, session ) {
		super( filename );
		
		this.Session = session;
	}
	
	Destroy() {
		this.OnDestroyRecursive();
	}
	
}

module.exports = Viewport;
