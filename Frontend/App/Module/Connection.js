var CreateEvent = function( event_data, connection ) {
	
	var event = Object.assign( event_data, {
		connection: connection,
		Reply: function( data ) {
			this.connection.Reply( this.id, data );
		},
	});
	
	return event;
}

window.App.Extend({

	config: {
		ws: {
			reconnect_interval: 1000,
		},
	},
	
	ws: null,
	IsConnected: false,
	events_bf: {},
	events_fb: {},
	
	Run: function() {
		this.Connect();
	},
	
	Reconnect: function() {
		if ( this.IsConnected ) {
			this.reconnect_immediately = true;
			this.Disconnect();
		}
	},
	
	Disconnect: function() {
		window.App.Viewport.Clear();
		if ( this.ws )
			this.ws.close();
	},
	
	Connect: function() {
		var that = this;
		
		if ( this.connect_timeout ) {
			clearTimeout( this.connect_timeout );
			this.connect_timeout = null;
		}
		
		if ( this.ws )
			delete this.ws;
		
		this.ws = new WebSocket( ( window.App.Config.UseSSL ? 'wss' : 'ws' ) + '://' + document.location.host );
		
		this.ws.onopen = function() {
			that.OnConnect.apply( that );
		};
		
		this.ws.onmessage = function( message ) {
			if ( window.App.Viewport.TrackStats )
				window.App.Viewport.TrackData.NetIn[ 0 ] += message.data.length;
			var data = JSON.parse( message.data );
			if ( data.mode == 'FB' ) {
				// response from backend
				var event = that.events_fb[ data.id ];
				if ( !event ) {
					console.log( 'WARNING', 'event "' + data.id + '" does not exist', data );
					return;
				}
				if ( event.callback )
					event.callback( data.data );
				delete that.events_fb[ data.id ];
			}
			else {
				if ( !data.action || !data.data ) {
					//console.log( data );
					return window.App.Error( 'invalid/corrupted event', data );
				}
				if ( data.id && typeof( that.events_bf[ data.id ] ) !== 'undefined' )
					return window.App.Error( 'event id collision', id );
				
				var event = CreateEvent( data, that );
				that.events_bf[ event.id ] = event;
				that.OnEvent.apply( that, [ event ] );
			}
		};

		this.ws.onclose = function() {
			that.OnDisconnect.apply( that );
		};
		
	},
	
	OnConnect: function() {
		//console.log( 'CONNECT', this );
		
		window.App.Loader.Stop();
		
		this.IsConnected = true;
	},
	
	OnDisconnect: function() {
		this.IsConnected = false;
		
		var that = this;
		
		// stop waiting for events
		for ( var k in this.events_bf )
			delete this.events_bf[ k ];
		this.events_bf = {};
		
		// clear viewport
		window.App.Viewport.Clear();
		
		// show 'loading' animation until connected
		window.App.Loader.Start();
		
		// try to reconnect
		if ( this.connect_timeout )
			clearTimeout( this.connect_timeout );
		
		if ( this.reconnect_immediately ) {
			delete this.reconnect_immediately;
			this.Connect();
		}
		else {
			this.connect_timeout = setTimeout( function() {
				that.Connect();
			}, this.config.ws.reconnect_interval );
		}
	},
	
	LogEvent: function( prefix, id, action, data ) {
		if ([
			'render',
			'unrender',
			'renderchange',
		].indexOf( action ) >= 0 )
			return; // skip spammy events
		
		console.log( prefix, id, action, data );
	},
	
	// TODO: event tracking?
	Send: function( data, on_response ) {
		//this.LogEvent( '<<', data );
		var event = {
			data: data,
		};
		if ( on_response ) {
			event.type = 'FB'; // response from backend needed
			var event_id;
			do {
				event_id = window.App.Tools.GetRandomHash();
			} while ( typeof( this.events_fb[ event_id ] ) !== 'undefined' );
			event.data.id = event_id;
			event.data.mode = 'FB';
			this.events_fb[ event_id ] = event;
			event.callback = on_response;
		}
		else {
			event.type = 'S'; // just standalone async event
		}
		var data = JSON.stringify( event );
		if ( window.App.Viewport.TrackStats )
			window.App.Viewport.TrackData.NetOut[ 0 ] += data.length;
		this.ws.send( data );
	},
	
	Reply: function( id, data ) {
		if ( typeof( this.events_bf[ id ] ) === 'undefined' )
			return window.App.Error( 'event id does not exist', id );
		
		//this.LogEvent( '<<', id, null, data );
		
		delete this.events_bf[ id ];
		
		this.ws.send( JSON.stringify({
			id: id,
			type: 'BF',
			data: data,
		}));
	},
	
	OnEvent: function( event ) {
		var that = this;
		
		this.LogEvent( '>>', event.id, event.action, event.data );
		
		if ( event.type == 'FB' ) {
			// response from backend
			//console.log( 'RESPONSE' );
		}
		else {
			// new standalone event
			window.App.EventHandler.Handle( event );
		}
		
	},
	
});
