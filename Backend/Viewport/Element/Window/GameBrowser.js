class GameBrowser extends require( '../Layout/Window' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Title: 'Game browser',
			Style: 'main-menu-form',
			Width: 1600,
			Height: 1000,
		});
	}
	
	Prepare() {
		super.Prepare();
		

		
	}
	
}

module.exports = GameBrowser;
