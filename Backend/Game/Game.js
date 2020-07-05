class Game extends require( '../_Entity' ) {
	
	constructor( parameters ) {
		super( module.filename, parameters );
		
		this.Player = require( './Player' );
		
		this.Players = {};
		
	}
	
	OnCreate() {
		console.log( '+GAME #' + this.Id );
		
		this.AddPlayer( this.Host );
		this.Host.Session.AddToGame( this );
	}
	
	OnDestroy() {
		console.log( '-GAME #' + this.Id );
		
		/*if ( this.SessionTimeout )
			clearTimeout( this.SessionTimeout );*/
		
		
	}
	
	AddPlayer( user ) {
		if ( !this.Players[ user.Id ] ) {
			console.log( 'ADD PLAYER #' + this.Id + ' ' + user.Username );
			var player = new this.Player( user, this );
			this.Players[ user.Id ] = player;
			if ( player.OnCreate )
				player.OnCreate();
		}
	}
	
	RemovePlayer( user ) {
		if ( this.Players[ user.Id ] ) {
			console.log( 'REMOVE PLAYER #' + this.Id + ' ' + user.Username );
			if ( player.OnDestroy )
				player.OnDestroy();
			delete this.Players[ user.Id ];
		}
	}
	
	GetPlayer( user ) {
		var player = this.Players[ user.Id ];
		if ( !player )
			throw new Error( 'game #' + this.Id + ' : no player for user ' + user.Username );
		return player;
	}
	
}

module.exports = Game;
