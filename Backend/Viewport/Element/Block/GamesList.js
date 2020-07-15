class GamesList extends require( '../Layout/Block' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Style: 'main-menu-block',
			ElementAttributes: {
				Width: 680,
				Height: 54,
				Margin: 12,
				HasBorder: true,
			},
			HasBorder: true,
		});
	}
	
	Prepare() {
		super.Prepare();
		
		this.Hide();
		
		this.Append( 'UI/BlockLabel', {
			Text: 'Your active games:',
			TextAnchors: [ 'LC', 'LC' ],
		});
		
		this.GameRows = {};
		
		var remove_game = ( game ) => {
			if ( this.GameRows[ game.Id ] ) {
				this.Remove( this.GameRows[ game.Id ] );
				delete this.GameRows[ game.Id ];
				if ( Object.keys( this.GameRows ).length == 0 )
					this.Hide();
			}
		}
		
		var add_game = ( game ) => {
			if ( !this.GameRows[ game.Id ] ) {
				this.GameRows[ game.Id ] = this.Append( 'Block/GamesList/GameRow', {
					Game: game,
				});
				
				game
					.On( 'destroy', () => {
						remove_game( game );
					})
				;
				
				this.Show();
			}
		}
		
		this.Session = this.Viewport.Session;
		
		for ( var k in this.Session.Players ) {
			var player = this.Session.Players[ k ];
			add_game( player.Game );
		}
		
		this.Session
			.On( 'game_join', ( data ) => {
				add_game( data.Game );
			})
			.On( 'game_leave', ( data ) => {
				remove_game( data.Game );
			})
		;
		
	}
	
}

module.exports = GamesList;
