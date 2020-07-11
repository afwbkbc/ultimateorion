class Settings extends require( './_Block' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttribute( 'BlockType', 'Settings' );
	}
	
	Prepare() {
		super.Prepare();
		
	}

}

module.exports = Settings;
