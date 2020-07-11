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
			ElementHasBorder: true,
		});
		
		this.GetRepository( 'Games_List' )
			.then( ( repository ) => {

				this.Listen( repository )
					.On( 'add', ( data ) => {
						var game = data.Entity;
						if ( this.GameRows[ game.Id ] )
							throw new Error( 'game row already exists for game "' + game.Id + '"' );
						
						if ( !game.FindPlayerForUser( this.Viewport.Session.User ) ) { // do not show if already joined
							this.GameRows[ game.Id ] = this.GameRowsBlock.Append( 'Window/GameBrowser/GameRow', {
								Game: game,
							})
								.On( 'join', () => {
									this.Close();
									game.AddPlayerForUser( this.Viewport.Session.User );
								})
							;
						}
					})
					.On( 'remove', ( data ) => {
						var game = data.Entity;
						if ( this.GameRows[ game.Id ] ) {
							this.GameRowsBlock.Remove( this.GameRows[ game.Id ] );
							delete this.GameRows[ game.Id ];
						}
					})
					.On( 'change', ( data ) => {
						console.log( 'CHANGE', data.Entity );
					})
				;
				
			})
			.catch( ( e ) => {
				throw e;
			})
		;
		
	}
	
}

module.exports = GameBrowser;
