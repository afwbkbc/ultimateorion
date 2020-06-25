class LoginForm extends require( '../Element' ) {
	
	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Width: 300,
			Height: 250,
		});
	}
	
	Prepare() {
		
	}
	
}

module.exports = LoginForm;
