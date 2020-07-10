class Game extends require( '../../Element' ) {

	constructor( game ) {
		super( module.filename );
		
		this.Game = game;
	}
	
	Prepare() {
		super.Prepare();

		console.log( 'GAMEWINDOW' );
		
	}
	
}

module.exports = Game;
