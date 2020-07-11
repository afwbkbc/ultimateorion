class Rows extends require( '../_Rows' ) {

	constructor() {
		super( module.filename );
		
		this.Settings = {};
	}
	
	Prepare() {
		super.Prepare();
		
		this.Settings[ 'race' ] = this.Append( 'Window/Game/Lobby/Settings/Row', {
			KeyText: 'Race',
			KeyValue: 'Humans',
		});
		this.Settings[ 'color' ] = this.Append( 'Window/Game/Lobby/Settings/Row', {
			KeyText: 'Color',
			KeyValue: 'White',
		});
	}
	
}

module.exports = Rows;
