class Auth extends require( './_Module' ) {
	
	constructor() {
		super( module.filename );

		this.Md5 = require( 'md5' );
	}

	Run() {
		return new Promise( ( next, fail ) => {

			// handy shortcuts
			this.User = this.E.M.Sql.Models.User;
			this.UserToken = this.E.M.Sql.Models.UserToken;
			
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
					
					this.E.M.Crypto.HashPassword( data.password )
						.then( ( hash ) => {
							
							// create user in db
							user = new this.User({
								Username: data.username,
								Hash: hash,
							});
							user.Save()
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
					
					this.E.M.Crypto.CheckPassword( data.password, user.Hash )
						.then( ( is_password_ok ) => {
							if ( !is_password_ok )
								return next( autherror );
							
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
				hash = this.Md5( Math.random() ) + this.Md5( Math.random() ) + this.Md5( Math.random() ) + this.Md5( Math.random() );
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
					//console.log( 'GETUSERBYTOKEN', hash, remote_address, token );
					
					if ( !token )
						return next( null );
					return next( token.User );
				})
				.catch( fail )
			;
		});
	}
	
}

module.exports = Auth;
