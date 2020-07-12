class GameRow extends require( '../../Layout/Panel' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			
		});
	}
	
	Prepare() {
		
		this.GameName = this.AddElement( 'UI/Label', [ 'LC', 'LC' ], [ 20, 0 ], {
			Text: this.Attributes.Game.GetTitleString(),
		});
		
		this.GameHost = this.AddElement( 'UI/Label', [ 'LC', 'LC' ], [ 900, 0 ], {
			Text: this.Attributes.Game.GetHostString(),
		});
		
		this.AddElement( 'UI/Button', [ 'RC', 'RC' ], [ -20, 0 ], {
			Width: 120,
			Height: 64,
			Label: 'Join',
		})
			.On( 'click', () => {
				this.Trigger( 'join' );
			})
		;
		
		
		var update_text = () => {
			this.GameName.SetAttribute( 'Text', this.Attributes.Game.GetTitleString(), true );
		}
		
		var update_host_text = () => {
			this.GameHost.SetAttribute( 'Text', this.Attributes.Game.GetHostString(), true );
		}
		
		this.Listen( this.Attributes.Game )
			.On( 'player_join', update_text )
			.On( 'player_leave', update_text )
			.On( 'host_change', update_host_text )
		;
	}
	
}

module.exports = GameRow;
