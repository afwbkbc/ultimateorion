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
		this.EventsBF = {};
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
		
		if ( on_response ) { // mark event as BF mode to get response from it
			var event_id;
			do {
				event_id = Md5( Math.random() );
			} while ( typeof( Events[ event_id ] ) !== 'undefined' );
			event.data.id = event_id;
			event.data.mode = 'BF';
			Events[ event_id ] = event;
			this.EventsBF[ event_id ] = event;
			event.callback = on_response;
		}
		else {
			event.data.mode = 'S'; // just send as standalone async event
		}
		
		this.Ws.send( JSON.stringify( event.data ));
		
	}
	
	Reply( id, data ) {
		//console.log( 'REPLY', id, data );
		this.Ws.send( JSON.stringify({
			id: id,
			data: data,
			mode: 'FB',
		}));
	}
	
	OnConnect() {
		console.log( 'Connected: #' + this.Id );
		if ( this.Session )
			throw new Error( 'Connection session already set', this.Id );
		
		this.Send( 'auth', {}, ( data ) => {
			//console.log( 'RESP', data );
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
		
		// don't wait for any events now
		for ( var k in this.EventsBF ) {
			delete this.EventsBF[ k ];
			delete Events[ k ];
		}
		
		if ( this.Session )
			this.Session.RemoveConnection( this );
		
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
		
		if ( data.type == 'BF' ) {
			if ( !data.id || !data.data ) {
				console.log( 'invalid/malformed message, dropping', data );
				return;
			}
			
			if ( !data.action ) {
				// reply to event
				if ( typeof( this.EventsBF[ data.id ] ) === 'undefined' ) {
					console.log( 'invalid event reply id, dropping' );
					return;
				}
				
				this.EventsBF[ data.id ].callback( data.data );
				
				delete this.EventsBF[ data.id ];
				delete Events[ data.id ];
			}
		}
		else if ( data.type == 'FB' ) {
			var event = Object.assign( data, {
				replied: false,
				connection: this,
				Reply: function( data ) {
					this.connection.Reply( this.data.id, data );
					this.replied = true;
				},
				Finalize: function() {
					if ( !this.replied )
						this.connection.Reply( this.data.id, {} );
				}
			});
			
			this.DispatchEvent( event );
		}
		else {
			console.log( 'invalid/unsupported event type "' + data.type + '"', data );
		}
		
		//console.log( 'ONMESSAGE', data );
	}
	
	DispatchEvent( event ) {
		event.data.data.Reply = event.Reply;
		switch ( event.data.action ) {
			case 'viewport_event':
				this.Session.Viewport.HandleEvent( event.data.data );
				break;
			default:
				console.log( 'dropping invalid/unsupported event "' + event.data.action + '"', event.data );
				return;
		}
		event.Finalize();
	}
	
}

module.exports = Connection;
