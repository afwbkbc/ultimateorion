class GameManager extends require( './_EntityManager' ) {
	
	constructor() {
		super( module.filename, 'Game/Game' );
		
	}
	
	CreateGame( game_name, game_host ) {
		return new Promise( ( next, fail ) => {
			this.Create({
				parameters: {
					Name: game_name,
					Host: game_host,
				},
			})
				.then( ( game ) => {
					//console.log( 'CREATED', game );
					
					return next();
				})
				.catch( fail )
			;
			return; // tmp
			this.GamePool[ game.Id ] = game;
			console.log( '+GAME', game.Id );
			return game;
		});
	}
	
	DestroyGame( game ) {
		if ( typeof( this.GamePool[ game.Id ] ) === 'undefined' )
			throw new Error( 'GamePool game #' + game.Id + ' does not exist' );
		console.log( '-GAME', game.Id );
		delete this.GamePool[ game.Id ];
		game.Destroy();
	}
	
}

module.exports = GameManager;
