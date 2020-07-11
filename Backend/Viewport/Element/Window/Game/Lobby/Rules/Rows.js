class Rows extends require( '../_Rows' ) {

	constructor() {
		super( module.filename );
		
		this.Rules = {};
	}
	
	Prepare() {
		super.Prepare();
		
		this.Rules[ 'galaxy_size' ] = this.Append( 'Window/Game/Lobby/Rules/Row', {
			KeyText: 'Galaxy Size',
			KeyValue: 'Small',
		});
		this.Rules[ 'game_speed' ] = this.Append( 'Window/Game/Lobby/Rules/Row', {
			KeyText: 'Game Speed',
			KeyValue: 'Normal',
		});
	}
	
}

module.exports = Rows;
