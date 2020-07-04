class Session extends require( '../_Base' ) {
	
	constructor( session_manager, id ) {
		super( module.filename );
		
		this.Id = id;
		this.SessionManager = session_manager;
		this.Connections = {};
		this.SessionTimeout = null;
	}
	
	Serialize() {
		// TODO
		var data = {
			//viewport: this.Viewport.Serialize(),
		}
		return JSON.stringify( data );
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
	
	Create() {
		console.log( '+SESSION #' + this.Id + ( this.User ? ' ( ' + this.User.Username + ' )' : '' ) );
		
		if ( this.OnCreate )
			this.OnCreate();
	}
	
	Destroy() {
		console.log( '-SESSION #' + this.Id + ( this.User ? ' ( ' + this.User.Username + ' )' : '' ) );
		
		if ( this.SessionTimeout )
			clearTimeout( this.SessionTimeout );
		
		if ( this.OnDestroy )
			this.OnDestroy();
	}
	
	Connect( connection ) {
		if ( this.SessionTimeout ) {
			clearTimeout( this.SessionTimeout );
			this.SessionTimeout = null;
		}
		if ( this.Viewport )
			this.Viewport.RenderRecursive( connection );
	}
	
	Disconnect( connection ) {
		if ( Object.keys( this.Connections ).length == 0 && !this.UserId ) {
			// no connections left, guest session will timeout
			if ( this.SessionTimeout )
				throw new Error( 'SessionTimeout already active', this.Id );
			
			this.SessionTimeout = setTimeout( () => {
				
				this.SessionTimeout = null;
				this.SessionManager.DestroySession( this );
			}, this.SessionManager.Config.GuestTimeout );
		}
	}
	
	Send( action, data, on_response ) {
		for ( var k in this.Connections )
			this.Connections[ k ].Send( action, data, on_response );
	}
}

module.exports = Session;
