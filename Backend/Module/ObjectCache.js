class ObjectCache extends require( './_Module' ) {

	constructor() {
		super( module.filename );
		
		this.DependsOn( [ 'Sql' ] );
		
		this.Cache = {}; // to keep cached objects
		this.Caching = {}; // to temporarily keep and accumulate callbacks during cache building period ( i.e. when object is fetched from db )
		this.Removing = {}; // to temporarily mark cache as being removed to avoid some race conditions
		
		this.Debug = false;
	}
	
	// wraps object-generating code inside lookup / duplicate check. does not execute func if generated object with that key is already available ( returns it instead )
	Scope( initiator_key, target_key, generator_func ) {
		return new Promise( ( next, fail ) => {
			if ( this.Removing[ target_key ] ) {
				// entity being removed atm
				if ( this.Debug )
					console.log( '[REMOVING] ' + target_key );
				return next( null );
			}
			if ( this.Cache[ target_key ] ) {
				if ( this.Debug )
					console.log( '[CACHED] ' + target_key );
				return next( this.Cache[ target_key ] );
			}
			else {
				var caching_done = ( obj ) => {
					if ( obj ) {
						// object built successfully, cache it
						if ( this.Debug )
							console.log( '[ORIG] ' + target_key );
						this.Cache[ target_key ] = obj;
					}
					if ( this.Debug )
						console.log( 'CACHEDONE', target_key );
					// return result ( either object or null )
					next( obj );
					// also return to whatever was waiting
					for ( var k in this.Caching[ target_key ] )
						this.Caching[ target_key ][ k ]( obj );
					// cleanup
					delete this.Caching[ target_key ];
				};
				
				if ( this.Caching[ target_key ] ) {
					if ( initiator_key && this.Caching[ initiator_key ] ) {
						// deadlock!
						if ( this.Debug )
							console.log( '!!!!! DEADLOCK between ' + initiator_key + ' and ' + target_key + ' !!!!!' );
						// return deadlock information to handle it somewhere else somehow
						return fail( new this.G.DeadlockError( initiator_key, target_key, generator_func, ( obj ) => {
							// breakout handler
							//delete this.Caching[ target_key ];
							return caching_done( null );
						}, fail ) );
					}
					
					// something is already building this object, wait for it and return when object ready
					if ( this.Debug )
						console.log( '!!! CACHEWAIT ' + target_key + ' by ' + initiator_key );
					this.Caching[ target_key ].push( ( obj ) => {
						if ( this.Debug )
							console.log( '[CACHED] ' + target_key );
						return next( obj );
					})
				}
				else {
					this.Caching[ target_key ] = [];
					// build cache
					if ( this.Debug )
						console.log( 'CACHEBUILD ' + target_key );
					return generator_func( caching_done, fail );
				}
			}
			
		});
	}
	
	Remove( key, func ) {
		return new Promise( ( next, fail ) => {
			if ( this.Removing[ key ] ) {
				// already removing, add callback to wait
				if ( this.Debug )
					console.log( 'CACHEREMOVEWAIT ' + key );
				this.Removing[ key ].push( func );
				return next();
			}
			if ( this.Debug )
				console.log( 'CACHEREMOVE ' + key );
			this.Removing[ key ] = [];
			delete this.Caching[ key ];
			delete this.Cache[ key ];
			return func( () => {
				if ( this.Debug )
					console.log( 'CACHEREMOVEDONE ' + key );
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
