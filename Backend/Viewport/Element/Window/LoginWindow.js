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
				this.E.M.Auth.LoginUser( data.fields )
					.then( ( error ) => {
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
					.catch( ( e ) => {
						throw e;
					})
				;
			})
		;

	}
	
}

module.exports = LoginWindow;
