class Messages extends require( '../../../../Layout/Panel' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			
		});
		
	}
	
	Prepare() {
		super.Prepare();
		
		this.MessageBlock = this.AddElement( 'Layout/Block', [ 'LB', 'LB' ], [ 20, -10 ], {
			ElementAttributes: {
				Width: this.Attributes.Width - 40,
				Height: 32,
				FontSize: 32,
				Margin: 0,
				Anchors: [ 'LT', 'LT' ],
			},
		});
		this.Messages = [];
	}
	
	PushMessage( text ) {
		// TODO: ScrollBlock
		if ( this.Messages.length >= 6 )
			this.PopMessage();
		this.Messages.push( this.MessageBlock.Append( 'UI/Label', {
			Text: text,
		}));
	}
	
	PopMessage() {
		if ( this.Messages.length > 0 )
			this.MessageBlock.Remove( this.Messages.splice( 0, 1 )[ 0 ] );
	}

}

module.exports = Messages;
