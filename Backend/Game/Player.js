class Player extends require( '../_Entity' ) {

	constructor() {
		super( module.filename );
	}

	Pack() {
		return new Promise( ( next, fail ) => {
			
			var data = {
				UserId: this.User.ID,
				GameId: this.Game.Id,
			}
			
			return next( data );
		});
	}
	
	Unpack( data ) {
		return new Promise( ( next, fail ) => {
			
			if ( !data.UserId || !data.GameId )
				return next( null ); // invalid player
			
			var promises = [];
			if ( !this.User )
				promises.push( this.Module( 'Auth' ).FindUser( data.UserId ) );
			if ( !this.Game )
				promises.push( this.Manager( 'Game' ).FindGame( data.GameId, {
					parameters: {
						Players: {
							[ this.Id ]: this,
						},
					},
				}));
			
			if ( !promises.length )
				return next( this ); // nothing to do
			
			Promise.all( promises )
				.then( ( results ) => {
					for ( var k in results ) {
						var obj = results[ k ];
						if ( !obj ) // one of mandatory objects not found, entity invalid
							return next( null );
						if ( obj.Classname == 'Game' || obj.Classname == 'User' )
							this[ obj.Classname ] = obj;
						else {
							console.log( 'INVALID CLASSNAME "' + obj.Classname );
							return next( null );
						}
					}
					return next( this );
				})
				.catch( fail )
			;
		});
	}
	
	OnCreate() {
		return new Promise( ( next, fail ) => {
			return next();
		});
	}
	
	OnDestroy() {
		return new Promise( ( next, fail ) => {
			Promise.all([
				this.User.Session.RemoveFromGame( this.Game ),
				this.Game.RemovePlayer( this.User ),
			])
				.then( next )
				.catch( fail )
			;
		});
	}
	
}

module.exports = Player;
