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
	
	Unpack( data, options ) {
		return new Promise( ( next, fail ) => {
			
			if ( !data.Name || !data.GameState ) // mandatory fields
				return next( null );
			
			this.Name = data.Name;
			this.GameState = data.GameState;
			
			this.Host = null; // will be fetched from players
			
			// players
			if ( data.Players && data.Players.length ) {
				
				var deferred_players = [];
				
				var p = {
					caller: this.Id,
					parameters: {
						Game: this,
					},
					on_before_deadlock: ( obj ) => {
						//console.log( 'G BEFOREDEADLOCK', obj );
						//deferred_players.push( new this.G.DeferredEntity( obj.EntityId ) );
					},
					on_after_deadlock: ( obj ) => {
						//console.log( 'G AFTERDEADLOCK', obj );
						this.Manager( 'Player' ).FindPlayer( obj.EntityId, p )
							.then( ( player ) => {
								if ( player ) {
									this.Players[ player.Id ] = player;
									if ( player.Flags.is_host )
										this.Host = player;
									this.Trigger( 'player_join', {
										Player: player,
									});
									this.Save();
								}
							})
					},
				};
				
				var promises = [];
				for ( var k in data.Players ) {
					var id = data.Players[ k ];
					if ( !this.Players[ id ] ) {
						promises.push( this.Manager( 'Player' ).FindPlayer( id, p ) );
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
								//if ( this.Host )
									//return next( null ); // game can't have 2 hosts
								this.Host = player;
							}
						}
						//if ( !this.Host && this.GameState == 'lobby' )
							//return next( null ); // game can't be without host while in lobby
						
						return next( this );
					})
					.catch ( fail )
				;
			}
			else
				return next( this );
			
		});
	}
	
	OnInit( options ) {
		return new Promise( ( next, fail ) => {
			var done = ( repository ) => {
				this.Repository = repository;
				this.TriggerRepositories.push( this.Repository ); // to duplicate events there
				//console.log( 'GAME ONINIT DONE', this.Id );
				return next();
			}
			//console.log( 'GAME ONINIT', this.Id, options );
			if( options && options.parameters && options.parameters.Repository )
				return done( options.parameters.Repository );
			
			this.GetRepository( 'Games_List', {
				caller: this.Id,
				parameters: {
					Entities: {
						[ this.Id ]: this,
					},
				},
				/*on_before_deadlock: ( obj ) => {
					console.log( 'BEFOREDEADLOCK', obj );
				},
				on_after_deadlock: ( obj ) => {
					console.log( 'AFTERDEADLOCK', obj );
				},*/
			})
				.then( done )
				.catch( fail )
			;
		});
	}
	
	OnDeinit() {
		return new Promise( ( next, fail ) => {
			this.Repository = null;
			this.TriggerRepositories = [];
		});
	}
	
	OnCreate() {
		return new Promise( ( next, fail ) => {
			console.log( '+GAME #' + this.Id );
			
			this.AddPlayerForUser( this.HostUser, {
				is_host: true,
			})
				.then( ( player ) => {
					this.Host = player; // set reference to host player
					delete this.HostUser; // not needed anymore
					this.Repository.Insert( this )
						.then( () => {
							return next();
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
			
			this.Repository.Remove( this )
				.then( next )
				.catch( fail )
			;
			
		});
	}
	
	AddPlayerForUser( user, flags ) {
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
							user.Session.AddToGame( this );
							
							this.Trigger( 'player_join', {
								Player: player,
							});

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
				
				this.Trigger( 'player_leave', {
					Player: player,
				});
				
				this.Manager( 'Player' ).DeletePlayer( player )
					.then( () => {
						delete this.Players[ user.Id ];
						
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
