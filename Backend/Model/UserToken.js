module.exports = require( './_Model' )( module.filename, {
	
	User: { type: 'manytoone' },
	Hash: { type: 'string', index: 'index', size: 128 },
	RemoteAddress: { type: 'string' },
	LastActiveTime: { type: 'datetime', index: 'index' },
	
});
