class TopRightMenu extends require( '../../../../Layout/Block' ) {
	
	constructor() {
		super( module.exports );
		
	}
	
	Prepare() {
		
		this.SetAttributes({
			ElementAttributes: {
				Margin: 8,
				Width: 300,
				Height: 40,
				FontSize: 24,
			},
			HasBorder: true,
		});
		
		super.Prepare();
		
		this.Append( 'UI/Button', {
			Label: 'Leave game',
		})
			.On( 'click', () => {
				this.Trigger( 'item_click', {
					Item: 'leave_game',
				});
			})
		;
		
		this.Append( 'UI/Button', {
			Label: 'Return to main menu',
		})
			.On( 'click', () => {
				this.Trigger( 'item_click', {
					Item: 'return_to_main_menu',
				});
			})
		;
		
	}
	
}

module.exports = TopRightMenu;
