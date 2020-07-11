class ActionBlock extends require( '../../../Layout/Block' ) {

	constructor() {
		super( module.filename );
		
	}
	
	Prepare() {
		this.SetAttributes({
			 ElementMargin: 20,
			 ElementWidth: this.Attributes.Width,
			 ElementHeight: 60,
			 ElementHasBorder: true,
		});
		
		super.Prepare();
		
		this.Append( 'UI/Button', {
			Label: 'Ready',
		});
		
		this.Append( 'UI/Button', {
			Label: 'Not ready',
		});
		
		this.Append( 'UI/Button', {
			Label: 'Leave game',
		});
		
		/*this.Rows = this.AddElement( 'Window/Game/Lobby/' + this.Attributes.BlockType + '/Rows', [ 'LT', 'LT' ], [ 0, 60 ], {
			Width: this.Attributes.Width,
			Height: this.Attributes.Height - 60,
		});*/
	}

}

module.exports = ActionBlock;
