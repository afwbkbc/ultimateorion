class Label extends require( '../Element' ) {
	
	constructor() {
		super( module.filename );
		
		this.SendAttributes( [ 'Text', 'FontSize' ] );
		
		this.SetAttributes({
			Text: '',
			FontSize: 40,
		});
	}
	
}

module.exports = Label;
