class MainMenuUser extends require( './MainMenu' ) {
	
	constructor( session ) {
		super( module.filename, session );
	}
	
	Init() {
		super.Init();
		
		this.MainMenu = this.AddElement( 'Block/MainMenuUser', [ 'RB', 'RB' ], [ -50, -50 ], {} );
		this.GamesList = this.AddElement( 'Block/GamesList', [ 'LB', 'LB' ], [ 50, -50 ], {} );
		
	}
	
}

module.exports = MainMenuUser;
