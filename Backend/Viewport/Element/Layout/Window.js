class Window extends require( '../BlockElement' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Title: '',
			TitlebarHeight: 80,
			WithCloseButton: true,
		});
		
	}
	
	Prepare() {
		this.Titlebar = this.AddElement( 'Layout/Panel', [ 'LT', 'LT' ], [ 0, 0 ], {
			Style: 'window-titlebar',
			Width: this.Attributes.Width - ( this.Attributes.WithCloseButton ? this.Attributes.TitlebarHeight : 0 ),
			Height: this.Attributes.TitlebarHeight,
		});
		{
			this.TitlebarText = this.Titlebar.AddElement( 'UI/Label', [ 'CC', 'CC' ], [ 0, 0 ], {
				Style: 'window-titlebar',
				Text: this.Attributes.Title,
			});
		}
		
		if ( this.Attributes.WithCloseButton ) {
			this.CloseButton = this.AddElement( 'UI/Button', [ 'RT', 'RT' ], [ 0, 0 ], {
				Style: 'window-closebutton',
				Width: this.Attributes.TitlebarHeight,
				Height: this.Attributes.TitlebarHeight,
				Label: 'X',
			});
			this.CloseButton.On( 'click', () => {
				this.Parent.RemoveElement( this );
				this.Trigger( 'close' );
			});
		}
			
		this.Body = this.AddElement( 'Layout/Panel', [ 'LB', 'LB' ], [ 0, 0 ], {
			Style: 'window-body',
			Width: this.Attributes.Width,
			Height: this.Attributes.Height - this.Attributes.TitlebarHeight,
		});
		
	}
	
}

module.exports = Window;
