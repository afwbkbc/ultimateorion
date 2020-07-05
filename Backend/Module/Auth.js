class Auth extends require( './_Module' ) {
	
	constructor() {
		super( module.filename );

	}

	Run() {
		return new Promise( ( next, fail ) => {

			// handy shortcuts
			this.User = this.Model( 'User' );
			this.UserToken = this.Model( 'UserToken' );
			this.Crypto = this.Module( 'Crypto' );
			
			return next();
		});
	}
	
	RegisterUser( data ) {
		return new Promise( ( next, fail ) => {
			
			var errors = null;
			if ( !data.username.length )
				errors = { username: 'Please enter username!' };
			else if ( data.username.length > this.Config.MaxUsernameLength )
				errors = { username: 'Username must be at most ' + this.Config.MaxUsernameLength + ' symbols!' };
			else if ( !data.password.length )
				errors = { password: 'Please enter password!' };
			else if ( data.password.length < this.Config.MinPasswordLength )
				errors = { password: 'Password must be at least ' + this.Config.MinPasswordLength + ' symbols!' };
			else if ( data.password.length > this.Config.MaxPasswordLength )
				errors = { password: 'Password must be at most ' + this.Config.MaxPasswordLength + ' symbols!' };
			else if ( !data.confirm.length )
				errors = { confirm: 'Please confirm password!' };
			else if ( data.password != data.confirm )
				errors = { confirm: 'Password confirmation doesn\'t match!' };

			if ( errors )
				return next( { errors: errors } );
			
			// check if username taken
			this.User.FindOne({
				Username: data.username,
			})
				.then( ( user ) => {
					if ( user )
						return next( { errors: { username: 'Username already taken!' } } );
					
					this.Crypto.HashPassword( data.password )
						.then( ( hash ) => {
							
							// create user in db
							user = new this.User({
								Username: data.username,
								Hash: hash,
							});
							user.Save()
								.then( () => {

									this.CacheScope( 'USER_' + user.ID, ( next, fail ) => {
										return next( user );
									})
										.then( () => {
											// login and return token
											this.LoginUser({
												username: data.username,
												password: data.password,
											})
												.then( next )
												.catch( fail )
											;
										})
										.catch( fail )
									;
									
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
			
			var errors = null;
			if ( !data.username.length )
				errors = { username: 'Please enter username!' };
			else if ( !data.password.length )
				errors = { password: 'Please enter password!' };

			if ( errors )
				return next( { errors: errors } );
			
			var autherror = { errors: { password: 'Login failed - invalid username and/or password!' } };
			
			this.User.FindOne({
				Username: data.username,
			})
				.then( ( user ) => {
					if ( !user )
						return next( autherror );
					
					this.Crypto.CheckPassword( data.password, user.Hash )
						.then( ( is_password_ok ) => {
							if ( !is_password_ok )
								return next( autherror );
							
							this.CacheScope( 'USER_' + user.ID, ( next, fail ) => {
								return next( user );
							})
								.then( ( user ) => {
									this.CreateUserToken( user, data.remote_address )
										.then( ( token ) => {
											
											return next( { token: token } );
											
										})
										.catch( fail )
									;
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
	
	RemoveUserToken( hash, remote_address ) {
		return new Promise( ( next, fail ) => {
			this.UserToken.FindOne({
				Hash: hash,
				RemoteAddress: remote_address,
			})
				.then( ( token ) => {
					if ( !token )
						return next();
					
					token.Delete()
						.then( next )
						.catch( fail )
					;
					
					return next();
				})
				.catch( fail )
			;
		});
	}
	
	CreateUserToken( user, remote_address ) {
		return new Promise( ( next, fail ) => {
			
			var hash;
			
			var token_hash_generated = () => {
				var token = new this.UserToken({
					User: user,
					Hash: hash,
					RemoteAddress: remote_address,
					LastActiveTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
				});
				token.Save()
					.then( () => {
						
						return next( hash );
					})
					.catch( fail )
				;
			}
			
			var generate_token_hash = () => {
				hash = this.Crypto.RandomMd5Hash( 4 );
				this.UserToken.FindOne({
					User: user,
					Hash: hash,
					RemoteAddress: remote_address,
				})
					.then( ( token ) => {
						if ( token )
							return generate_token_hash();
						return token_hash_generated();
						
						return next();
					})
					.catch( fail )
				;
			}
			generate_token_hash();
			
		});
	}
	
	GetUserByToken( hash, remote_address ) {
		return new Promise( ( next, fail ) => {
			
			this.UserToken.FindOne({
				Hash: hash,
				RemoteAddress: remote_address,
			}, [ 'User' ])
				.then( ( token ) => {
					if ( !token )
						return next( null );
					
					this.CacheScope( 'USER_' + token.User.ID, ( next, fail ) => {
						return next( token.User );
					})
						.then( ( user ) => {
							return next( user );
						})
						.catch( fail )
					;
				})
				.catch( fail )
			;
		});
	}
	
	FindUser( user_id ) {
		return new Promise( ( next, fail ) => {
			
			this.CacheScope( 'USER_' + user_id, ( next, fail ) => {
				this.User.FindOne({
					ID: user_id,
				})
					.then( next )
					.catch( fail )
				;
			})
				.then( ( user ) => {
					return next( user );
				})
				.catch( fail )
			;
		});
	}
	
}

module.exports = Auth;
