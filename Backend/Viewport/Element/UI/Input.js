class Input extends require( '../Element' ) {
	
	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Value: '',
			MaxLength: 32,
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
		
		var that = this;
		this.On( 'input', ( event ) => {
			that.SetAttribute( 'Value', event.value );
			that.Label.SetAttribute( 'Text', event.value );
		});
	}
	
}

module.exports = Input;
