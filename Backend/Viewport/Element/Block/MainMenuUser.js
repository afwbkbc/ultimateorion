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
				this.Disable();
				
				this.CreateGame = this.Viewport.AddElement( 'Window/CreateGame', [ 'CC', 'CC' ], [ 0, 0 ], {})
					.On( 'close', () => {
						delete this.CreateGame;
						this.Enable();
					})
					.On( 'success', ( data, event ) => {
						this.CreateGame.Close();
						this.Parent.UpdateGamesList();
					})
				;
			})
		;
		
		this.Append( 'UI/Button', {
			Label: 'Join game',
		});
		
		this.Append( 'UI/Button', {
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

	}
	
}

module.exports = MainMenuGuest;
