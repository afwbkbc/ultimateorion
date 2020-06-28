window.App.Extend({
	
	events: {
		
		auth: function( data, reply ) {
			return reply( window.App.Session.GetAuthData() );
		},
		set_guest_id: function( data ) {
			window.App.Session.SetGuestId( data.guest_id );
		},
		set_user_token: function( data ) {
			window.App.Session.SetUserToken( data.token );
		},
		clear_user_token: function( data ) {
			window.App.Session.ClearUserToken();
		},
		render: function( data ) {
			window.App.Viewport.AddElement( data );
		},
		unrender: function( data ) {
			window.App.Viewport.RemoveElement( data );
		},
		renderchange: function( data ) {
			window.App.Viewport.ChangeElement( data );
		},
		client_quit: function( data ) {
			window.App.Session.Clear();
			window.App.Viewport.Clear();
			document.body.innerHTML = '';
		},
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
