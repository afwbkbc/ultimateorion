class MainMenuUser extends require( './MainMenu' ) {
	
	constructor( session ) {
		super( module.filename, session );

		this.MainMenu = this.AddElement( 'Layout/Panel', [ 'RB', 'RB' ], [ -50, -50 ], {
			Style: 'main-menu-block',
			Width: 440,
			Height: 420,
		});
		
		this.MainMenu.AddElement( 'UI/Label', [ 'CT', 'CT' ], [ 0, 30 ], {
			Text: 'Welcome, ' + this.Session.User.Username + '!',
		});
		
		this.MainMenu.AddElement( 'UI/Button', [ 'CT', 'CT' ], [ 0, 96 ], {
			Label: 'Create game',
			Width: 400,
			Height: 64,
		});
		
		this.MainMenu.AddElement( 'UI/Button', [ 'CT', 'CT' ], [ 0, 176 ], {
			Label: 'Join game',
			Width: 400,
			Height: 64,
		});
		
		this.MainMenu.AddElement( 'UI/Button', [ 'CB', 'CB' ], [ 0, -100 ], {
			Label: 'Logout',
			Width: 400,
			Height: 64,
		})
			.On( 'click', ( data, event ) => {
				
				this.E.M.Auth.RemoveUserToken( event.connection.UserToken, event.connection.RemoteAddress )
					.then( () => {
						event.connection.Send( 'clear_user_token', {
							token: data.token,
						});
					})
					.catch( ( e ) => {
						throw e;
					})
				;
			})
		;
		
		this.AddMainMenuLinks();
		
	}
	
}

module.exports = MainMenuUser;
