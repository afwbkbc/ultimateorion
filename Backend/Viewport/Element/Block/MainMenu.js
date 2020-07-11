class MainMenu extends require( '../Layout/Block' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Style: 'main-menu-block',
			ElementWidth: 460,
			ElementHeight: 64,
			ElementMargin: 20,
			HasBorder: true,
		});
		
	}
	
}

module.exports = MainMenu;
