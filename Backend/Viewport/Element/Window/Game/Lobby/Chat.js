class Chat extends require( '../../../Layout/Panel' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			HasBorder: true,
		});
	}
	
	Prepare() {
		super.Prepare();
		
		this.Label = this.AddElement( 'UI/Label', [ 'CT', 'CT' ], [ 0, 15 ], {
			Text: 'CHAT',
		});
		
		this.ChatLog = this.AddElement( 'Layout/Panel', [ 'LT', 'LT' ], [ 15, 60 ], {
			Width: this.Attributes.Width - 30,
			Height: this.Attributes.Height - 150,
			HasBorder: true,
		});
		
		this.ChatInput = this.AddElement( 'Layout/Panel', [ 'LB', 'LB' ], [ 15, -15 ], {
			Width: this.Attributes.Width - 210,
			Height: 60,
			HasBorder: true,
		});
		
		this.ChatButton = this.AddElement( 'UI/Button', [ 'RB', 'RB' ], [ -15, -15 ], {
			Width: 160,
			Height: 60,
			Label: 'Send',
		});
		
		//console.log( 'CHATLOG', this.ChatLog );
		
		/*this.Rows = this.AddElement( 'Window/Game/Lobby/' + this.Attributes.BlockType + '/Rows', [ 'LT', 'LT' ], [ 0, 60 ], {
			Width: this.Attributes.Width,
			Height: this.Attributes.Height - 60,
		});*/
	}

}

module.exports = Chat;
