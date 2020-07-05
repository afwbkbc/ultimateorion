class Game extends require( '../_Entity' ) {
	
	constructor( parameters ) {
		super( module.filename, parameters );
		
		this.Players = {};
	}
	
	Pack() {
		return new Promise( ( next, fail ) => {
			
			var data = {
				Name: this.Name,
				HostId: this.Host.ID,
			};
			
			// players
			data.Players = [];
			for ( var k in this.Players )
				data.Players.push( this.Players[ k ].Id );
			
			return next( data );
		});
	}
	
	Unpack( data ) {
		return new Promise( ( next, fail ) => {
			
			if ( data.HostId ) { // host is mandatory
				
				// name
				if ( data.Name )
					this.Name = data.Name;
				
				// host
				this.Module( 'Auth' ).FindUser( data.HostId )
					.then( ( user ) => {
						if ( user ) {
							this.Host = user;
							
							// players
							if ( data.Players && data.Players.length ) {
								var promises = [];
								for ( var k in data.Players ) {
									var id = data.Players[ k ];
									promises.push( this.Manager( 'Player' ).FindPlayer( id ) );
								}
								Promise.all( promises )
									.then( ( results ) => {
										for ( var k in results ) {
											var player = results[ k ];
											if ( player )
												this.Players[ player.Id ] = player;
										}
										return next( this );
									})
									.catch ( fail )
								;
							}
							else
								return next( this );
							
						}
						else
							return next( null );
					})
					.catch( fail )
				;
			}
			else
				return next( null );
		});
	}
	
	OnCreate() {
		return new Promise( ( next, fail ) => {
			console.log( '+GAME #' + this.Id, this );
			
			this.AddPlayer( this.Host )
				.then( () => {
					this.Host.Session.AddToGame( this );
					return next();
				})
				.catch( fail )
			;
		});
	}
	
	OnDestroy() {
		return new Promise( ( next, fail ) => {
			
			console.log( '-GAME #' + this.Id );
			
			return next();
		});
	}
	
	AddPlayer( user ) {
		return new Promise( ( next, fail ) => {
			var player = this.Players[ user.Id ];
			if ( !player ) {
				this.Manager( 'Player' ).CreatePlayer( user, this )
					.then( ( player ) => {
						console.log( 'GAME #' + this.Id + ' : ADD PLAYER #' + player.Id + ' ( ' + user.Username + ' )' );
						this.Players[ user.Id ] = player;
						this.Save()
							.then( () => {
								return next( player );
							})
							.catch( fail )
						;
					})
					.catch( fail )
				;
			}
			else
				return next( player );
		});
	}
	
	RemovePlayer( user ) {
		return new Promise( ( next, fail ) => {
			var player = this.Players[ user.Id ];
			if ( player ) {
				console.log( 'GAME #' + this.Id + ' : REMOVE PLAYER #' + player.Id + ' ( ' + user.Username + ' )' );
				this.Manager( 'Player' ).DeletePlayer( player )
					.then( () => {
						delete this.Players[ user.Id ];
						this.Save()
							.then( () => {
								return next();
							})
							.catch( fail )
						;
					})
					.catch( fail )
				;
			}
			else
				return next();
		});
	}
	
	GetPlayer( user ) {
		var player = this.Players[ user.Id ];
		if ( !player )
			throw new Error( 'game #' + this.Id + ' : no player for user ' + user.Username );
		return player;
	}
	
}

module.exports = Game;
