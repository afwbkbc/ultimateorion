class Input extends require( '../BlockElement' ) {
	
	constructor() {
		super( module.filename );
		
		this.SetCoreClass( module.filename );
		
		this.SendAttributes( [ 'Value', 'MaxLength', 'Masked' ] );
		
		this.SetAttributes({
			Value: '',
			MaxLength: 32,
			FontSize: 40,
			Padding: 10,
		});
	}
	
	Prepare() {
		this.SetAttributes({
			Height: this.Attributes.FontSize + this.Attributes.Padding * 2,
		}, true);
		
		super.Prepare();
		
		this.Background = this.AddElement( 'Layout/Panel', [ 'LT', 'LT' ], [ 0, 0 ], {
			Style: 'input-background',
			Width: this.Attributes.Width,
			Height: this.Attributes.Height,
			HasBorder: true,
		});
		this.Label = this.AddElement( 'UI/Label', [ 'LT', 'LT' ], [ this.Attributes.Padding * 2, this.Attributes.Padding ], {
			Style: 'input-label',
			Text: this.Attributes.Value,
			FontSize: this.Attributes.FontSize,
		});
		this.On( 'input', ( event ) => {
			this.SetAttribute( 'Value', event.value );
			this.Label.SetAttribute( 'Text', event.value );
		});
	}
	
}

module.exports = Input;
