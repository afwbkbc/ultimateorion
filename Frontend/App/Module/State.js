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
		document.cookie = key + '=' + value + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
	},
	
	RemoveCookie: function( key, value ) {
		console.log( '-COOKIE', key, value );
		document.cookie = key + '=' + value + '; expires=Thu, 01 Jan 1970 00:00:01 GMT';
	},
	
});
