class Button extends require( '../Element' ) {
	
	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Label: '',
		});
	}
	
	Prepare() {
		this.Background = this.AddElement( 'Layout/Panel', [ 'LT', 'LT' ], [ 0, 0 ], {
			Style: 'button-background',
			Width: this.Attributes.Width,
			Height: this.Attributes.Height,
		});
		this.Label = this.AddElement( 'UI/Label', [ 'CC', 'CC' ], [ 0, 0 ], {
			Style: 'button-label',
			Text: this.Attributes.Label,
		});
	}
	
}

module.exports = Button;
