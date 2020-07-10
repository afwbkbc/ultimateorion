class Lobby extends require( '../../Layout/Window' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Style: 'game-lobby',
			Width: 1920,
			Height: 1080,
		});
		
	}
	
	Prepare() {
		
		this.SetAttributes({
			Title: this.Attributes.Game.Name + ' - lobby',
		});
		
		super.Prepare();

	}
	
}

module.exports = Lobby;
