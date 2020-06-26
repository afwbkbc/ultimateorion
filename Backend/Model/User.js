class User extends require( './_Model' ) {
	
	GetSchema() {
		return {
			Username: { type: 'string', index: 'index' },
			Hash: { type: 'string' },
		}
	}
	
	constructor() {
		super( module.filename );
		
	}
	
}

module.exports = User;
