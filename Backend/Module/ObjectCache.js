class ObjectCache extends require( './_Module' ) {

	constructor() {
		super( module.filename );
		
		this.Cache = {}; // to keep cached objects
		this.Caching = {}; // to temporarily keep and accumulate callbacks during cache building period ( i.e. when object is fetched from db )
		this.Removing = {}; // to temporarily mark cache as being removed to avoid some race conditions
	}
	
	// wraps object-generating code inside lookup / duplicate check. does not execute func if generated object with that key is already available ( returns it instead )
	Scope( key, func ) {
		return new Promise( ( next, fail ) => {
			if ( this.Removing[ key ] ) {
				// entity being removed atm
				//console.log( '[REMOVING] ' + key );
				return next( null );
			}
			if ( this.Cache[ key ] ) {
				//console.log( '[CACHED] ' + key );
				return next( this.Cache[ key ] );
			}
			else {
				if ( this.Caching[ key ] ) {
					// something is already building this object, wait for it and return when object ready
					//console.log( 'CACHEWAIT ' + key );
					this.Caching[ key ].push( ( obj ) => {
						//console.log( '[CACHED] ' + key );
						return next( obj );
					})
				}
				else {
					this.Caching[ key ] = [];
					// build cache
					//console.log( 'CACHEBUILD ' + key );
					return func( ( obj ) => {
						if ( obj ) {
							// object built successfully, cache it
							//console.log( '[ORIG] ' + key );
							this.Cache[ key ] = obj;
						}
						//console.log( 'CACHEDONE', key );
						// return result ( either object or null )
						next( obj );
						// also return to whatever was waiting
						for ( var k in this.Caching[ key ] )
							this.Caching[ key ][ k ]( obj );
						// cleanup
						delete this.Caching[ key ];
					}, fail );
				}
			}
			
		});
	}
	
	Remove( key, func ) {
		return new Promise( ( next, fail ) => {
			if ( this.Removing[ key ] ) {
				// already removing, add callback to wait
				//console.log( 'CACHEREMOVEWAIT ' + key );
				this.Removing.push( func );
				return next();
			}
			//console.log( 'CACHEREMOVE ' + key );
			this.Removing[ key ] = [];
			delete this.Caching[ key ];
			delete this.Cache[ key ];
			return func( () => {
				//console.log( 'CACHEREMOVEDONE ' + key );
				// continue flow
				next();
				// also return to whatever was waiting
				for ( var k in this.Removing[ key ] )
					this.Removing[ key ][ k ]();
				// cleanup
				delete this.Removing[ key ];
			}, fail );
		});
	}
	
}

module.exports = ObjectCache;
