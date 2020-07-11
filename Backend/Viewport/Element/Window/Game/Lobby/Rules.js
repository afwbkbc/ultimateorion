class Rules extends require( './_Block' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttribute( 'BlockType', 'Rules' );
	}
	
	Prepare() {
		super.Prepare();
		
	}

}

module.exports = Rules;
