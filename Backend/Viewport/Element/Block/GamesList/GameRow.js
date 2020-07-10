class GameRow extends require( '../../Layout/Panel' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			
		});
	}
	
	Prepare() {
		
		this.AddElement( 'UI/Label', [ 'LC', 'LC' ], [ 14, 0 ], {
			Text: this.Attributes.GameName,
		});
		this.AddElement( 'UI/Button', [ 'RC', 'RC' ], [ -14, 0 ], {
			Width: 120,
			Height: 46,
			Label: 'Play',
		})
			.On( 'click', () => {
				console.log( 'PLAY', this.Attributes.GameId );
			})
		;
		
	}
	
}

module.exports = GameRow;
