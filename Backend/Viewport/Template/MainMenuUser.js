class MainMenuUser extends require( './MainMenu' ) {
	
	constructor( session ) {
		super( module.filename, session );

		this.MainMenu.Append( 'UI/BlockLabel', {
			Text: 'Welcome, ' + this.Session.User.Username + '!',
		});
		
		this.MainMenu.Append( 'UI/Button', {
			Label: 'Create game',
		})
			.On( 'click', ( data, event ) => {
				this.MainMenu.Disable();
				
				this.CreateGame = this.AddElement( 'Window/CreateGame', [ 'CC', 'CC' ], [ 0, 0 ], {})
					.On( 'close', () => {
						delete this.CreateGame;
						this.MainMenu.Enable();
					})
					.On( 'success', ( data, event ) => {
						console.log( 'GAME CREATED CALLBACK' );
						this.UpdateGamesList();
					})
				;
			})
		;
		
		this.MainMenu.Append( 'UI/Button', {
			Label: 'Join game',
		});
		
		this.MainMenu.Append( 'UI/Button', {
			Label: 'Logout',
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
		
		this.UpdateGamesList();
		
	}
	
	UpdateGamesList() {
		if ( Object.keys( this.Session.Players ).length > 0 ) {
			
			console.log( this.Session.Players );
			if ( !this.GamesList ) {
				this.GamesList = this.AddElement( 'Layout/Panel', [ 'LB', 'LB' ], [ 50, -50 ], {
					Style: 'main-menu-block',
					Width: 640,
					Height: 220,
				});
				
				this.GamesList.AddElement( 'UI/Label', [ 'CT', 'CT' ], [ 0, 30 ], {
					Text: 'Your active games:',
				});

			}
			
		}
		else {
			if ( this.GamesList ) {
				this.RemoveElement( this.GamesList );
				delete this.GamesList;
			}
		}
	}
	
}

module.exports = MainMenuUser;
