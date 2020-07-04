class MainMenuGuest extends require( './MainMenu' ) {
	
	constructor( session ) {
		super( module.filename, session );

		this.MainMenu.Append( 'UI/BlockLabel', {
			Text: 'Welcome, Guest!',
		});
		
		this.MainMenu.Append( 'UI/Button', {
			Label: 'Login',
		})
			.On( 'click', () => {
				this.MainMenu.Disable();
				
				this.Login = this.AddElement( 'Window/Login', [ 'CC', 'CC' ], [ 0, 0 ], {})
					.On( 'close', () => {
						delete this.Login;
						this.MainMenu.Enable();
					})
					.On( 'success', ( data, event ) => {
						event.connection.Send( 'set_user_token', {
							token: data.token,
						})
					})
				;
				
			})
		;
		
		this.MainMenu.Append( 'UI/Button', {
			Label: 'Register',
		})
			.On( 'click', () => {
				this.MainMenu.Disable();
				
				this.Register = this.AddElement( 'Window/Register', [ 'CC', 'CC' ], [ 0, 0 ], {})
					.On( 'close', () => {
						delete this.Register;
						this.MainMenu.Enable();
					})
					.On( 'success', ( data, event ) => {
						event.connection.Send( 'set_user_token', {
							token: data.token,
						})
					})
				;
			})
		;

		this.AddMainMenuLinks();
	}
	
}

module.exports = MainMenuGuest;
