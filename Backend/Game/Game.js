class Game extends require( '../_Base' ) {
	
	constructor( game_manager, id, name, host ) {
		super( module.filename );
		
		this.Player = require( './Player' );
		
		this.GameManager = game_manager;
		this.Id = id;
		this.Name = name;
		this.Host = host;
		this.Players = {};
		
		this.AddPlayer( host );
		host.Session.AddToGame( this );
		
		//this.SessionTimeout = null;
	}
	
	Create() {
		console.log( '+GAME #' + this.Id );
		
		if ( this.OnCreate )
			this.OnCreate();
	}
	
	Destroy() {
		console.log( '-GAME #' + this.Id );
		
		/*if ( this.SessionTimeout )
			clearTimeout( this.SessionTimeout );*/
		
		if ( this.OnDestroy )
			this.OnDestroy();
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
	
	/*Connect( connection ) {
		if ( this.SessionTimeout ) {
			clearTimeout( this.SessionTimeout );
			this.SessionTimeout = null;
		}
		if ( this.Viewport )
			this.Viewport.RenderRecursive( connection );
	}
	
	Disconnect( connection ) {
		if ( Object.keys( this.Connections ).length == 0 && !this.UserId ) {
			// no connections left, guest session will timeout
			if ( this.SessionTimeout )
				throw new Error( 'SessionTimeout already active', this.Id );
			
			this.SessionTimeout = setTimeout( () => {
				
				this.SessionTimeout = null;
				this.SessionManager.DestroySession( this );
			}, this.SessionManager.Config.GuestTimeout );
		}
	}
	
	Send( action, data, on_response ) {
		for ( var k in this.Connections )
			this.Connections[ k ].Send( action, data, on_response );
	}*/
}

module.exports = Game;
