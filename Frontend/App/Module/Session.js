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
		var cookie = key + '=' + value + '; SameSite=strict;';
		if ( window.App.Config.UseSSL )
			cookie += ' Secure=true;';
		cookie += ' Path=/; Expires=Fri, 31 Dec 9999 23:59:59 GMT';
		document.cookie += cookie;
	},
	
	RemoveCookie: function( key ) {
		console.log( '-COOKIE', key );
		document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
	},
	
	GetAuthData: function() {
		console.log( 'GETCOOKIE', this.GetCookie( 'guest_id' ) );
		return {
			is_guest: true,
			guest_id: this.GetCookie( 'guest_id' ),
		};
	},
	
	SetGuestId: function( guest_id ) {
		if ( this.GetCookie( 'guest_id' ) !== guest_id ) {
			this.RemoveCookie( 'guest_id' );
			this.SetCookie( 'guest_id', guest_id );
		}
	},
	
});
