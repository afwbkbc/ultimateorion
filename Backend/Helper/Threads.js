class Threads extends require( './_Helper' ) {
	
	constructor() {
		super( module.filename );
		
		this.ThreadPool = require( './Threads/ThreadPool' );
	}
	
	CreatePool() {
		return new this.ThreadPool();
	}
	
}

module.exports = Threads;
