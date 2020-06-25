class LoginWindow extends require( '../Layout/Window' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Title: 'Login',
			Style: 'main-menu-form',
			Width: 640,
			Height: 444,
		});
	}
	
	Prepare() {
		super.Prepare();
		
		this.Form = this.Body.AddElement( 'Form/LoginForm', [ 'LT', 'LT' ], [ 0, 0 ], {
			Width: this.Body.Attributes.Width,
			Height: this.Body.Attributes.Height,
		})
			.On( 'submit', ( data ) => {
				this.Disable();
				var fields = data.fields;
				var error = null;
				if ( !fields.username.length )
					error = [ 'username', 'Please enter username!' ];
				else if ( !fields.password.length )
					error = [ 'password', 'Please enter password!' ];
				if ( error ) {
					this.Error = this.Parent.AddElement( 'Window/ErrorWindow', [ 'CC', 'CC' ], [ 0, 0 ], {
						ErrorText: error[ 1 ],
					})
						.On( 'close', () => {
							this.Enable();
							this.Form.FocusField( error[ 0 ] );
						})
					;
				}
				else {
					this.Close();
					this.Trigger( 'success' );
				}
			})
		;

	}
	
}

module.exports = LoginWindow;
