module.exports = require( './_Model' )( module.filename, {
	
	EntityId: { type: 'string', index: 'index', size: 128 },
	EntityRepositoryId: { type: 'string', index: 'index', size: 512 },
	
});
