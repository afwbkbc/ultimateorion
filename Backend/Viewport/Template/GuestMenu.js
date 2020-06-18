class GuestMenu extends require( '../Viewport' ) {
	
	constructor( session ) {
		super( module.filename, session );

		this.WelcomeLabel = this.AddElement( 'UI/Label', [ 'BC', 'BC' ], [ 0, 0 ],  {
			Text: 'Loading',
		});
		
	}
	
}

module.exports = GuestMenu;
