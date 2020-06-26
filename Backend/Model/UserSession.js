class UserSession extends require( './_Model' ) {
	
	constructor() {
		super( module.filename );
		
	}
	
}

UserSession.schema = {
	User: { type: 'manytoone' },
	Token: { type: 'string', index: 'index' },
	IPAddress: { type: 'string' },
	LastActiveTime: { type: 'datetime', index: 'index' },
};

module.exports = UserSession;
