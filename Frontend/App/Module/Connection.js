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
			url: ( document.location.hostname == 'localhost' ? 'ws' : 'wss' ) + '://' + document.location.host,
			reconnect_interval: 1000,
		},
	},
	
	ws: null,
	events: {},
	
	Init: function( next ) {
		var that = this;
		
		this.Connect();
		
		next();
	},
	
	Connect: function() {
		var that = this;
		
		if ( this.ws )
			delete this.ws;
		
		this.ws = new WebSocket( this.config.ws.url );
		
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
	},
	
	OnDisconnect: function() {
		var that = this;
		
		//console.log( 'DISCONNECT' );
		for ( var k in this.events )
			delete this.events[ k ];
		this.events = {};
		setTimeout( function() {
			that.Connect();
		}, this.config.ws.reconnect_interval );
	},
	
	Reply: function( id, data ) {
		if ( typeof( this.events[ id ] ) === 'undefined' )
			return window.App.Error( 'event id does not exist', id );
		
		console.log( '<<', id, data );
		
		this.ws.send( JSON.stringify({
			id: id,
			data: data,
		}));
	},
	
	OnEvent: function( event ) {
		var that = this;
		
		console.log( '>>', event.id, event.action, event.data );
		window.App.EventHandler.Handle( event );
	},
	
});
