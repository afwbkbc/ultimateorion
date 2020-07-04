class CreateGame extends require( '../Layout/Window' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Title: 'Create new game',
			Style: 'main-menu-form',
			Width: 640,
			Height: 310,
		});
	}
	
	Prepare() {
		super.Prepare();
		
		this.Form = this.Body.AddElement( 'UI/Form', [ 'LT', 'LT' ], [ 0, 0 ], {
			Width: this.Body.Attributes.Width,
			Height: this.Body.Attributes.Height,
		})
			.On( 'prepare', ( data, event ) => {
				this.Form.AddInput( 'name', 'Game name', {
					Value: this.Viewport.Session.User.Username + '\'s game',
				});
				this.Form.AddSubmit( 'Create' );
			})
			.On( 'submit', ( data, event ) => {
				this.Disable();
				
				var f = data.fields;
				var err = null;
				
				if ( !f.name )
					err = 'Please enter game name!';
				
				if ( err ) {
					this.Error = this.Form.ShowError( err, () => {
						this.Enable();
						this.Form.FocusField( 'name' );
					});
				}
				else {
					this.Trigger( 'success', data.fields );
					this.Close();
				}
			})
		;

	}
	
}

module.exports = CreateGame;
