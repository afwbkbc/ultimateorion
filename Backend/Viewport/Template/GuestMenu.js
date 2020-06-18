class GuestMenu extends require( '../Viewport' ) {
	
	constructor( session ) {
		super( module.filename, session );

		this.WelcomeLabel = this.AddElement( 'UI/Label', [ 'CB', 'CB' ], [ 0, 0 ],  {
			Text: 'Loading',
		});
		
	}
	
}

module.exports = GuestMenu;
