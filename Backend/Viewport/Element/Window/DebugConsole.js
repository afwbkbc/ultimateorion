class DebugConsole extends require( '../Layout/Window' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Style: 'debug-console',
			Width: 1920,
			Height: 1080,
			FontSize: 16,
			Padding: 4,
			HasBackground: false,
			HasBorder: false,
			WithTitlebar: false,
			WithCloseButton: false,
			ZIndex: 10000,
		});
		
		this.Prefixes = [ '', '<' ];
	}
	
	Prepare() {
		super.Prepare();
		
		this.MessageLog = this.AddElement( 'Window/DebugConsole/MessageLog', [ 'LT', 'LT' ], [ 0, 0 ], {
			FontSize: this.Attributes.FontSize,
		});
		this.Input = this.AddElement( 'UI/Input', [ 'LT', 'LT' ], [ 0, 510 ], {
			Width: 1814,
			MaxLength: 204,
			FontSize: this.Attributes.FontSize,
			Padding: this.Attributes.Padding,
		})
			.On( 'blur', () => {
				this.Input.Focus();
			})
		;
		this.Submit = this.AddElement( 'UI/Button', [ 'RT', 'RT' ], [ 0, 510 ], {
			Width: 100,
			Label: 'Send',
			FontSize: this.Attributes.FontSize,
			Padding: this.Attributes.Padding,
			DefaultButton: true,
		})
			.On( 'click', () => {
				var commandline = this.Input.Attributes.Value;
				if ( commandline ) {
					this.Input.SetAttribute( 'Value', '', true );
					this.Log( commandline, {
						FromDebugConsole: true,
					});
					//this.MessageLog.AddLine( this.Prefixes[ 1 ] + ' ' + commandline );
					
					// TODO: process it
					console.log( 'CMD', this.Viewport.Session.Id, commandline );
					
				}
			})
		;
		
		var messages = this.Module( 'Logger' ).GetMessages( this.Viewport.Session.Id );
		for ( var k in messages )
			this.AddMessage( messages[ k ] );
		
		this.Input.Focus();
	}
	
	AddMessage( message ) {
		var line;
		if ( message.Data.FromDebugConsole ) // sent from myself
			line = this.Prefixes[ 1 ] + ' ' + message.Text;
		else
			line = this.Prefixes[ 0 ] + ' ' + message.Text + ' ' + JSON.stringify( message.Data );
		this.MessageLog.AddLine( line );
	}
	
}

module.exports = DebugConsole;
