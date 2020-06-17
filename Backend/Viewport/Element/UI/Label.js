class Label extends require( '../_Element' ) {
	
	constructor() {
		super();
		
		this.SetAttributes({
			Text: 'Test Text',
			FontName: 'Verdana',
			FontSize: 20,
		});
	}
	
}

module.exports = Label;
