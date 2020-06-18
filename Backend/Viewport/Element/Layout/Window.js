class Window extends require( '../BlockElement' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Title: '',
			TitlebarHeight: 80,
		});
		
	}
	
	Prepare() {
		this.Titlebar = this.AddElement( 'Layout/Panel', [ 'LT', 'LT' ], [ 0, 0 ], {
			Style: 'window-titlebar',
			Width: this.Attributes.Width,
			Height: this.Attributes.TitlebarHeight,
		});
		this.TitlebarText = this.Titlebar.AddElement( 'UI/Label', [ 'CC', 'CC' ], [ 0, 0 ], {
			Text: this.Attributes.Title,
			Style: 'window-titlebar',
		});
		this.Body = this.AddElement( 'Layout/Panel', [ 'LB', 'LB' ], [ 0, 0 ], {
			Style: 'window-body',
			Width: this.Attributes.Width,
			Height: this.Attributes.Height - this.Attributes.TitlebarHeight,
		});
		
	}
	
}

module.exports = Window;
