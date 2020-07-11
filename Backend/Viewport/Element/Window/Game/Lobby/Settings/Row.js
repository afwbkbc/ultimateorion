class Row extends require( '../../../../Layout/Panel' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			
		});
		
	}
	
	Prepare() {
		super.Prepare();
		
		// key
		this.AddElement( 'UI/Label', [ 'LC', 'LC'], [ 20, 0 ], {
			Text: this.Attributes.KeyText + ':',
		});
		
		// value
		this.AddElement( 'UI/Label', [ 'RC', 'RC'], [ -20, 0 ], {
			Text: this.Attributes.KeyValue,
		});
		
	}
	
}

module.exports = Row;
