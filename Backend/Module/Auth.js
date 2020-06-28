class Auth extends require( './_Module' ) {
	
	constructor() {
		super( module.filename );
		
		
	}

	RegisterUser( data ) {
		return new Promise( ( next, fail ) => {
			
			var error = null;
			if ( !data.username.length )
				error = [ 'username', 'Please enter username!' ];
			else if ( !data.password.length )
				error = [ 'password', 'Please enter password!' ];
			else if ( !data.confirm.length )
				error = [ 'confirm', 'Please confirm password!' ];
			else if ( data.password != data.confirm )
				error = [ 'confirm', 'Password confirmation doesn\'t match!' ];

			if ( error )
				return next( error );
			
			return next();
		});
	}
	
	LoginUser( data ) {
		return new Promise( ( next, fail ) => {
			
			var error = null;
			if ( !data.username.length )
				error = [ 'username', 'Please enter username!' ];
			else if ( !data.password.length )
				error = [ 'password', 'Please enter password!' ];

			if ( error )
				return next( error );

			return next();
		});
	}
	
}

module.exports = Auth;
