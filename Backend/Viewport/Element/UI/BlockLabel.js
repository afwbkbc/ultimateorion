class BlockLabel extends require( '../BlockElement' ) {
	
	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Text: '',
			Width: 0,
			Height: 0,
		});
	}
	
	Prepare() {
		this.Label = this.AddElement( 'UI/Label', [ 'CC', 'CC' ], [ 0, 0 ], {
			Text: this.Attributes.Text,
		});
	}
	
}

module.exports = BlockLabel;
