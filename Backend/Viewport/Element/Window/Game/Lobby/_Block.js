class Block extends require( '../../../Layout/Panel' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			HasBorder: true,
		});
	}
	
	Prepare() {
		super.Prepare();
		
		this.Label = this.AddElement( 'UI/Label', [ 'CT', 'CT' ], [ 0, 14 ], {
			Text: this.Attributes.BlockType.toUpperCase(),
		});
		
		this.Rows = this.AddElement( 'Window/Game/Lobby/' + this.Attributes.BlockType + '/Rows', [ 'LT', 'LT' ], [ 0, 60 ], {
			Width: this.Attributes.Width,
			Height: this.Attributes.Height - 60,
		});
	}

}

module.exports = Block;
