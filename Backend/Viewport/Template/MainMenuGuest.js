class MainMenuGuest extends require( './MainMenu' ) {
	
	constructor( session ) {
		super( module.filename, session );

		this.MainMenu = this.AddElement( 'Layout/Panel', [ 'RB', 'RB' ], [ -50, -50 ], {
			Style: 'main-menu-block',
			Width: 540,
			Height: 460,
		});
		
		this.MainMenu.AddElement( 'UI/Label', [ 'CT', 'CT' ], [ 0, 30 ], {
			Text: 'Welcome, Guest!',
		});
		
		this.MainMenu.AddElement( 'UI/Button', [ 'CT', 'CT' ], [ 0, 120 ], {
			Label: 'Login',
			Width: 400,
			Height: 80,
		});
		
		this.MainMenu.AddElement( 'UI/Button', [ 'CT', 'CT' ], [ 0, 220 ], {
			Label: 'Register',
			Width: 400,
			Height: 80,
		});

		this.AddMainMenuLinks();
		
	}
	
}

module.exports = MainMenuGuest;
