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
		if ( !guest_id || typeof( this.GuestSessions[ guest_id ] ) === 'undefined' ) {
			// create new session
			session = this.CreateSession();
			do {
				guest_id = this.Md5( Math.random() );
			} while ( typeof( this.GuestSessions[ guest_id ] ) !== 'undefined' );
			session.SetGuestId( guest_id );
			this.GuestSessions[ guest_id ] = session;
			session.OnCreate();
		}
		else
			session = this.GuestSessions[ guest_id ];
		return session;
	}
	
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
