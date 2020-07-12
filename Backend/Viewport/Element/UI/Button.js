class Button extends require( '../BlockElement' ) {
	
	constructor() {
		super( module.filename );
		
		this.SendAttributes( [ 'Type', 'DefaultButton' ] );
		
		this.SetAttributes({
			Label: '',
			FontSize: 40,
			Padding: 10,
		});
	}
	
	Prepare() {
		if ( !this.Attributes.Height ) {
			this.SetAttributes({
				Height: this.Attributes.FontSize + this.Attributes.Padding * 2,
			}, true);
		}
		
		super.Prepare();
		
		this.Background = this.AddElement( 'Layout/Panel', [ 'LT', 'LT' ], [ 0, 0 ], {
			Style: 'button-background',
			Width: this.Attributes.Width,
			Height: this.Attributes.Height,
			HasBorder: true,
		});
		this.Label = this.AddElement( 'UI/Label', [ 'CC', 'CC' ], [ 0, 0 ], {
			Style: 'button-label',
			Text: this.Attributes.Label,
			FontSize: this.Attributes.FontSize,
		});
	}
	
}

module.exports = Button;
