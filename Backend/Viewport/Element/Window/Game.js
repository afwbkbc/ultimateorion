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

		this.On( 'close', () => {
			if ( this.Window ) {
				//this.Window.Close();
				this.Window = null;
			}
		})
		
		this.Manager( 'Game' ).FindGame( this.Attributes.Game.Id, {
			caller: this.Id,
			parameters: {
				/*Players: { // needed?
					[ this.Id ]: this,
				},*/
			},
		})
			.then( ( game ) => {
				
				if ( !game ) { // invalid game id
					this.Close();
					return;
				}
				
				this.Game = game;
				this.Player = this.Game.FindPlayerForUser( this.Viewport.Session.User );
				if ( !this.Player ) {
					this.Close();
					return;
				}
				
				this.DisplayGameWindow();
				
				this.Listen( this.Game )
					.On( 'player_leave', ( data ) => {
						if ( data.Player.Id == this.Player.Id )
							this.Close();
					})
					.On( 'state_change', ( data ) => {
						this.DisplayGameWindow();
					})
					.On( 'destroy', () => {
						this.Close();
					})
				;
			})
			.catch( ( e ) => {
				throw ( e );
			})
		;
		
	}
	
	DisplayGameWindow() {
		
		if ( this.Window ) {
			this.Window.Close();
			this.Window = null;
		}
		
		var p = {
			Game: this.Game,
			Player: this.Player,
		};
		
		if ( this.Game.GameState == 'lobby' ) {
			this.Window = this.Viewport.ShowWindow( 'Window/Game/Lobby', p );
		}
		else if ( this.Game.GameState == 'universe' ) {
			this.Window = this.Viewport.ShowWindow( 'Window/Game/Universe', p );
		}
		else
			throw new Error( 'unknown/invalid game state "' + this.Game.GameState + '"' );
		
		this.Window.On( 'close', ( data ) => {
			if ( this.Window && data.ElementId == this.Window.Id) // existing window has been closed so it's not window switch
				this.Close();
		});
		
	}
	
}

module.exports = Game;
