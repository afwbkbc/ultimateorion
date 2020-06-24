class Input extends require( '../Element' ) {
	
	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Value: '',
		});
	}
	
	Prepare() {
		this.Background = this.AddElement( 'Layout/Panel', [ 'LT', 'LT' ], [ 0, 0 ], {
			Style: 'input-background',
			Width: this.Attributes.Width,
			Height: this.Attributes.Height,
		});
		this.Label = this.AddElement( 'UI/Label', [ 'LC', 'LC' ], [ 26, 0 ], {
			Style: 'input-label',
			Text: this.Attributes.Value,
		});
	}
	
}

module.exports = Input;
