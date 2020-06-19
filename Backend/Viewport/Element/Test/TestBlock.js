class TestBlock extends require( '../Element' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Width: 640,
			Height: 480,
			Color: 'white',
		});
				
	}
	
}

module.exports = TestBlock;