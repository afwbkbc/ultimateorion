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
		
		this.GameRows = {};
		this.GameRowsBlock = this.Body.AddElement( 'Layout/Block', [ 'LT', 'LT' ], [ 0, 0 ], {
			Width: this.Body.Attributes.Width,
			ElementWidth: this.Body.Attributes.Width,
			ElementHeight: 100,
			ElementMargin: 20,
			NoBorder: true,
		});
		
		this.GetRepository( 'Games_List' )
			.then( ( repository ) => {

				this.GamesListener = repository.CreateListener()
					.On( 'add', ( data ) => {
						var game = data.Entity;
						if ( this.GameRows[ game.Id ] )
							throw new Error( 'game row already exists for game "' + game.Id + '"' );
						
						if ( !game.FindPlayerForUser( this.Viewport.Session.User ) ) { // do not show if already joined
							this.GameRows[ game.Id ] = this.GameRowsBlock.Append( 'Block/GameBrowser/GameRow', {
								GameId: game.Id,
								GameName: game.Name,
								GameHost: game.Host.User.Username,
							});
						}
					})
					.On( 'remove', ( data ) => {
						console.log( 'REMOVE', data.Entity );
					})
					.On( 'change', ( data ) => {
						console.log( 'CHANGE', data.Entity );
					})
					.Attach()
				;
				
				/*repository.FindAll()
					.then( ( games ) => {
						console.log( 'GAMES', games );
					})
				;*/
				
				//console.log( 'LISTENER', this.GamesListener );
				
			})
		
		//console.log( 'REPO', this.GamesListRepository );
		
	}
	
	OnDestroy() {
		if ( this.GamesListener )
			this.GamesListener.Detach();
	}
	
}

module.exports = GameBrowser;
