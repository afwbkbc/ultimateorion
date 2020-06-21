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
	events: {},
	
	Run: function() {
		this.Connect();
	},
	
	Connect: function() {
		var that = this;
		
		if ( this.ws )
			delete this.ws;
		
		this.ws = new WebSocket( ( window.App.Config.UseSSL ? 'wss' : 'ws' ) + '://' + document.location.host );
		
		this.ws.onopen = function() {
			that.OnConnect.apply( that );
		};
		
		this.ws.onmessage = function( message ) {
			var data = JSON.parse( message.data );
			if ( !data.action || !data.data )
				return window.App.Error( 'invalid/corrupted event', data );
			if ( data.id && typeof( that.events[ data.id ] ) !== 'undefined' )
				return window.App.Error( 'event id collision', id );
			
			var event = CreateEvent( data, that );
			that.events[ event.id ] = event;
			that.OnEvent.apply( that, [ event ] );
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
		for ( var k in this.events )
			delete this.events[ k ];
		this.events = {};
		
		// clear viewport
		window.App.Viewport.Clear();
		
		// show 'loading' animation until connected
		window.App.Loader.Start();
		
		// try to reconnect
		setTimeout( function() {
			that.Connect();
		}, this.config.ws.reconnect_interval );
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
	Send: function( data ) {
		this.LogEvent( '<<', data );
		this.ws.send( JSON.stringify({
			data: data,
		}));
	},
	
	Reply: function( id, data ) {
		if ( typeof( this.events[ id ] ) === 'undefined' )
			return window.App.Error( 'event id does not exist', id );
		
		this.LogEvent( '<<', id, null, data );
		
		this.ws.send( JSON.stringify({
			id: id,
			data: data,
		}));
	},
	
	OnEvent: function( event ) {
		var that = this;
		
		this.LogEvent( '>>', event.id, event.action, event.data );
		
		window.App.EventHandler.Handle( event );
	},
	
});
