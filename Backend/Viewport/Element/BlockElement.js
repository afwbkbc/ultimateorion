class BlockElement extends require( './Element' ) {
	
	constructor( filename ) {
		super( filename );

		this.SetAttributes({
			Width: 0,
			Height: 0,
		});
	}

}

module.exports = BlockElement;
