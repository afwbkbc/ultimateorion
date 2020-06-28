module.exports = require( './_Model' )( module.filename, {
	
	User: { type: 'manytoone' },
	SessionData: { type: 'blob' },
	
});
