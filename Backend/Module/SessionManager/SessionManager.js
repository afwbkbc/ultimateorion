class SessionManager extends require( '../_Module' ) {
	
	constructor() {
		super( module.filename );
		
		this.Session = require( './Session' );
		
		this.SessionPool = {};
		this.NextSessionId = 0;
	}
	
	CreateSession( connection ) {
		if ( typeof( this.SessionPool[ connection.Id ] ) !== 'undefined' ) {
			// something's very wrong
			throw new Error( 'SessionPool collision at #' + connection.Id );
		}

		this.SessionPool[ connection.Id ] = new this.Session( this, connection );
		this.SessionPool[ connection.Id ].OnCreate();
	}
	
	DestroySession( connection ) {
		if ( typeof( this.SessionPool[ connection.Id ] ) === 'undefined' ) {
			// something's very wrong
			throw new Error( 'SessionPool session #' + connection.Id + ' does not exist' );
		}
		this.SessionPool[ connection.Id ].OnDestroy();
		delete this.SessionPool[ connection.Id ];
	}
	
}

module.exports = SessionManager;
