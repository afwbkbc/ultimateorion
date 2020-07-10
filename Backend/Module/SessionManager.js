class SessionManager extends require( './_EntityManager' ) {
	
	constructor() {
		super( module.filename, 'Session' );
		
		this.GuestSessions = {};
		this.UserSessions = {};
	}
	
	CreateSession( type ) {
		this.Create()
			.then( ( game ) => {
			
				return next( game );
			})
			.catch( fail )
		;
	}
	
	GetGuestSession( connection, guest_id ) {
		return new Promise( ( next, fail ) => {
			if ( !guest_id || typeof( this.GuestSessions[ guest_id ] ) === 'undefined' ) {
				// create new session
				var session = this.ConstructEntity();
				session.Create()
					.then( () => {
						do {
							guest_id = this.Crypto.RandomMd5Hash();
						} while ( typeof( this.GuestSessions[ guest_id ] ) !== 'undefined' );
						session.SetGuestId( connection, guest_id );
						this.GuestSessions[ guest_id ] = session;
						return next( session );
					})
					.catch( fail )
				;
			}
			else
				return next( this.GuestSessions[ guest_id ] );
		});
	}
	
	GetUserSession( connection, user ) {
		return new Promise( ( next, fail ) => {
			
			// look in memory first
			var session = this.UserSessions[ user.ID ];
			if ( session )
				return next( session );
		
			// look in db and add to memory if found
			var session_found = ( session ) => {
				user.Session = session;
				this.UserSessions[ user.ID ] = session;
				return next( session );
			}
			
			var create_new_session = () => {
				this.Create({
					parameters: {
						User: user,
					},
				})
					.then( ( session ) => {
						//save session id to user
						user.SessionId = session.Id;
						user.Save()
							.then( () => {
								return session_found( session );
							})
							.catch( fail )
						;
					})
					.catch( fail )
				;
			}
			
			if ( !user.SessionId ) {
				// new user, need to create session
				create_new_session();
			}
			else {
				this.Load( user.SessionId )
					.then( ( session ) => {
						if ( session )
							return session_found( session );
						else
							return create_new_session();
					})
					.catch( fail )
				;
			}
			
		});
	}
	
	DestroySession( session ) {
		return new Promise( ( next, fail ) => {
			if ( session.User ) {
				if ( typeof( this.UserSessions[ session.User.ID ] ) === 'undefined' )
					throw new Error( 'SessionPool session #' + session.User.ID + ' User ID not found in UserSessions' );
				console.log( '-USERID', session.Id, session.User.ID );
				delete this.UserSessions[ session.User.ID ];
			}
			else if ( session.GuestId ) {
				if ( typeof( this.GuestSessions[ session.GuestId ] ) === 'undefined' )
					throw new Error( 'SessionPool session #' + session.Id + ' GuestId not found in GuestSessions' );
				console.log( '-GUESTID', session.Id, session.GuestId );
				delete this.GuestSessions[ session.GuestId ];
			}
			else
				throw new Error( 'SessionPool invalid/malformed session' + session.Id );
			if ( session.Connections.length > 0 )
				throw new Error( 'SessionPool session #' + session.Id + ' has active connections on destruction' );
			this.Delete( session, {
				keep_in_db: true,
			})
				.then( next )
				.catch( fail )
			;
		});
	}
	
}

module.exports = SessionManager;
