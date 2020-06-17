class SessionManager extends require( '../_Module' ) {
	
	constructor() {
		super( module.filename );
		
		this.Md5 = require( 'md5' );
		this.Session = require( './Session' );
		
		this.SessionPool = {};
		this.NextSessionId = 0;
		
		this.GuestSessions = {};
	}
	
	CreateSession() {
		var session_id = ++this.NextSessionId;
		if ( typeof( this.SessionPool[ session_id ] ) !== 'undefined' )
			throw new Error( 'SessionPool collision at #' + session_id );
		var session = new this.Session( this, session_id );
		this.SessionPool[ session_id ] = session;
		console.log( '+SESSION', session.Id );
		return session;
	}
	
	GetGuestSession( connection, guest_id ) {
		var session;
		var guest_id_full = null;
		if ( guest_id )
			guest_id_full = this.Md5( connection.RemoteAddress ) + '|' + guest_id;
		if ( !guest_id_full || typeof( this.GuestSessions[ guest_id_full ] ) === 'undefined' ) {
			// create new session
			session = this.CreateSession();
			var guest_id, guest_id_full;
			do {
				guest_id = this.Md5( Math.random() );
				guest_id_full = this.Md5( connection.RemoteAddress ) + '|' + guest_id;
			} while ( typeof( this.GuestSessions[ guest_id_full ] ) !== 'undefined' );
			session.SetGuestId( guest_id );
			this.GuestSessions[ guest_id_full ] = session;
			session.OnCreate();
		}
		else
			session = this.GuestSessions[ guest_id_full ];
		return session;
	}
	
	FindGuestSession( guest_key ) {
		console.log( 'FIND' );
	}
	
/*	CreateSession( connection ) {
		if ( typeof( this.SessionPool[ connection.Id ] ) !== 'undefined' )
			throw new Error( 'SessionPool collision at #' + connection.Id );

		this.SessionPool[ connection.Id ] = new this.Session( this, connection );
		this.SessionPool[ connection.Id ].OnCreate();
	}*/
	
	DestroySession( session ) {
		if ( typeof( this.SessionPool[ session.Id ] ) === 'undefined' )
			throw new Error( 'SessionPool session #' + session.Id + ' does not exist' );
		if ( session.Connections.length > 0 )
			throw new Error( 'SessionPool session #' + session.Id + ' has active connections on destruction' );
		this.SessionPool[ session.Id ].OnDestroy();
		if ( session.GuestId ) {
			if ( typeof( this.GuestSessions[ session.GuestId ] ) === 'undefined' )
				throw new Error( 'SessionPool session #' + session.Id + ' GuestId not found in GuestSessions' );
			console.log( '-GUESTID', session.Id, session.GuestId );
			delete this.GuestSessions[ session.GuestId ];
		}
		delete this.SessionPool[ session.Id ];
	}
	
}

module.exports = SessionManager;
