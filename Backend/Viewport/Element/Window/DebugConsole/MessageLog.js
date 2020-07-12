class MessageLog extends require( '../../Layout/Panel' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Width: 1920,
			Height: 510,
		});
	}
	
	Prepare() {
		super.Prepare();
		
		this.Messages = this.AddElement( 'Layout/Block', [ 'CB', 'CB' ], [ 0, 0 ], {
			ElementAttributes: {
				Width: 1920,
				Height: this.Attributes.FontSize,
				FontSize: this.Attributes.FontSize,
				Margin: 2,
				Anchors: [ 'LT', 'LT' ],
			},
		});
	}

	AddLine( line ) {
		this.Messages.Append( 'UI/Label', {
			Text: line,
		});
	}
}

module.exports = MessageLog;
