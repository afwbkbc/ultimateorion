module.exports = require( './_Model' )( module.filename, {
	
	User: { type: 'manytoone' },
	Token: { type: 'string', index: 'index' },
	IPAddress: { type: 'string' },
	LastActiveTime: { type: 'datetime', index: 'index' },
	
});
