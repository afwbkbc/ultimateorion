class Label extends require( '../_Element' ) {
	
	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Text: 'Test Text',
			FontName: 'Verdana',
			FontSize: 20,
		});
	}
	
}

module.exports = Label;
