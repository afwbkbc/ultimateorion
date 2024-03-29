class Crypto extends require( './_Module' ) {
	
	constructor() {
		super( module.filename );
		
		this.Md5 = require( 'md5' );
		this.Bcrypt = require( 'bcrypt' );
	}
	
	RandomMd5Hash( size ) {
		if ( !size )
			size = 1;
		var hash = '';
		for ( var i = 0 ; i < size ; i++ )
			hash += this.Md5( Math.random() );
		return hash;
	}
	
	HashPassword( password ) {
		return new Promise( ( next, fail ) => {
			try {
				this.Bcrypt.hash( password, this.Config.SaltRounds, ( err, hash ) => {
					if ( err )
						return fail( err );
					return next( hash );
				});
			} catch ( e ) {
				return fail( e );
			}
		});
	}
	
	CheckPassword( password, hash ) {
		return new Promise( ( next, fail ) => {
			try {
				this.Bcrypt.compare( password, hash, ( err, result ) => {
					if ( err )
						return fail( err );
					
					return next( result );
				});
			} catch ( e ) {
				return fail( e );
			}
		})
	}
}

module.exports = Crypto;
