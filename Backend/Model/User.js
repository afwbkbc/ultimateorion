module.exports = require( './_Model' )( module.filename, {
	
	Username: { type: 'string', index: 'unique' },
	Hash: { type: 'string' },
	
});
