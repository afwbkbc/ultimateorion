class MainMenu extends require( '../Viewport' ) {
	
	constructor( filename, session ) {
		super( filename, session );

		this.Logo = this.AddElement( 'UI/Label', [ 'LT', 'LT' ], [ 400, 50 ],  {
			Style: 'main-menu-logo',
			Text: 'UltimateOrion',
		});
		this.Version = this.AddElement( 'UI/Label', [ 'LT', 'LT' ], [ 670, 100 ], {
			Style: 'main-menu-version',
			Text: 'v.0.0.1',
		});

		this.AddMainMenuLinks = () => {
			
			this.MainMenu.AddElement( 'UI/Button', [ 'CT', 'CT' ], [ 0, 320 ], {
				Label: 'Quit',
				Width: 400,
				Height: 80,
			})
				.On( 'click', ( event ) => {
					event.Reply({
						action: 'client_quit',
					});
				});
			;
			
		}
	}
	
}

module.exports = MainMenu;
