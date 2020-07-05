class ObjectCache extends require( './_Module' ) {

	constructor() {
		super( module.filename );
		
		this.Cache = {}; // to keep cached objects
		this.Caching = {}; // to temporarily keep and accumulate callbacks during cache building period ( i.e. when object is fetched from db )
	}
	
	// wraps object-generating code inside lookup / duplicate check. does not execute func if generated object with that key is already available ( returns it instead )
	Scope( key, func ) {
		return new Promise( ( next, fail ) => {
			if ( this.Cache[ key ] ) {
				console.log( '[CACHED] ' + key );
				return next( this.Cache[ key ] );
			}
			else {
				if ( this.Caching[ key ] ) {
					// something is already building this object, wait for it and return when object ready
					//console.log( 'CACHEWAIT ' + key );
					this.Caching[ key ].push( ( obj ) => {
						console.log( '[CACHED] ' + key );
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
							console.log( '[ORIG] ' + key );
							this.Cache[ key ] = obj;
						}
						//console.log( 'CACHEDONE', key );
						// return result ( either object or null )
						next( obj );
						// also return it to whatever was waiting
						for ( var k in this.Caching[ key ] )
							this.Caching[ key ][ k ]( obj );
						// cleanup
						delete this.Caching[ key ];
					}, fail );
				}
			}
			
		});
	}
	
}

module.exports = ObjectCache;
