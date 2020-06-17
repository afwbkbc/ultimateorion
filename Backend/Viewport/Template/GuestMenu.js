class GuestMenu extends require( '../Viewport' ) {
	
	constructor( session ) {
		super( session );

		this.WelcomeLabel = this.CreateElement( 'UI/Label', 0.3, 0.5, 'C', {
			Text: 'kekw',
		});
		
	}
	
}

module.exports = GuestMenu;
