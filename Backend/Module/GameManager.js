class GameManager extends require( './_EntityManager' ) {
	
	constructor() {
		super( module.filename, 'Game/Game' );
		
	}
	
	CreateGame( game_name, game_host ) {
		return new Promise( ( next, fail ) => {
			this.Create({
				parameters: {
					Name: game_name,
					HostUser: game_host,
				},
			})
				.then( ( game ) => {
					console.log( '+GAME', game.Id );
					
					return next( game );
				})
				.catch( fail )
			;
		});
	}
	
	DestroyGame( game ) {
		if ( typeof( this.GamePool[ game.Id ] ) === 'undefined' )
			throw new Error( 'GamePool game #' + game.Id + ' does not exist' );
		console.log( '-GAME', game.Id );
		delete this.GamePool[ game.Id ];
		game.Destroy();
	}
	
	FindGame( id, options ) {
		return new Promise( ( next, fail ) => {
			this.Load( id, options )
				.then( next )
				.catch( fail )
			;
		});
	}
	
}

module.exports = GameManager;
