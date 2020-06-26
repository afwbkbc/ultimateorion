class UserSession extends require( './_Model' ) {
	
	GetSchema() {
		return {
			User: { type: 'manytoone' },
			Token: { type: 'string', index: 'index' },
			IPAddress: { type: 'string' },
			LastActiveTime: { type: 'datetime', index: 'index' },
		}
	}
	
	constructor() {
		super( module.filename );
		
	}
	
}

module.exports = UserSession;
