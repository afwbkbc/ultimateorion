class Format extends require( './_Helper' ) {
	
	constructor() {
		super( module.filename );
		
		this.DateFormat = require( 'dateformat' );
	}
	
	Date( date, format ) {
		return this.DateFormat( date, format );
	}

}

module.exports = Format;
