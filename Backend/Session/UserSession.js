class UserSession extends require( './Session' ) {
	
	constructor( session_manager, id ) {
		super( session_manager, id );
		
		this.Players = {}; // per-game instances of user
	}
	
	AddToGame( game ) {
		if ( !this.Players[ game.Id ] ) {
			game.AddPlayer( this.User );
			var player = game.GetPlayer( this.User );
			console.log( 'ADD TO GAME ' + player.User.Username + ' #' + game.Id );
			this.Players[ game.Id ] = player;
		}
	}
	
	RemoveFromGame( game ) {
		if ( this.Players[ game.Id ] ) {
			console.log( 'REMOVE FROM GAME ' + this.User.Username + ' #' + game.Id );
			delete this.Players[ game.Id ];
			game.RemovePlayer( this.User );
		}
	}
	
	OnCreate() {
		this.Viewport = new ( this.H.Loader.Require( 'Viewport/Template/MainMenuUser' ) )( this );
	}
	
	OnDestroy() {
		
		// save to DB
		var data = this.Serialize();
		console.log( 'DATA', data );
		
		this.Viewport.Destroy();
		delete this.Viewport;
	}

	CreateGame( settings ) {
		return new Promise( ( next, fail ) => {
			this.E.M.GameManager.CreateGame( settings.name, this.User );
			
			return next();
		});
	}
}

module.exports = UserSession;
