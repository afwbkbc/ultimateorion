class Viewport extends require( './_ElementBase' ) {

	constructor( filename, session ) {
		super( filename );
		
		this.Session = session;
	}
	
}

module.exports = Viewport;
