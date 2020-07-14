class Game extends require( '../_Entity' ) {
	
	constructor( parameters ) {
		super( module.filename, parameters );
		
		this.GamesListRepository = 'Games_List';
		
		this.Players = {};

		this.MaxMessages = 128;
		this.Messages = [];
		
		this.GameState = 'lobby'; // always start from lobby

		this.GameStartMessage = 'Everybody is ready, starting game in... ';
		this.GameStartCountdown = 5;
		
		this.GameStartInterval = null;
		this.GameStartTimer = 0;
		
		this.PlayersListener = this.CreateListenerPool();
		this.PlayersListener
			.On( 'flag_change', ( data, event ) => {
				this.AddMessage( data.Source.User.Username + ' is ' + ( data.Value ? 'ready!' : 'not ready.' ) );
				this.ReadyCheck();
			})
		;
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
			
			data.Messages = this.Messages;
			
			return next( data );
		});
	}
	
	Unpack( data, options ) {
		return new Promise( ( next, fail ) => {
			
			if ( !data.Name || !data.GameState ) // mandatory fields
				return next( null );
			
			this.Name = data.Name;
			this.GameState = data.GameState;
			
			this.Messages = data.Messages ? data.Messages : [];
			
			this.Host = null; // will be fetched from players
			
			// players
			if ( data.Players && data.Players.length ) {
				
				//var deferred_players = [];
				
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
									this.AddPlayer( player );
									if ( player.Flags && player.Flags.is_host )
										this.Host = player;
									this.Trigger( 'player_add', {
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
							if ( player ) {
								this.Players[ player.Id ] = player;
							}
						}
						
						// find host
						for ( var k in this.Players ) {
							var player = this.Players[ k ];
							if ( player.Flags && player.Flags.is_host ) {
								//if ( this.Host )
									//return next( null ); // game can't have 2 hosts
								this.Host = player;
							}
						}
						
						// init all players
						for ( var k in this.Players )
							this.AddPlayer( this.Players[ k ], true );
						
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
			return next();
		});
	}
	
	OnCreate() {
		return new Promise( ( next, fail ) => {
			this.Log( this.HostUser.Session.Id, 'Game created', {
				Game: this.Id,
			});
			this.AddMessage( this.Name + ' created.' );
			//console.log( '+GAME #' + this.Id );
			
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

			//console.log( '-GAME #' + this.Id );
			
			// players can't exist without game
			for ( var k in this.Players ) {
				var player = this.Players[ k ];
				delete this.Players[ k ];
				player.Delete();
			}
			
			this.PlayersListener.Destroy();
			
			this.Trigger( 'destroy' );
			
			this.Repository.Remove( this )
				.then( () => {
					if ( this.Host ) {
						this.Log( this.Host.User.Session.Id, 'Game destroyed', {
							Game: this.Id,
						});
					}
					return next();
				})
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
					//console.log( 'GAME #' + this.Id + ' : ADD PLAYER #' + player.Id + ' ( ' + user.Username + ' )' );
					this.AddPlayer( player );
					this.Save()
						.then( () => {
							user.Session.AddToGame( this );
							
							if ( this.Host ) {
								this.Log( this.Host.User.Session.Id, 'Player joined game', {
									Game: this.Id,
									Player: player.Id,
									User: player.User.Username,
								});
							}
							this.AddMessage( player.User.Username + ' joined the game.' );
							
							this.Trigger( 'player_add', {
								Player: player,
							});
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
	
	RemovePlayerForUser( user ) {
		return new Promise( ( next, fail ) => {
			//console.log( 'REMOVEPLAYERFORUSER', user.ID );
			var player = null;
			for ( var k in this.Players ) {
				var p = this.Players[ k ];
				if ( p.User.ID == user.ID ) { // found
					player = p;
					break;
				}
			}
			
			if ( player ) {
				//console.log( 'GAME #' + this.Id + ' : REMOVE PLAYER #' + player.Id + ' ( ' + player.User.Username + ' )' );
				
				this.RemovePlayer( player );
				
				this.Trigger( 'player_leave', {
					Player: player,
				});
				this.ReadyCheck();
				
				if ( this.Host ) {
					this.Log( this.Host.User.Session.Id, 'Player left game', {
						Game: this.Id,
						Player: player.Id,
						User: player.User.Username,
					});
				}
				this.AddMessage( player.User.Username + ' left the game.' );
				
				this.Manager( 'Player' ).DeletePlayer( player )
					.then( () => {
						
						var player_ids = Object.keys( this.Players );
						var players_left = player_ids.length;
						if ( players_left == 0 ) { // no players left, destroy game
							this.Delete()
								.then( next )
								.catch( fail )
							;
						}
						else {
							this.Save()
								.then( () => {
									
									if ( player.Flags && player.Flags.is_host ) {
										// assign new game host as previous left
										var new_host_id = player_ids[ Math.floor( Math.random() * players_left ) ];
										var new_host = this.Players[ new_host_id ];
										
										this.Host = new_host;
										
										for ( var target_id of [ player.User.Session.Id, new_host.User.Session.Id ] ) {
											this.Log( target_id, 'Host transfered to another player', {
												From: {
													Player: player.Id,
													User: player.User.Username,
												},
												To: {
													Player: new_host.Id,
													User: new_host.User.Username,
												}
											});
										}
										this.AddMessage( new_host.User.Username + ' is now game host.' );
										if ( new_host.Flags )
											new_host.Flags = {};
										new_host.Flags.is_host = true;
										new_host.Save()
											.then( () => {
												this.Trigger( 'host_change', {
													Host: this.Host,
												});
												return next();
											})
											.catch( fail )
										;
									}
									else
										return next();
								})
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
			listener.Trigger( 'player_add', {
				Player: this.Players[ k ],
			});
		}
	}
	
	// formatted data for convenience
	GetTitleString() {
		return this.Name + ' (' + Object.keys( this.Players ).length + ')';
	}
	
	GetHostString() {
		return this.Host ? this.Host.User.Username : '';
	}
	
	AddMessage( text ) {
		this.Messages.push( text );
		if ( this.Messages.length > this.MaxMessages ) {
			this.Messages.splice( 0, 1 );
			this.Trigger( 'pop_message' );
		}
		this.Trigger( 'push_message', {
			Text: text,
		});
		this.Save();
	}
	
	GetMessages() {
		return this.Messages;
	}
	
	AddPlayer( player, force_init ) {
		if ( force_init || !this.Players[ player.Id ] ) {
			this.Players[ player.Id ] = player;
			this.PlayersListener.Add( player );
		}
	}
	
	RemovePlayer( player ) {
		if ( this.Players[ player.Id ] ) {
			this.PlayersListener.Remove( player );
			delete this.Players[ player.Id ];
		}
	}
	
	ReadyCheck() {
		// start game when everyone is ready
		var is_everyone_ready = true;
		for ( var k in this.Players ) {
			if ( !this.Players[ k ].Flags.is_ready ) {
				is_everyone_ready = false;
				break;
			}
		}
		if ( is_everyone_ready ) {
			if ( !this.GameStartInterval ) {
				this.GameStartTimer = this.GameStartCountdown;
				this.AddMessage( this.GameStartMessage + this.GameStartTimer );
				this.GameStartInterval = setInterval( () => {
					this.GameStartTimer--;
					this.AddMessage( ' '.repeat( this.GameStartMessage.length ) + this.GameStartTimer );
					if ( !this.GameStartTimer ) {
						clearInterval( this.GameStartInterval );
						this.GameStartInterval = null;
						
						this.Trigger( 'game_start' );
						this.Delete(); // TODO: START UNIVERSE!
						
					}
				}, 1000 );
			}
		}
		else {
			if ( this.GameStartInterval ) {
				clearInterval( this.GameStartInterval );
				this.GameStartInterval = null;
				this.AddMessage( 'Countdown canceled.' );
			}
		}
	}
}

module.exports = Game;
