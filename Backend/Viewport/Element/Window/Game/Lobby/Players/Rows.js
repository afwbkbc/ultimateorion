class Rows extends require( '../_Rows' ) {

	constructor() {
		super( module.filename );
		
		this.Players = {};
	}
	
	Prepare() {
		super.Prepare();
		
	}
	
	AddPlayer( player ) {
		if ( !this.Players[ player.Id ] ) {
			this.Players[ player.Id ] = this.Append( 'Window/Game/Lobby/Players/Row', {
				Player: player,
			});
		}
	}
	
	RemovePlayer( player ) {
		if ( this.Players[ player.Id ] ) {
			this.Remove( this.Players[ player.Id ] );
			delete this.Players[ player.Id ];
		}
	}
	
}

module.exports = Rows;
