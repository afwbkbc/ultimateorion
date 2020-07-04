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
		
		this.Form = this.Body.AddElement( 'UI/Form', [ 'LT', 'LT' ], [ 0, 0 ], {
			Width: this.Body.Attributes.Width,
			Height: this.Body.Attributes.Height,
		})
			.On( 'prepare', () => {
				this.Form.AddInput( 'username', 'Username' );
				this.Form.AddInput( 'password', 'Password', {
					masked: true,
				});
				this.Form.AddInput( 'confirm', 'Confirm password', {
					masked: true,
				});
				this.Form.AddSubmit( 'Create profile' );
			})
			.On( 'submit', ( data, event ) => {
				this.Disable();
				data.fields.remote_address = event.connection.RemoteAddress;
				this.E.M.Auth.RegisterUser( data.fields )
					.then( ( res ) => {
						if ( res.error ) {
							this.Error = this.Parent.AddElement( 'Window/ErrorWindow', [ 'CC', 'CC' ], [ 0, 0 ], {
								ErrorText: res.error[ 1 ],
							})
								.On( 'close', () => {
									this.Enable();
									this.Form.FocusField( res.error[ 0 ] );
								})
							;
						}
						else {
							this.Close();
							this.Trigger( 'success', {
								token: res.token,
							}, event );
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

module.exports = RegisterWindow;
