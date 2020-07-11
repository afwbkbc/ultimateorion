class Game extends require( '../Layout/Window' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			WithTitlebar: false,
			WithCloseButton: false,
		});
		
		//this.Game = game;
	}
	
	Prepare() {
		super.Prepare();

		//this.Hide();
		
		this.Manager( 'Game' ).FindGame( this.Attributes.Game.Id, {
			caller: this.Id,
			parameters: {
				/*Players: { // needed?
					[ this.Id ]: this,
				},*/
			},
		})
			.then( ( game ) => {
				
				if ( this.Window )
					this.Viewport.RemoveElement( this.Window );
				
				if ( game.GameState == 'lobby' ) {
					this.Window = this.Viewport.ShowWindow( 'Window/Game/Lobby', {
						Game: this.Attributes.Game,
					});
				}
				else
					throw new Error( 'unknown/invalid game state "' + game.GameState + '"' );
				
				this.Window.On( 'close', () => {
					this.Close();
				});
				
			})
			.catch( ( e ) => {
				throw ( e );
			})
		;
		
	}
	
}

module.exports = Game;
