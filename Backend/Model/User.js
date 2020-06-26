class User extends require( './_Model' ) {
	
	constructor() {
		super( module.filename );
		
	}
	
}

User.schema = {
	Username: { type: 'string', index: 'index' },
	Hash: { type: 'string' },
};

module.exports = User;
