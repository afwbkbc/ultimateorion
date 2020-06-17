class Session extends require( '../../_Base' ) {
	
	constructor( manager, connection ) {
		super( module.filename );
		
		this.Manager = manager;
		this.Connection = connection;
		
		this.State = 'auth';
	}
	
	OnCreate() {
		console.log( 'session create', this.Connection.Id );
	}
	
	OnDestroy() {
		console.log( 'session destroy', this.Connection.Id );
	}
	
}

module.exports = Session;
