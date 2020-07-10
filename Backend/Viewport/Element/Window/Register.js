class Register extends require( '../Layout/Window' ) {

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
					Masked: true,
				});
				this.Form.AddInput( 'confirm', 'Confirm password', {
					Masked: true,
				});
				this.Form.AddSubmit( 'Create profile' );
			})
			.On( 'submit', ( data, event ) => {
				data.fields.remote_address = event.connection.RemoteAddress;
				this.DisableWhile( this.Module( 'Auth' ).RegisterUser( data.fields ) )
					.then( ( res ) => {
						if ( res.errors )
							this.Form.ShowErrors( res.errors );
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

module.exports = Register;
