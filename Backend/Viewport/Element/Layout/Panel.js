class Panel extends require( '../BlockElement' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Width: 0,
			Height: 0,
		});
	}
	
}

module.exports = Panel;
