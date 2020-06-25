class RegisterWindow extends require( '../Layout/Window' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Title: 'Registration',
			Style: 'main-menu-form',
			Width: 640,
			Height: 584,
		});
	}
	
	Prepare() {
		super.Prepare();
		
		this.Form = this.Body.AddElement( 'Form/RegisterForm', [ 'LT', 'LT' ], [ 0, 0 ], {
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
				else if ( !fields.confirm.length )
					error = [ 'confirm', 'Please confirm password!' ];
				else if ( fields.password != fields.confirm )
					error = [ 'confirm', 'Password confirmation doesn\'t match!' ];
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

module.exports = RegisterWindow;
