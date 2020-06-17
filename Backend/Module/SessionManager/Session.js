class Session extends require( '../../_Base' ) {
	
	constructor( session_manager, id ) {
		super( module.filename );
		
		this.Id = id;
		this.SessionManager = session_manager;
		this.Connections = {};
		
		this.State = 'auth';
	}
	
	AddConnection( connection ) {
		if ( typeof( this.Connections[ connection.Id ] ) !== 'undefined' ) {
			// something's very wrong
			throw new Error( 'Session connections collision at #' + connection.Id );
		}
		console.log( '+CONNECTION', this.Id, connection.Id );
		this.Connections[ connection.Id ] = connection;
		this.OnConnect( connection );
	}
	
	RemoveConnection( connection ) {
		if ( typeof( this.Connections[ connection.Id ] ) === 'undefined' ) {
			// something's very wrong
			throw new Error( 'Session connections invalid id #' + connection.Id );
		}
		console.log( '-CONNECTION', this.Id, connection.Id );
		this.OnDisconnect( connection );
		delete this.Connections[ connection.Id ];
	}
	
	SetGuestId( guest_id ) {
		if ( this.GuestId )
			throw new Error( 'GuestId already set', this.Id );
		console.log( '+GUESTID', this.Id, guest_id );
		this.GuestId = guest_id;
	}
	
	OnCreate() {
		console.log( 'session create', this.Id );
	}
	
	OnDestroy() {
		console.log( 'session destroy', this.Id );
	}
	
	OnConnect( connection ) {
		if ( this.GuestId )
			connection.Send( 'set_guest_id', {
				guest_id: this.GuestId,
			});
	}
	
	OnDisconnect( connection ) {
		/*if ( Object.keys( this.Connections ).length == 0 && !this.UserId )
			this.SessionManager.DestroySession( this );*/
	}
	
	Send( action, data, on_response ) {
		for ( var k in this.Connections )
			this.Connections[ k ].Send( action, data, on_response );
	}
}

module.exports = Session;
