class Game extends require( '../_Entity' ) {
	
	constructor( parameters ) {
		super( module.filename, parameters );
		
		this.GamesListRepository = 'Games_List';
		
		this.Players = {};
		
		this.GameState = 'lobby';
	}
	
	Pack() {
		return new Promise( ( next, fail ) => {
			
			var data = {
				Name: this.Name,
				GameState: this.GameState,
			};
			
			// players
			data.Players = [];
			for ( var k in this.Players )
				data.Players.push( this.Players[ k ].Id );
			
			return next( data );
		});
	}
	
	Unpack( data ) {
		return new Promise( ( next, fail ) => {
			
			if ( !data.Name || !data.GameState ) // mandatory fields
				return next( null );
			
			this.Name = data.Name;
			this.GameState = data.GameState;
			
			this.Host = null; // will be fetched from players
			
			// players
			if ( data.Players && data.Players.length ) {
				var promises = [];
				for ( var k in data.Players ) {
					var id = data.Players[ k ];
					if ( !this.Players[ id ] ) {
						promises.push( this.Manager( 'Player' ).FindPlayer( id, {
							parameters: {
								Game: this,
							},
						}));
					}
				}
				Promise.all( promises )
					.then( ( results ) => {
						for ( var k in results ) {
							var player = results[ k ];
							if ( player )
								this.Players[ player.Id ] = player;
						}
						
						// find host
						for ( var k in this.Players ) {
							var player = this.Players[ k ];
							if ( player.Flags.is_host ) {
								if ( this.Host )
									return next( null ); // game can't have 2 hosts
								this.Host = player;
							}
						}
						if ( !this.Host && this.GameState == 'lobby' )
							return next( null ); // game can't be without host while in lobby
						
						return next( this );
					})
					.catch ( fail )
				;
			}
			else
				return next( this );
			
		});
	}
	
	OnCreate() {
		return new Promise( ( next, fail ) => {
			console.log( '+GAME #' + this.Id );
			
			this.AddPlayer( this.HostUser, {
				is_host: true,
			})
				.then( ( player ) => {
					this.Host = player; // set reference to host player
					delete this.HostUser; // not needed anymore
					
					this.Host.User.Session.AddToGame( this );
					
					this.GetRepository( this.GamesListRepository )
						.then( ( repository ) => {
							repository.Insert( this )
								.then( next )
								.catch( fail )
							;
						})
						.catch( fail )
					;
				})
				.catch( fail )
			;
		});
	}
	
	OnDestroy() {
		return new Promise( ( next, fail ) => {
			
			console.log( '-GAME #' + this.Id );
			
			this.GetRepository( this.GamesListRepository )
				.then( ( repository ) => {
					repository.Remove( this )
						.then( next )
						.catch( fail )
					;
				})
				.catch( fail )
			;
			
		});
	}
	
	AddPlayer( user, flags ) {
		return new Promise( ( next, fail ) => {
			
			for ( var k in this.Players ) {
				var player = this.Players[ k ];
				if ( player.User.ID == user.ID )
					return next( player ); // already added
			}
			
			this.Manager( 'Player' ).CreatePlayer( user, this, flags )
				.then( ( player ) => {
					console.log( 'GAME #' + this.Id + ' : ADD PLAYER #' + player.Id + ' ( ' + user.Username + ' )' );
					this.Players[ player.Id ] = player;
					this.Save()
						.then( () => {
							return next( player );
						})
						.catch( fail )
					;
				})
				.catch( fail )
			;
		});
	}
	
	RemovePlayer( user ) {
		return new Promise( ( next, fail ) => {
			var player = this.Players[ user.Id ];
			if ( player ) {
				console.log( 'GAME #' + this.Id + ' : REMOVE PLAYER #' + player.Id + ' ( ' + player.User.Username + ' )' );
				
				this.Manager( 'Player' ).DeletePlayer( player )
					.then( () => {
						delete this.Players[ user.Id ];
						
						this.Trigger( 'player_leave', {
							Player: player,
						});
						
						if ( Object.keys( this.Players ).length == 0 ) { // no players left, delete game
							this.Delete()
								.then( next )
								.catch( fail )
							;
						}
						else {
							this.Save()
								.then( next )
								.catch( fail )
							;
						}
					})
					.catch( fail )
				;
			}
			else
				return next();
		});
	}
	
	FindPlayerForUser( user ) {
		for ( var k in this.Players ) {
			var player = this.Players[ k ];
			if ( player.User.ID == user.ID )
				return player;
		}
		return null;
	}
	
	OnListen( listener ) {
		for ( var k in this.Players ) {
			listener.Trigger( 'player_join', {
				Player: this.Players[ k ],
			});
		}
	}
	
}

module.exports = Game;
