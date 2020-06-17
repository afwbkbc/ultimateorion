window.App.Extend({
	
	events: {
		
		auth: function( data, reply ) {
			
			return reply({
				is_guest: true,
				guest_id: window.App.State.GetCookie( 'guest_id' ),
			});
		},
		
		set_guest_id: function( data ) {
			window.App.State.SetCookie( 'guest_id', data.guest_id );
		},
		
	},
	
	Init: function( next ) {
		
		next();
	},
	
	Handle: function( event ) {
		var that = this;
		
		if ( typeof( this.events[ event.action ] ) === 'undefined' )
			return window.App.Error( 'invalid event type', event );
		
		this.events[ event.action ]( event.data, function( response ) {
			event.Reply( response );
		});
	},
	
});
