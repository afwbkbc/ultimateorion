class Thread {
	
	constructor( pool, id ) {
		this.Pool = pool;
		this.Id = id;
		
		//console.log( '+THREAD #' + this.Id );
	}
	
	Kill() {
		//console.log( '-THREAD #' + this.Id );
		if ( this.Timeout ) {
			clearTimeout( this.Timeout );
			this.Timeout = null;
		}
		if ( this.Interval ) {
			clearInterval( this.Interval );
			this.Interval = null;
		}
		this.Pool.RemoveThread( this.Id );
	}

}

module.exports = Thread;
