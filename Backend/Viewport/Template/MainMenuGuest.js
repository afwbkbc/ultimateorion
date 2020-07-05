class MainMenuGuest extends require( './MainMenu' ) {
	
	constructor( session ) {
		super( module.filename, session );
	}
	
	Init() {
		super.Init();
		
		this.MainMenu = this.AddElement( 'Block/MainMenuGuest', [ 'RB', 'RB' ], [ -50, -50 ], {} );
	}
	
}

module.exports = MainMenuGuest;
