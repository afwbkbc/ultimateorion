class Input extends require( '../BlockElement' ) {
	
	constructor() {
		super( module.filename );
		
		this.SendAttributes( [ 'Value', 'MaxLength', 'Masked' ] );
		
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
		this.On( 'input', ( event ) => {
			this.SetAttribute( 'Value', event.value );
			this.Label.SetAttribute( 'Text', event.value );
		});
	}
	
}

module.exports = Input;
