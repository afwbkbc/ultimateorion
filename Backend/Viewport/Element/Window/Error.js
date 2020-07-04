class Error extends require( '../Layout/Window' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Title: 'Error',
			Style: 'error-popup',
			Width: 1200,
			Height: 270,
			ErrorText: 'Unspecified error!',
		});
	}
	
	Prepare() {
		super.Prepare();
		
		this.Body.AddElement( 'UI/Label', [ 'CT', 'CT' ], [ 0, 40 ], {
			Text: this.Attributes.ErrorText,
		});
		
		this.Body.AddElement( 'UI/Button', [ 'CB', 'CB' ], [ 0, -40 ], {
			DefaultButton: true,
			Width: 300,
			Height: 70,
			Label: 'OK',
		})
			.On( 'click', () => {
				this.Close();
			})
		;
	}
	
}

module.exports = Error;
