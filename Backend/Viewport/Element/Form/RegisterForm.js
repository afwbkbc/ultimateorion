class RegisterForm extends require( '../UI/Form' ) {
	
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
		this.AddInput( 'confirm', 'Confirm password', {
			masked: true,
		});
		this.AddSubmit( 'Create profile' );
	}
	
}

module.exports = RegisterForm;
