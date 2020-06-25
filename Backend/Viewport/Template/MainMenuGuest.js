class MainMenuGuest extends require( './MainMenu' ) {
	
	constructor( session ) {
		super( module.filename, session );

		this.MainMenu = this.AddElement( 'Layout/Panel', [ 'RB', 'RB' ], [ -50, -50 ], {
			Style: 'main-menu-block',
			Width: 440,
			Height: 340,
		});
		
		this.MainMenu.AddElement( 'UI/Label', [ 'CT', 'CT' ], [ 0, 30 ], {
			Text: 'Welcome, Guest!',
		});
		
		this.MainMenu.AddElement( 'UI/Button', [ 'CT', 'CT' ], [ 0, 96 ], {
			Label: 'Login',
			Width: 400,
			Height: 64,
		})
			.On( 'click', () => {
				this.MainMenu.Disable();
				
				this.Login = this.AddElement( 'Window/LoginWindow', [ 'CC', 'CC' ], [ 0, 0 ], {})
					.On( 'close', () => {
						delete this.Login;
						this.MainMenu.Enable();
					})
					.On( 'success', () => {
						console.log( 'LOGIN SUCCESS!' );
					})
				;
				
			})
		;
		
		this.MainMenu.AddElement( 'UI/Button', [ 'CT', 'CT' ], [ 0, 176 ], {
			Label: 'Register',
			Width: 400,
			Height: 64,
		})
			.On( 'click', () => {
				this.MainMenu.Disable();
				
				this.Register = this.AddElement( 'Window/RegisterWindow', [ 'CC', 'CC' ], [ 0, 0 ], {})
					.On( 'close', () => {
						delete this.Register;
						this.MainMenu.Enable();
					})
					.On( 'success', () => {
						console.log( 'REGISTER SUCCESS!' );
					})
				;
			})
		;

		this.AddMainMenuLinks();
		
	}
	
}

module.exports = MainMenuGuest;
