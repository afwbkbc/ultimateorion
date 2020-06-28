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
				this.E.M.Auth.RegisterUser( data.fields )
					.then( ( err ) => {
						if ( err ) {
							this.Error = this.Parent.AddElement( 'Window/ErrorWindow', [ 'CC', 'CC' ], [ 0, 0 ], {
								ErrorText: err[ 1 ],
							})
								.On( 'close', () => {
									this.Enable();
									this.Form.FocusField( err[ 0 ] );
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

module.exports = RegisterWindow;
