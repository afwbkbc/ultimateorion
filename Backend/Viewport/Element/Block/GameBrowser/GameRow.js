class GameRow extends require( '../../Layout/Panel' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			
		});
	}
	
	Prepare() {
		
		this.AddElement( 'UI/Label', [ 'LC', 'LC' ], [ 20, 0 ], {
			Text: this.Attributes.Game.Name,
		});
		
		this.AddElement( 'UI/Label', [ 'LC', 'LC' ], [ 900, 0 ], {
			Text: this.Attributes.Game.Host.User.Username,
		});
		
		this.AddElement( 'UI/Button', [ 'RC', 'RC' ], [ -20, 0 ], {
			Width: 120,
			Height: 64,
			Label: 'Join',
		})
			.On( 'click', () => {
				console.log( 'JOIN', this.Attributes.Game.Id );
			})
		;
		
	}
	
}

module.exports = GameRow;
