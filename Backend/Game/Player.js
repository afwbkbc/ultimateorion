class Player extends require( '../_Base' ) {

	constructor( user, game ) {
		super( module.filename );
		
		this.User = user;
		this.Game = game;
	}

	Destroy() {
		this.User.Session.RemoveFromGame( this.Game );
		this.Game.RemovePlayer( this.User );
	}
	
}

module.exports = Player;
