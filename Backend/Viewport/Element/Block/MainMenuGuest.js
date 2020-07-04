class MainMenuGuest extends require( './MainMenu' ) {

	constructor() {
		super( module.filename );
		
		
		this.SetAttributes({
			
		});
		
	}
	
	Prepare() {
		super.Prepare();
		
		this.Append( 'UI/BlockLabel', {
			Text: 'Welcome, Guest!',
		});
		
		this.Append( 'UI/Button', {
			Label: 'Login',
		})
			.On( 'click', () => {
				this.Disable();
				
				this.Login = this.Viewport.AddElement( 'Window/Login', [ 'CC', 'CC' ], [ 0, 0 ], {})
					.On( 'close', () => {
						delete this.Login;
						this.Enable();
					})
					.On( 'success', ( data, event ) => {
						event.connection.Send( 'set_user_token', {
							token: data.token,
						})
					})
				;
				
			})
		;
		
		this.Append( 'UI/Button', {
			Label: 'Register',
		})
			.On( 'click', () => {
				this.Disable();
				
				this.Register = this.Viewport.AddElement( 'Window/Register', [ 'CC', 'CC' ], [ 0, 0 ], {})
					.On( 'close', () => {
						delete this.Register;
						this.Enable();
					})
					.On( 'success', ( data, event ) => {
						event.connection.Send( 'set_user_token', {
							token: data.token,
						})
					})
				;
			})
		;

	}
	
}

module.exports = MainMenuGuest;
