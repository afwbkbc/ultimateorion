class Session extends require( '../../_Base' ) {
	
	constructor( session_manager, id ) {
		super( module.filename );
		
		this.Id = id;
		this.SessionManager = session_manager;
		this.Connections = {};
		this.SessionTimeout = null;
		
		this.State = 'auth';
	}
	
	AddConnection( connection ) {
		if ( typeof( this.Connections[ connection.Id ] ) !== 'undefined' )
			throw new Error( 'Session connections collision at #' + connection.Id );
		console.log( '+CONNECTION', this.Id, connection.Id );
		this.Connections[ connection.Id ] = connection;
		this.OnConnect( connection );
	}
	
	RemoveConnection( connection ) {
		if ( typeof( this.Connections[ connection.Id ] ) === 'undefined' )
			throw new Error( 'Session connections invalid id #' + connection.Id );
		console.log( '-CONNECTION', this.Id, connection.Id );
		delete this.Connections[ connection.Id ];
		this.OnDisconnect( connection );
	}
	
	SetGuestId( guest_id ) {
		if ( this.GuestId )
			throw new Error( 'GuestId already set', this.Id );
		console.log( '+GUESTID', this.Id, guest_id );
		this.GuestId = guest_id;
	}
	
	OnCreate() {
		console.log( '+SESSION #' + this.Id );
		
		this.Viewport = new ( this.H.Loader.Require( 'Viewport/Template/TestViewport' ) )( this );
		//this.Viewport = new ( this.H.Loader.Require( 'Viewport/Viewport' ) )( this );
	}
	
	OnDestroy() {
		console.log( '-SESSION #' + this.Id );
		
		if ( this.SessionTimeout )
			clearTimeout( this.SessionTimeout );
		
		this.Viewport.Destroy();
		delete this.Viewport;
	}
	
	OnConnect( connection ) {
		if ( this.SessionTimeout ) {
			clearTimeout( this.SessionTimeout );
			this.SessionTimeout = null;
		}
		if ( this.GuestId ) {
			connection.Send( 'set_guest_id', {
				guest_id: this.GuestId,
			});
		}
		this.Viewport.RenderRecursive( connection );
	}
	
	OnDisconnect( connection ) {
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
