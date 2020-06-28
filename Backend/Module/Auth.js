class Auth extends require( './_Module' ) {
	
	constructor() {
		super( module.filename );
		
	}

	Run() {
		return new Promise( ( next, fail ) => {

			// handy shortcuts
			this.User = this.E.M.Sql.Models.User;
			
			return next();
		});
	}
	
	RegisterUser( data ) {
		return new Promise( ( next, fail ) => {
			
			var error = null;
			if ( !data.username.length )
				error = [ 'username', 'Please enter username!' ];
			else if ( data.username.length > this.Config.MaxUsernameLength )
				error = [ 'username', 'Username must be at most ' + this.Config.MaxUsernameLength + ' symbols!' ];
			else if ( !data.password.length )
				error = [ 'password', 'Please enter password!' ];
			else if ( data.password.length < this.Config.MinPasswordLength )
				error = [ 'password', 'Password must be at least ' + this.Config.MinPasswordLength + ' symbols!' ];
			else if ( data.password.length > this.Config.MaxPasswordLength )
				error = [ 'password', 'Password must be at most ' + this.Config.MaxPasswordLength + ' symbols!' ];
			else if ( !data.confirm.length )
				error = [ 'confirm', 'Please confirm password!' ];
			else if ( data.password != data.confirm )
				error = [ 'confirm', 'Password confirmation doesn\'t match!' ];

			if ( error )
				return next( error );
			
			// check if username exists
			this.User.FindOne({
				Username: data.username,
			})
				.then( ( user ) => {
					if ( user )
						return next( [ 'username', 'Username already taken!' ] );
					
					this.E.M.Crypto.HashPassword( data.password )
						.then( ( hash ) => {
							user = new this.User({
								Username: data.username,
								Hash: hash,
							});
							user.Save()
								.then( () => {
									console.log( 'SAVED!' );
									
									return next();
								})
								.catch( fail )
							;
							
						})
						.catch( fail )
					;
					
				})
				.catch( fail )
			;
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
			
			var autherror = [ 'password', 'Login failed - invalid username and/or password!' ];
			
			this.User.FindOne({
				Username: data.username,
			})
				.then( ( user ) => {
					if ( !user )
						return next( autherror );
					
					this.E.M.Crypto.CheckPassword( data.password, user.Hash )
						.then( ( is_password_ok ) => {
							if ( !is_password_ok )
								return next( autherror );
							
							return next();
						})
						.catch( fail )
					;
				})
				.catch( fail )
			;

		});
	}
	
}

module.exports = Auth;
