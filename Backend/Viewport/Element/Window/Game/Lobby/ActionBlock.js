class ActionBlock extends require( '../../../Layout/Block' ) {

	constructor() {
		super( module.filename );
		
	}
	
	Prepare() {
		this.SetAttributes({
			 ElementAttributes: {
				 Margin: 20,
				 Width: this.Attributes.Width,
				 Height: 60,
				 HasBorder: true,
			 },
		});
		
		super.Prepare();
		
		this.Append( 'UI/Button', {
			Label: 'Ready',
		})
			.On( 'click', () => {
				this.Trigger( 'ready', {
					State: true,
				});
			})
		;
		
		this.Append( 'UI/Button', {
			Label: 'Not ready',
		})
			.On( 'click', () => {
				this.Trigger( 'ready', {
					State: false,
				});
			})
		;
		
		this.Append( 'UI/Button', {
			Label: 'Leave game',
		})
			.On( 'click', ( data ) => {
				this.Trigger( 'leave' );
			})
		;
		
		/*this.Rows = this.AddElement( 'Window/Game/Lobby/' + this.Attributes.BlockType + '/Rows', [ 'LT', 'LT' ], [ 0, 60 ], {
			Width: this.Attributes.Width,
			Height: this.Attributes.Height - 60,
		});*/
	}

}

module.exports = ActionBlock;
