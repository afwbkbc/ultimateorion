class Game extends require( '../_Base' ) {
	
	constructor( game_manager, id, name, host ) {
		super( module.filename );
		
		this.GameManager = game_manager;
		this.Id = id;
		this.Name = name;
		this.Host = host;
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
