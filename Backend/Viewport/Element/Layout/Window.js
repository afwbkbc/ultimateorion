class Window extends require( '../BlockElement' ) {

	constructor( filename ) {
		super( filename ? filename : module.filename );
		
		this.SetCoreClass( module.filename );
		
		this.SetAttributes({
			Title: '',
			TitlebarHeight: 64,
			HasBorder: true,
			WithTitlebar: true,
			WithCloseButton: true,
			WithFadeBackground: true,
		});
		
		this.IsOpen = true;
	}
	
	Prepare() {
		
		if ( this.Attributes.WithTitlebar ) {
			this.Titlebar = this.AddElement( 'Layout/Panel', [ 'LT', 'LT' ], [ 0, 0 ], {
				Style: 'window-titlebar',
				Width: this.Attributes.Width - ( this.Attributes.WithCloseButton ? this.Attributes.TitlebarHeight : 0 ),
				Height: this.Attributes.TitlebarHeight,
				HasBorder: this.Attributes.HasBorder,
				HasBackground: this.Attributes.HasBackground,
			});
			{
				this.TitlebarText = this.Titlebar.AddElement( 'UI/Label', [ 'CC', 'CC' ], [ 0, 0 ], {
					Style: 'window-titlebar',
					Text: this.Attributes.Title,
				});
			}
		}
		if ( this.Attributes.WithCloseButton ) {
			this.CloseButton = this.AddElement( 'UI/Button', [ 'RT', 'RT' ], [ 0, 0 ], {
				Style: 'window-closebutton',
				Width: this.Attributes.TitlebarHeight,
				Height: this.Attributes.TitlebarHeight,
				Label: 'X',
			});
			this.CloseButton.On( 'click', () => {
				this.Close({
					closed_by_user: true,
				});
			});
		}
			
		this.Body = this.AddElement( 'Layout/Panel', [ 'LB', 'LB' ], [ 0, 0 ], {
			Style: 'window-body',
			Width: this.Attributes.Width,
			Height: this.Attributes.Height - ( this.Attributes.WithTitlebar ? this.Attributes.TitlebarHeight : 0 ),
			HasBorder: this.Attributes.HasBorder,
			HasBackground: this.Attributes.HasBackground,
		});
		
		this.On( 'close', ( data, event ) => {
			this.Parent.RemoveElement( this );
		});
	}
	
	Close( data ) {
		if ( this.IsOpen ) {
			this.IsOpen = false;
			this.Trigger( 'close', data );
		}
	}
	
}

module.exports = Window;
