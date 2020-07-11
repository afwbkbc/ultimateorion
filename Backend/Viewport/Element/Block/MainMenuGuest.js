class MainMenuGuest extends require( './MainMenu' ) {

	constructor() {
		super( module.filename );
		
		
		this.SetAttributes({

		});
		
	}
	
	Prepare() {
		super.Prepare();
		
		this.Append( 'UI/BlockLabel', {
			Text: 'Welcome, Guest!',
		});
		
		this.Append( 'UI/Button', {
			Label: 'Login',
		})
			.On( 'click', () => {
				
				this.Viewport.ShowWindow( 'Window/Login' )
					.On( 'success', ( data, event ) => {
						event.connection.Send( 'set_user_token', {
							token: data.token,
						})
					})
				;
				
			})
		;
		
		this.Append( 'UI/Button', {
			Label: 'Register',
		})
			.On( 'click', () => {
				
				this.Viewport.ShowWindow( 'Window/Register', [ 'CC', 'CC' ], [ 0, 0 ], {})
					.On( 'success', ( data, event ) => {
						event.connection.Send( 'set_user_token', {
							token: data.token,
						})
					})
				;
			})
		;

	}
	
}

module.exports = MainMenuGuest;
