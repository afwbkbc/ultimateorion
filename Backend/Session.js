class Session extends require( './_Entity' ) {
	
	constructor() {
		super( module.filename );
		
		this.Connections = {};
		this.SessionTimeout = null;
		
		this.Players = {}; // per-game instances of user
	}
	
	Pack() {
		return new Promise( ( next, fail ) => {
			var data = {};
			
			// viewport
			if ( this.Viewport ) {
				data.Viewport = {
					Classname: this.Viewport.Classname,
					Data: this.Viewport.Pack(),
				};
			}
			
			// players
			data.Players = [];
			for ( var k in this.Players )
				data.Players.push( this.Players[ k ].Id );
			
			// user
			if ( this.User )
				data.UserId = this.User.ID;
			
			return next( data );
		});
	}
	
	Unpack( data ) {
		return new Promise( ( next, fail ) => {
			
			var init_viewport = () => {
				if ( data.Viewport ) {
					this.Viewport = new ( this.H.Loader.Require( 'Viewport/Template/' + data.Viewport.Classname ) )( this );
					this.Viewport.Init();
					this.Viewport.Unpack( data.Viewport.Data );
				}
			}
			
			var done = () => {
				init_viewport();
				return next( this );
			}
			
			if ( data.UserId ) {
				
				// user
				this.Module( 'Auth' ).FindUser( data.UserId )
					.then( ( user ) => {
						if ( user ) {

							// user
							this.User = user;
							user.Session = this;
							
							// players
							if ( data.Players && data.Players.length ) {
								var promises = [];
								for ( var k in data.Players ) {
									var id = data.Players[ k ];
									promises.push( this.Manager( 'Player' ).FindPlayer( id, {
										parameters: {
											User: this.User,
										},
									}));
								}
								Promise.all( promises )
									.then( ( results ) => {
										for ( var k in results ) {
											var player = results[ k ];
											if ( player )
												this.Players[ player.Id ] = player;
										}
										
										return done();
									})
									.catch ( fail )
								;
							}
							else
								return done();
						}
						else
							return next( null );
					})
					.catch( fail )
				;
			}
			else
				return done();
		});
	}

	AddConnection( connection ) {
		if ( typeof( this.Connections[ connection.Id ] ) !== 'undefined' )
			throw new Error( 'Session connections collision at #' + connection.Id );
		console.log( '+CONNECTION', this.Id, connection.Id );
		this.Connections[ connection.Id ] = connection;
		this.Connect( connection );
	}
	
	RemoveConnection( connection ) {
		if ( typeof( this.Connections[ connection.Id ] ) === 'undefined' )
			throw new Error( 'Session connections invalid id #' + connection.Id );
		console.log( '-CONNECTION', this.Id, connection.Id );
		delete this.Connections[ connection.Id ];
		this.Disconnect( connection );
	}
	
	SetGuestId( connection, guest_id ) {
		if ( this.GuestId )
			throw new Error( 'GuestId already set', this.Id );
		console.log( '+GUESTID', this.Id, guest_id );
		this.GuestId = guest_id;
		connection.Send( 'set_guest_id', {
			guest_id: this.GuestId,
		});
	}
	
	Connect( connection ) {
		if ( this.SessionTimeout ) {
			clearTimeout( this.SessionTimeout );
			this.SessionTimeout = null;
		}
		//console.log( 'RENDER', this.Viewport );
		if ( this.Viewport )
			this.Viewport.RenderRecursive( connection );
	}
	
	Disconnect( connection ) {
		if ( Object.keys( this.Connections ).length == 0 ) {
			
			var session_timeout = this.User ? this.EntityManager.Config.UserSessionTimeout : this.EntityManager.Config.GuestSessionTimeout;
			
			// no connections left, session will timeout
			if ( this.SessionTimeout )
				throw new Error( 'SessionTimeout already active', this.Id );
				
			this.SessionTimeout = setTimeout( () => {
				this.SessionTimeout = null;
				this.EntityManager.DestroySession( this );
			}, session_timeout * 1000 );
		}
	}
	
	Send( action, data, on_response ) {
		for ( var k in this.Connections )
			this.Connections[ k ].Send( action, data, on_response );
	}
	
	AddToGame( game ) {
		return new Promise( ( next, fail ) => {
			
			// double-joining same game not allowed
			for ( var k in this.Players )
				if ( this.Players[ k ].Game.Id == game.Id )
					return next();
			
			game.AddPlayerForUser( this.User )
				.then( ( player ) => {
					//console.log( 'ADD TO GAME ' + player.User.Username + ' #' + game.Id );
					this.Players[ player.Id ] = player;
					this.Save()
						.then( next )
						.catch( fail )
					;
				})
				.catch( fail )
			;
		});
	}
	
	RemoveFromGame( game ) {
		return new Promise( ( next, fail ) => {
			
			// find relevant player and destroy it
			for ( var k in this.Players ) {
				var player = this.Players[ k ];
				if ( player.Game.Id == game.Id ) {
					//console.log( 'REMOVE FROM GAME ' + this.User.Username + ' #' + game.Id );
					delete this.Players[ k ];
					game.RemovePlayer( this.User )
						.then( () => {
							this.Save()
								.then( next )
								.catch( fail )
							;
						})
						.catch( fail )
					;
					return next();
				}
			}
			return next(); // no player found
		});
	}
	
	OnCreate() {
		return new Promise( ( next, fail ) => {
			
			if ( this.User )
				this.Viewport = new ( this.H.Loader.Require( 'Viewport/Template/MainMenuUser' ) )( this );
			else
				this.Viewport = new ( this.H.Loader.Require( 'Viewport/Template/MainMenuGuest' ) )( this );
			
			this.Viewport.Init();
			
			return next();
		});
	}
	
	OnDestroy() {
		return new Promise( ( next, fail ) => {
			
			if ( this.SessionTimeout )
				clearTimeout( this.SessionTimeout );
			
			if ( this.Viewport ) {
				this.Viewport.Destroy();
				delete this.Viewport;
			}
			
			return next();
		});
	}

	CreateGame( settings ) {
		return new Promise( ( next, fail ) => {
			this.Manager( 'Game' ).CreateGame( settings.name, this.User )
				.then( () => {
					
					return next();
				})
				.catch( fail )
			;
		});
	}
	
}

module.exports = Session;
