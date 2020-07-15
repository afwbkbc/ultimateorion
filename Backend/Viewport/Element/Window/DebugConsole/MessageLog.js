class MessageLog extends require( '../../Layout/Panel' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Width: 1920,
			Height: 510,
		});
		
		this.Messages = [];
	}
	
	Prepare() {
		super.Prepare();
		
		this.MessageBlock = this.AddElement( 'Layout/Block', [ 'CB', 'CB' ], [ 0, 0 ], {
			ElementAttributes: {
				Width: 1920,
				Height: this.Attributes.FontSize,
				FontSize: this.Attributes.FontSize,
				Margin: 2,
				Anchors: [ 'LT', 'LT' ],
			},
		});
	}

	PushMessage( line ) {
		this.Messages.push( this.MessageBlock.Append( 'UI/Label', {
			Text: line,
		}));
	}
	
	PopMessage() {
		if ( this.Messages.length > 0 )
			this.MessageBlock.Remove( this.Messages.splice( 0, 1 )[ 0 ] );
	}
}

module.exports = MessageLog;
