class TopBar extends require( '../../../Layout/Panel' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Style: 'game-topbar',
			Width: 1920,
			Height: 60,
			HasBorder: true,
		});
	}
	
	Prepare() {
		
		this.Game = this.Attributes.UniverseWindow.Game;
		this.Player = this.Attributes.UniverseWindow.Player;
		
		this.TopRightMenuButton = this.AddElement( 'UI/Button', [ 'RT', 'RT' ], [ 0, 0 ], {
			Label: '≡',
			Width: 60,
			Height: 60,
			FontSize: 60,
		})
			.On( 'click', () => {
				if ( this.TopRightMenu ) {
					this.RemoveElement( this.TopRightMenu );
					this.TopRightMenu = null;
				}
				else {
					this.TopRightMenu = this.AddElement( 'Window/Game/Universe/TopBar/TopRightMenu', [ 'RT', 'RT' ], [ 0, 8 + this.Attributes.Height - 8 ] )
						.On( 'item_click', ( data ) => {
							switch ( data.Item ) {
								case 'return_to_main_menu': {
									this.Attributes.UniverseWindow.Close();
									break;
								}
								case 'leave_game': {
									this.Viewport.ShowWindow( 'Window/YesNoPrompt', {
										PromptText: 'Leave this game? You won\'t be able to return later.',
									})
										.On( 'confirm', () => {
											this.Game.RemovePlayerForUser( this.Player.User );
										})
									;
									break;
								}
							}
						})
					;
				}
			})
		;
		
		
		
	}
	
}

module.exports = TopBar;
