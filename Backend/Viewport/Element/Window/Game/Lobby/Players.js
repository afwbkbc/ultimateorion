class Players extends require( './_Block' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttribute( 'BlockType', 'Players' );
	}
	
	Prepare() {
		super.Prepare();
		
	}

	AddPlayer( player ) {
		this.Rows.AddPlayer( player );
	}
	
	RemovePlayer( player ) {
		this.Rows.RemovePlayer( player );
	}
	
}

module.exports = Players;
