class Label extends require( '../Element' ) {
	
	constructor() {
		super( module.filename );
		
		this.SendAttributes( [ 'Text' ] );
		
		this.SetAttributes({
			Text: '',
		});
	}
	
}

module.exports = Label;
