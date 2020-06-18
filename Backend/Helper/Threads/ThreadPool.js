class ThreadPool {
	
	constructor() {
		
		this.Thread = require( './Thread' );
		this.Threads = {};
		this.NextThreadId = 0;
	}

	RunOnce( callback, timeout ) {
		var thread = this.MakeThread();
		thread.Timeout = setTimeout( () => {
			callback();
			thread.Kill();
		}, timeout );
		return thread;
	}
	
	Run( callback, interval ) {
		var thread = this.MakeThread();
		thread.Interval = setInterval( () => {
			callback();
		}, interval );
		return thread;
	}
	
	MakeThread() {
		this.NextThreadId++;
		var thread = new this.Thread( this, this.NextThreadId );
		this.Threads[ this.NextThreadId ] = thread;
		return thread;
	}
	
	RemoveThread( id ) {
		if ( !this.Threads[ id ] )
			throw new Error( 'thread #' + id + ' does not exist' );
		delete this.Threads[ id ];
	}
	
	Kill() {
		for ( var k in this.Threads )
			this.Threads[ k ].Kill();
	}
	
}

module.exports = ThreadPool;
