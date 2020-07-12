class BlockElement extends require( './Element' ) {
	
	constructor( filename ) {
		super( filename );

		this.SendAttributes( [ 'Width', 'Height', 'HasBorder', 'HasBackground' ] );
		
		this.SetAttributes({
			Width: 0,
			Height: 0,
			HasBorder: false,
			HasBackground: true,
		});
	}

}

module.exports = BlockElement;
