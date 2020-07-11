class MainMenuGuest extends require( './MainMenu' ) {

	constructor() {
		super( module.filename );
		
		
		this.SetAttributes({
			
		});
		
	}
	
	Prepare() {
		super.Prepare();
		
		this.Append( 'UI/BlockLabel', {
			Text: 'Welcome, ' + this.Viewport.Session.User.Username + '!',
		});
		
		this.Append( 'UI/Button', {
			Label: 'Create game',
		})
			.On( 'click', ( data, event ) => {
				this.Viewport.ShowWindow( 'Window/CreateGame' );
			})
		;
		
		this.Append( 'UI/Button', {
			Label: 'Join game',
		})
			.On( 'click', ( data, event ) => {
				this.Viewport.ShowWindow( 'Window/GameBrowser', {} );
			})
		;
		
		this.Append( 'UI/Button', {
			Label: 'Logout',
		})
			.On( 'click', ( data, event ) => {
				
				this.Module( 'Auth' ).RemoveUserToken( event.connection.UserToken, event.connection.RemoteAddress )
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

	}
	
}

module.exports = MainMenuGuest;
