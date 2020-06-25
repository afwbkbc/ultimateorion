class ErrorWindow extends require( '../Layout/Window' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Title: 'Error',
			Style: 'error-popup',
			Width: 1200,
			Height: 200,
			ErrorText: 'Unspecified error!',
		});
	}
	
	Prepare() {
		super.Prepare();
		
		this.Body.AddElement( 'UI/Label', [ 'CC', 'CC' ], [ 0, 0 ], {
			Text: this.Attributes.ErrorText,
		});
	}
	
}

module.exports = ErrorWindow;
