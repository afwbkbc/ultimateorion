class PlayerManager extends require( './_EntityManager' ) {
	
	constructor() {
		super( module.filename, 'Game/Player' );
		
	}
	
	CreatePlayer( user, game ) {
		return new Promise( ( next, fail ) => {
			this.Create({
				parameters:{
					User: user,
					Game: game,
				}
			})
				.then( ( player ) => {
					
					return next( player );
				})
				.catch( fail )
			;
		});
	}
	
	DeletePlayer( player ) {
		return new Promise( ( next, fail ) => {
			this.Delete( player )
				.then( next )
				.catch( fail )
			;
		});
	}
	
	FindPlayer( player_id, options ) {
		return new Promise( ( next, fail ) => {
			this.Load( player_id, options )
				.then( next )
				.catch( fail )
			;
		});
	}

}

module.exports = PlayerManager;
