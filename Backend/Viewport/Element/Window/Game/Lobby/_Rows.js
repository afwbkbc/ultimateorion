class Rows extends require( '../../../Layout/Block' ) {

	constructor() {
		super( module.filename );
		
		this.Settings = {};
	}
	
	Prepare() {
		this.SetAttributes({
			 ElementMargin: 20,
			 ElementWidth: this.Attributes.Width,
			 ElementHeight: 60,
			 ElementHasBorder: true,
		});
		
		super.Prepare();
		
	}
	
}

module.exports = Rows;
