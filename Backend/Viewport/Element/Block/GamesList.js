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

				this.Listen( repository )
					.On( 'add', ( data ) => {
						var game = data.Entity;
						if ( this.GameRows[ game.Id ] )
							throw new Error( 'game row already exists for game "' + game.Id + '"' );
						
						if ( game.FindPlayerForUser( this.Viewport.Session.User ) ) { // do not show if not joined
							this.GameRows[ game.Id ] = this.Append( 'Block/GamesList/GameRow', {
								Game: game,
							});
							this.Show();
						}
					})
					.On( 'remove', ( data ) => {
						var game = data.Entity;
						if ( this.GameRows[ game.Id ] ) {
							this.Remove( this.GameRows[ game.Id ] );
							delete this.GameRows[ game.Id ];
							if ( Object.keys( this.GameRows ).length == 0 )
								this.Hide();
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

module.exports = GamesList;
