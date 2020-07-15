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
		
	}

}

module.exports = ActionBlock;
