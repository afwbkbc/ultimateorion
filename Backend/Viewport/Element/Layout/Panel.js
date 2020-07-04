class Panel extends require( '../BlockElement' ) {

	constructor( filename ) {
		super( filename ? filename : module.filename );
		
		this.SetAttributes({
			Width: 0,
			Height: 0,
		});
	}
	
}

module.exports = Panel;
