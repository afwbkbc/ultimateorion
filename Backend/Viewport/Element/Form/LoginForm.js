class LoginForm extends require( '../UI/Form' ) {
	
	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			
		});
	}
	
	Prepare() {
		this.AddInput( 'username', 'Username' );
		this.AddInput( 'password', 'Password', {
			masked: true,
		});
		this.AddSubmit( 'Login' );
	}
	
}

module.exports = LoginForm;
