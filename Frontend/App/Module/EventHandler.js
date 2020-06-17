window.App.Extend({
	
	events: {
		
		auth: function( data, reply ) {
			
			return reply({
				is_guest: true,
			});
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
