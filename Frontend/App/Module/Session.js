window.App.Extend({
	
	GetCookie: function( key ) {
		const value = `; ${document.cookie}`;
		const parts = value.split( `; ${key}=` );
		if ( parts.length === 2 )
			return parts.pop().split( ';' ).shift();
		else
			return null;
	},
	
	SetCookie: function( key, value ) {
		console.log( '+COOKIE', key, value );
		document.cookie = key + '=' + value + '; SameSite=strict; Secure=true; expires=Fri, 31 Dec 9999 23:59:59 GMT';
	},
	
	RemoveCookie: function( key, value ) {
		console.log( '-COOKIE', key, value );
		document.cookie = key + '=' + value + '; expires=Thu, 01 Jan 1970 00:00:01 GMT';
	},
	
	GetAuthData: function() {
		return {
			is_guest: true,
			guest_id: this.GetCookie( 'guest_id' ),
		};
	},
	
	SetGuestId: function( guest_id ) {
		window.App.Session.SetCookie( 'guest_id', guest_id );
	},
	
});
