class GameRow extends require( '../../Layout/Panel' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			
		});
	}
	
	Prepare() {
		super.Prepare();
		
		this.Game = this.Attributes.Game;
		if ( !this.Game || this.Game.GameState != 'lobby' ) { // can only join on lobby stage
			this.Parent.RemoveElement( this );
			return;
		}
		
		this.GameName = this.AddElement( 'UI/Label', [ 'LC', 'LC' ], [ 20, 0 ], {
			Text: this.Game.GetTitleString(),
		});
		
		this.GameHost = this.AddElement( 'UI/Label', [ 'LC', 'LC' ], [ 900, 0 ], {
			Text: this.Game.GetHostString(),
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
			this.GameName.SetAttribute( 'Text', this.Game.GetTitleString(), true );
		}
		
		var update_host_text = () => {
			this.GameHost.SetAttribute( 'Text', this.Game.GetHostString(), true );
		}
		
		this.Listen( this.Game )
			.On( 'player_join', update_text )
			.On( 'player_leave', update_text )
			.On( 'host_change', update_host_text )
		;
	}
	
}

module.exports = GameRow;
