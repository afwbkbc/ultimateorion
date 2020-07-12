class GameRow extends require( '../../Layout/Panel' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			
		});
	}
	
	Prepare() {
		
		super.Prepare();
		
		this.Label = this.AddElement( 'UI/Label', [ 'LC', 'LC' ], [ 14, 0 ], {
			Text: this.Attributes.Game.GetTitleString(),
			FontSize: 34,
		});
		
		this.AddElement( 'UI/Button', [ 'RC', 'RC' ], [ -14, 0 ], {
			Width: 100,
			FontSize: 34,
			Padding: 4,
			Label: 'Play',
		})
			.On( 'click', () => {
				this.Viewport.ShowWindow( 'Window/Game', {
					Game: this.Attributes.Game,
				});
			})
		;
		
		var update_text = () => {
			this.Label.SetAttribute( 'Text', this.Attributes.Game.GetTitleString(), true );
		}
		
		this.Listen( this.Attributes.Game )
			.On( 'player_join', update_text )
			.On( 'player_leave', update_text )
		;
	}
	
}

module.exports = GameRow;
