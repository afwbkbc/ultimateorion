class PlayerManager extends require( './_EntityManager' ) {
	
	constructor() {
		super( module.filename, 'Game/Player' );
		
	}
	
	CreatePlayer( user, game, flags ) {
		return new Promise( ( next, fail ) => {
			this.Create({
				parameters:{
					User: user,
					Game: game,
					Flags: flags ? flags : {},
				}
			})
				.then( ( player ) => {
					this.Log( user.Session.Id, 'Player created', {
						Player: player.Id,
						Game: game.Id,
						User: user.Username,
					});
					return next( player );
				})
				.catch( fail )
			;
		});
	}
	
	DeletePlayer( player ) {
		return new Promise( ( next, fail ) => {
			this.Delete( player )
				.then( () => {
					this.Log( player.User.Session.Id, 'Player destroyed', {
						Player: player.Id,
						Game: player.Game.Id,
						User: player.User.Username,
					});
					return next();
				})
				.catch( fail )
			;
		});
	}
	
	FindPlayer( player_id, options ) {
		return new Promise( ( next, fail ) => {
			//console.log( 'FINDPLAYER', player_id, options );
			this.Load( player_id, options )
				.then( next )
				.catch( fail )
			;
		});
	}

}

module.exports = PlayerManager;
