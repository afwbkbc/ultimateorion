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
		
		this.Messages = this.AddElement( 'Window/Game/Lobby/Chat/Messages', [ 'LT', 'LT' ], [ 15, 60 ], {
			Width: this.Attributes.Width - 30,
			Height: this.Attributes.Height - 150,
			HasBorder: true,
		});
		
		this.ChatInput = this.AddElement( 'UI/Input', [ 'LB', 'LB' ], [ 15, -15 ], {
			Width: this.Attributes.Width - 210,
			Height: 60,
			HasBorder: true,
		});
		
		this.ChatButton = this.AddElement( 'UI/Button', [ 'RB', 'RB' ], [ -15, -15 ], {
			Width: 160,
			Height: 60,
			Label: 'Send',
			DefaultButton: true,
		})
			.On( 'click', () => {
				var text = this.ChatInput.Attributes.Value;
				if ( text ) {
					this.ChatInput.SetAttribute( 'Value', '', true );
					this.Trigger( 'message', {
						Text: text,
					});
				}
				this.ChatInput.Focus();
			})
		;
		
	}
	
	PushMessage( text ) {
		this.Messages.PushMessage( text );
	}
	
	PopMessage() {
		this.Messages.PopMessage();
	}

}

module.exports = Chat;
