class YesNoPrompt extends require( '../Layout/Window' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Title: 'Are you sure?',
			Style: 'yes-no-popup',
			Width: 960,
			Height: 270,
			PromptText: 'Yes or no?',
			YesText: 'Yes',
			NoText: 'No',
		});
	}
	
	Prepare() {
		super.Prepare();
		
		this.Body.AddElement( 'UI/Label', [ 'CT', 'CT' ], [ 0, 40 ], {
			Text: this.Attributes.PromptText,
			FontSize: 30,
		});
		
		this.Body.AddElement( 'UI/Button', [ 'LB', 'LB' ], [ 100, -30 ], {
			Width: 300,
			Height: 70,
			Label: this.Attributes.NoText,
		})
			.On( 'click', () => {
				this.Close();
				this.Trigger( 'cancel' );
			})
		;
		this.Body.AddElement( 'UI/Button', [ 'RB', 'RB' ], [ -100, -30 ], {
			Width: 300,
			Height: 70,
			Label: this.Attributes.YesText,
		})
			.On( 'click', () => {
				this.Close();
				this.Trigger( 'confirm' );
			})
		;
	}
	
}

module.exports = YesNoPrompt;
