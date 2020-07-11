class GamesList extends require( '../Layout/Block' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Style: 'main-menu-block',
			ElementWidth: 680,
			ElementHeight: 64,
			ElementMargin: 14,
			ElementHasBorder: true,
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
		
		this.GetRepository( 'Games_List' )
			.then( ( repository ) => {

				var add_game = ( game ) => {
					if ( !this.GameRows[ game.Id ] ) {
						this.GameRows[ game.Id ] = this.Append( 'Block/GamesList/GameRow', {
							Game: game,
						});
						
						this.Show();
					}
				}
				
				var remove_game = ( game ) => {
					if ( this.GameRows[ game.Id ] ) {
						this.Remove( this.GameRows[ game.Id ] );
						delete this.GameRows[ game.Id ];
						if ( Object.keys( this.GameRows ).length == 0 )
							this.Hide();
					}
				}
				
				this.Listen( repository )
					.On( 'add', ( data ) => {
						var game = data.Entity;
						if ( game.FindPlayerForUser( this.Viewport.Session.User ) ) // show only if joined this game
							add_game( game );
					})
					.On( 'remove', ( data ) => {
						var game = data.Entity;
						remove_game( game );
					})
					.On( 'event', ( data ) => {
						if ( data.EventType == 'player_join' && data.Data.Player.User.ID == this.Viewport.Session.User.ID )
							add_game( data.Entity );
						else if ( data.EventType == 'player_leave' && data.Data.Player.User.ID == this.Viewport.Session.User.ID )
							remove_game( data.Entity );
					})
				;
				
			})
			.catch( ( e ) => {
				throw e;
			})
		;

		
	}
	
}

module.exports = GamesList;
