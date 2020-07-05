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
			
			Promise.all([
				this.Module( 'Auth' ).FindUser( data.UserId ),
				this.Manager( 'Game' ).FindGame( data.GameId ), // recursion
			])
				.then( ( results ) => {
					this.User = results[ 0 ];
					this.Game = results[ 1 ];
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
