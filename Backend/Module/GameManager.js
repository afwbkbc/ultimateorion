class GameManager extends require( './_Module' ) {
	
	constructor() {
		super( module.filename );
		
		this.Md5 = require( 'md5' );
		this.Game = require( '../Game/Game' );
		
		this.GamePool = {};
		this.NextGameId = 0;
		
	}
	
	Run() {
		return new Promise( ( next, fail ) => {
			
			//this.UserSession = this.E.M.Sql.Models.UserSession;
			
			return next();
		});
	}
	
	CreateGame( game_name, game_host ) {
		var game_id = ++this.NextGameId;
		if ( typeof( this.GamePool[ game_id ] ) !== 'undefined' )
			throw new Error( 'GamePool collision at #' + game_id );
		var game = new this.Game( this, game_id, game_name, game_host );
		this.GamePool[ game_id ] = game;
		console.log( '+GAME', game.Id );
		return game;
	}
	
	DestroyGame( game ) {
		if ( typeof( this.GamePool[ game.Id ] ) === 'undefined' )
			throw new Error( 'GamePool game #' + game.Id + ' does not exist' );
		console.log( '-GAME', game.Id );
		delete this.GamePool[ game.Id ];
		game.Destroy();
	}
	
}

module.exports = GameManager;
