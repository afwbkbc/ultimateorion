class Row extends require( '../../../../Layout/Panel' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			
		});
		
	}
	
	Prepare() {
		super.Prepare();
		
		var player = this.Attributes.Player;
		var flags = player.GetFlags();
		
		// player name
		this.AddElement( 'UI/Label', [ 'LC', 'LC'], [ 20, 0 ], {
			Text: player.User.Username,
		});
		
		// race ( placeholder )
		this.AddElement( 'UI/Label', [ 'CC', 'CC'], [ 0, 0 ], {
			Text: 'Humans',
		});
		
		// ready / not ready
		this.ReadyText = this.AddElement( 'UI/Label', [ 'RC', 'RC'], [ -20, 0 ], {
			Text: flags.is_ready ? 'Ready' : 'Not ready',
		});
		
		this.Listen( player )
			.On( 'flag_change', ( data ) => {
				if ( data.Key == 'is_ready' )
					this.ReadyText.SetAttribute( 'Text', data.Value ? 'Ready' : 'Not ready', true );
			})
		;
		
	}
	
}

module.exports = Row;
