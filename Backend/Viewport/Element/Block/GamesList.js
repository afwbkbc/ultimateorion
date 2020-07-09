class GamesList extends require( '../Layout/Block' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Style: 'main-menu-block',
			ElementWidth: 680,
			ElementHeight: 64,
			ElementMargin: 14,
		});
	}
	
	Prepare() {
		super.Prepare();
		
		this.Append( 'UI/BlockLabel', {
			Text: 'Your active games:',
			TextAnchors: [ 'LC', 'LC' ],
		});
	}
	
}

module.exports = GamesList;
