class SessionManager extends require( '../_Module' ) {
	
	constructor() {
		super( module.filename );
		
		this.Md5 = require( 'md5' );
		this.Session = require( './Session' );
		
		this.SessionPool = {};
		this.NextSessionId = 0;
		
		this.GuestSessions = {};
		this.UserSessions = {};
	}
	
	Run() {
		return new Promise( ( next, fail ) => {
			
			this.UserSession = this.E.M.Sql.Models.UserSession;
			
			return next();
		});
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
		return new Promise( ( next, fail ) => {
			var session;
			if ( !guest_id || typeof( this.GuestSessions[ guest_id ] ) === 'undefined' ) {
				// create new session
				session = this.CreateSession();
				do {
					guest_id = this.Md5( Math.random() );
				} while ( typeof( this.GuestSessions[ guest_id ] ) !== 'undefined' );
				session.SetGuestId( connection, guest_id );
				this.GuestSessions[ guest_id ] = session;
				session.OnCreate();
			}
			else
				session = this.GuestSessions[ guest_id ];
			return next( session );
		});
	}
	
	GetUserSession( connection, user ) {
		return new Promise( ( next, fail ) => {
			
			// look in memory first
			var session = this.UserSessions[ user.ID ];
			if ( session )
				return next( session );
			// look in db
			this.UserSession.FindOne({
				User: user,
			})
				.then( ( session ) => {
					if ( !session ) {
						// create new session
						session = this.CreateSession();
						session.User = user;
						session.OnCreate();
					}
					else
						session.User = user; // user not kept in db so need to attach it
					this.UserSessions[ user.ID ] = session;
					return next( session );
				})
				.catch( fail )
			;
		});
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
