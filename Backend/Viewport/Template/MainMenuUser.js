class MainMenuUser extends require( './MainMenu' ) {
	
	constructor( session ) {
		super( module.filename, session );
	}
	
	Init() {
		super.Init();
		
		this.MainMenu = this.AddElement( 'Block/MainMenuUser', [ 'RB', 'RB' ], [ -50, -50 ], {} );
		this.UpdateGamesList();
	}
	
	UpdateGamesList() {
		var players = this.Session.Players;
		
		if ( Object.keys( players ).length > 0 ) {
			
			if ( !this.GamesList ) {
				this.GamesList = this.AddElement( 'Block/GamesList', [ 'LB', 'LB' ], [ 50, -50 ], {} );
				this.GamesListItems = {};
			}
			
			// remove abandoned game(s)
			for ( var k in this.GamesListItems ) {
				if ( !this.Session.Players[ k ] ) {
					this.GamesList.RemoveElement( this.GamesListItems[ k ] );
					delete this.GamesListItems[ k ];
				}
			}
			
			// add new games
			for ( var k in players ) {
				if ( !this.GamesListItems[ k ] ) {
					var game = players[ k ].Game;
					var gameblock = this.GamesList.Append( 'Layout/Panel', {
						
					});
					gameblock.AddElement( 'UI/Label', [ 'LC', 'LC' ], [ 14, 0 ], {
						Text: game.Name,
					});
					gameblock.AddElement( 'UI/Button', [ 'RC', 'RC' ], [ -14, 0 ], {
						Width: 120,
						Height: 46,
						Label: 'Play',
					})
						.On( 'click', () => {
							console.log( 'PLAY', players[ k ].Game );
						})
					;
					this.GamesListItems[ k ] = gameblock;
				}
			}
			
		}
		else {
			if ( this.GamesList ) {
				this.RemoveElement( this.GamesList );
				delete this.GamesList;
				delete this.GamesListItems;
			}
		}
	}
	
}

module.exports = MainMenuUser;
