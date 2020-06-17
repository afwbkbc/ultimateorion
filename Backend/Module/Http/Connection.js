var Md5 = require( 'md5' );
var Events = {};

class Connection extends require( '../../_Base' ) {
	
	constructor( http, id, ws ) {
		super( module.filename );
		
		this.Http = http;
		this.Id = id;
		this.Ws = ws;
		this.SessionManager = this.Http.E.M.SessionManager;
		this.Authorized = false;
		this.Events = {};
		
		ws.on( 'message', ( message ) => {
			this.OnMessage( message );
		});
		ws.on( 'close', () => {
			this.OnDisconnect();
		});
		this.OnConnect();
	}
	
	Send( action, data ) {
		return new Promise( ( next, fail ) => {
			
			var event_id;
			do {
				event_id = Md5( Math.random() );
			} while ( typeof( Events[ event_id ] ) !== 'undefined' );
			
			var event = {
				data: {
					id: event_id,
					action: action,
					data: data ? data : {},
				},
				callback: next,
			};
			Events[ event_id ] = event;
			this.Events[ event_id ] = event;
			
			this.Ws.send( JSON.stringify( event.data ));
			
		});
	}
	
	OnConnect() {
		console.log( 'Connected: #' + this.Id );
		//this.SessionManager.CreateSession( this );
		this.Send( 'auth' )
			.then( ( data ) => {
				console.log( 'RESP', data );
			})
		;
	}
	
	OnDisconnect() {
		console.log( 'Disconnected: #' + this.Id );
		
		// don't wait for any events
		for ( var k in this.Events ) {
			delete this.Events[ k ];
			delete Events[ k ];
		}
		
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
