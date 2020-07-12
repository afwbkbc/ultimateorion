class Rows extends require( '../../../Layout/Block' ) {

	constructor() {
		super( module.filename );
		
		this.Settings = {};
	}
	
	Prepare() {
		this.SetAttributes({
			 ElementAttributes: {
				 Margin: 20,
				 Width: this.Attributes.Width,
				 Height: 60,
				 HasBorder: true,
			 },
		});
		
		super.Prepare();
		
	}
	
}

module.exports = Rows;
