class UserSession extends require( './Session' ) {
	
	OnCreate() {
		this.Viewport = new ( this.H.Loader.Require( 'Viewport/Template/MainMenuUser' ) )( this );
	}
	
	OnDestroy() {
		
		// save to DB
		var data = this.Serialize();
		console.log( 'DATA', data );
		
		this.Viewport.Destroy();
		delete this.Viewport;
	}
	
}

module.exports = UserSession;
