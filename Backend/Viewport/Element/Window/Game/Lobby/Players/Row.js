class Row extends require( '../../../../Layout/Panel' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			
		});
		
	}
	
	Prepare() {
		super.Prepare();
		
		// player name
		this.AddElement( 'UI/Label', [ 'LC', 'LC'], [ 20, 0 ], {
			Text: this.Attributes.Player.User.Username,
		});
		
		// race ( placeholder )
		this.AddElement( 'UI/Label', [ 'CC', 'CC'], [ 0, 0 ], {
			Text: 'Humans',
		});
		
		// ready / not ready
		this.AddElement( 'UI/Label', [ 'RC', 'RC'], [ -20, 0 ], {
			Text: 'Not ready',
		});
		
	}
	
}

module.exports = Row;
