class MainMenu extends require( '../Layout/Block' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Style: 'main-menu-block',
			ElementAttributes: {
				Width: 460,
				Height: 64,
				Margin: 20,
			},
			HasBorder: true,
		});
		
	}
	
}

module.exports = MainMenu;
