class Label extends require( '../Element' ) {
	
	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Text: '',
		});
	}
	
}

module.exports = Label;
