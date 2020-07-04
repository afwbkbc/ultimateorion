class GuestSession extends require( './Session' ) {
	
	OnCreate() {
		this.Viewport = new ( this.H.Loader.Require( 'Viewport/Template/MainMenuGuest' ) )( this );
	}
	
	OnDestroy() {
		this.Viewport.Destroy();
		delete this.Viewport;
	}
	
}

module.exports = GuestSession;
