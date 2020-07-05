class Session extends require( './_Entity' ) {
	
	constructor() {
		super( module.filename );
		
		this.Connections = {};
		this.SessionTimeout = null;
		
		this.UserModel = require( './Model/User' );
		
		this.Players = {}; // per-game instances of user
	}
	
	Pack() {
		return new Promise( ( next, fail ) => {
			var data = {};
			
			if ( this.User )
				data.UserId = this.User.ID;
			
			if ( this.Viewport ) {
				data.Viewport = {
					classname: this.Viewport.Classname,
					data: this.Viewport.Pack(),
				};
			}
			
			return next( data );
		});
	}
	
	Unpack( data ) {
		return new Promise( ( next, fail ) => {
			if ( data.UserId ) {
				this.UserModel.FindOne({
					ID: data.UserId,
				})
					.then( ( user ) => {
						if ( user ) {
							
							if ( data.Viewport ) {
								// 
							}
							
							this.User = user;
							return next( this );
						}
						else
							return next( null );
					})
					.catch( fail )
				;
			}
			else
				return next( this );
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
			
			if ( this.User ) {
				// TODO
			}
			else {
				// no connections left, guest session will timeout
				if ( this.SessionTimeout )
					throw new Error( 'SessionTimeout already active', this.Id );
				
				this.SessionTimeout = setTimeout( () => {
					this.SessionTimeout = null;
					this.Manager.DestroySession( this );
				}, this.Manager.Config.GuestTimeout * 1000 );
			}
			
		}
	}
	
	Send( action, data, on_response ) {
		for ( var k in this.Connections )
			this.Connections[ k ].Send( action, data, on_response );
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
		if ( this.User )
			this.Viewport = new ( this.H.Loader.Require( 'Viewport/Template/MainMenuUser' ) )( this );
		else
			this.Viewport = new ( this.H.Loader.Require( 'Viewport/Template/MainMenuGuest' ) )( this );
		this.Viewport.Init();
	}
	
	OnDestroy() {
		
		// save to DB
		//var data = this.Serialize();
		//console.log( 'DATA', data );
		
		if ( this.SessionTimeout )
			clearTimeout( this.SessionTimeout );
		
		this.Viewport.Destroy();
		delete this.Viewport;
	}

	CreateGame( settings ) {
		return new Promise( ( next, fail ) => {
			this.E.M.GameManager.CreateGame( settings.name, this.User )
				.then( () => {
					
					return next();
				})
				.catch( fail )
			;
		});
	}
	
}

module.exports = Session;
