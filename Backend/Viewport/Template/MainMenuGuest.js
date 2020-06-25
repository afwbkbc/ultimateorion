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
		})
			.On( 'click', () => {
				this.MainMenu.Disable();
				this.Login = this.AddElement( 'Layout/Window', [ 'CC', 'CC' ], [ 0, 0 ], {
					Style: 'login-form',
					Title: 'Login',
					Width: 640,
					Height: 560,
				})
					.On( 'close', () => {
						delete this.Login;
						this.MainMenu.Enable();
					})
				;
				this.Login.Form = this.Login.Body.AddElement( 'Form/LoginForm', [ 'LT', 'LT' ], [ 0, 0 ], {
					Width: this.Login.Attributes.Width,
					Height: this.Login.Attributes.Height,
				});
			})
		;
		
		this.MainMenu.AddElement( 'UI/Button', [ 'CT', 'CT' ], [ 0, 220 ], {
			Label: 'Register',
			Width: 400,
			Height: 80,
		})
			.On( 'click', () => {
				this.MainMenu.Disable();
				this.Register = this.AddElement( 'Layout/Window', [ 'CC', 'CC' ], [ 0, 0 ], {
					Style: 'login-form',
					Title: 'Register',
					Width: 640,
					Height: 740,
				})
					.On( 'close', () => {
						delete this.Register;
						this.MainMenu.Enable();
					})
				;
				this.Register.Form = this.Register.Body.AddElement( 'Form/RegisterForm', [ 'LT', 'LT' ], [ 0, 0 ], {
					Width: this.Register.Attributes.Width,
					Height: this.Register.Attributes.Height,
				});
			})
		;

		this.AddMainMenuLinks();
		
	}
	
}

module.exports = MainMenuGuest;
