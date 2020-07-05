module.exports = require( './_Model' )( module.filename, {
	
	EntityId: { type: 'string', index: 'unique', size: 128 },
	Data: { type: 'blob' },
	
});
