var Md5 = require( 'md5' );
var Events = {};

class Connection extends require( '../../_Base' ) {
	
	constructor( http, id, ws, req ) {
		super( module.filename );
		
		this.Http = http;
		this.Id = id;
		this.Ws = ws;
		this.Req = req;
		this.RemoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		this.SessionManager = this.Http.E.M.SessionManager;
		this.Authorized = false;
		this.Events = {};
		this.Session = null;
		
		ws.on( 'message', ( message ) => {
			this.OnMessage( message );
		});
		ws.on( 'close', () => {
			this.OnDisconnect();
		});
		this.OnConnect();
	}
	
	Send( action, data, on_response ) {
		
		var event = {
			data: {
				action: action,
				data: data ? data : {},
			},
		};
		
		if ( on_response ) {
			var event_id;
			do {
				event_id = Md5( Math.random() );
			} while ( typeof( Events[ event_id ] ) !== 'undefined' );
			event.data.id = event_id;
			Events[ event_id ] = event;
			this.Events[ event_id ] = event;
			event.callback = on_response;
		}
		
		this.Ws.send( JSON.stringify( event.data ));
		
	}
	
	OnConnect() {
		console.log( 'Connected: #' + this.Id );
		if ( this.Session )
			throw new Error( 'Connection session already set', this.Id );
		
		this.Send( 'auth', {}, ( data ) => {
			console.log( 'RESP', data );
			var session;
			if ( data.is_guest ) {
				session = this.SessionManager.GetGuestSession( this, data.guest_id );
			}
			else {
				
			}
			this.Session = session;
			session.AddConnection( this );
		});
	}
	
	OnDisconnect() {
		console.log( 'Disconnected: #' + this.Id );
		
		// don't wait for any events
		for ( var k in this.Events ) {
			delete this.Events[ k ];
			delete Events[ k ];
		}
		
		if ( this.Session )
			this.Session.RemoveConnection( this );
		
		//this.SessionManager.DestroySession( this );
		this.Http.RemoveConnection( this.Id );
	}
	
	OnMessage( data ) {
		
		// validate format
		try {
			data = JSON.parse( data );
		} catch ( e ) {
			console.log( 'non-json message, dropping' );
			return;
		}
		if ( !data.id || !data.data ) {
			console.log( 'invalid/malformed message, dropping', data );
			return;
		}
		
		if ( !data.action ) {
			// reply to event
			if ( typeof( this.Events[ data.id ] ) === 'undefined' ) {
				console.log( 'invalid event reply id, dropping' );
				return;
			}
			
			this.Events[ data.id ].callback( data.data );
			
			delete this.Events[ data.id ];
			delete Events[ data.id ];
		}
		else {
			// new event
		}
		
		//console.log( 'ONMESSAGE', data );
	}
	
}

module.exports = Connection;
