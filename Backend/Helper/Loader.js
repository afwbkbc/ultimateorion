class Loader extends require( './_Helper' ) {
	
	constructor() {
		super( module.filename );

	}
	
	LoadModules( namespace ) {
		return new Promise( ( next, fail ) => {
			
			var classes = this.H.Fs.GetClasses( namespace );
			var toload = Object.keys( classes ).length;
			var objects = {};
			var stages = [];
			
			var init_modules = () => {
				if ( !this.E.M )
					this.E.M = {};
				
				if ( stages.length == 0 )
					return next(); // nothing to do
				
				var init_next_stage = () => {
					var stage = stages.splice( 0, 1 )[ 0 ];
					var toinit = Object.keys( stage ).length;
					for ( var k in stage ) {
						var o = stage[ k ];
						o.E = this.E; // link to Engine
						o.Init()
							.then( ( module ) => {
								if ( !--toinit ) {
									// this stage initialized
									for ( var kk in stage ) {
										var oo = stage[ kk ];
										this.E.M[ kk ] = oo;
									}
									if ( stages.length > 0 )
										return init_next_stage();
									else
										return next(); // everything loaded successfully
								}
							})
							.catch( fail )
						;
					}
				}
				init_next_stage();
			}
			
			var prepare_stages = () => {
				
				var unstaged_objects = Object.assign( {}, objects );
				var prepare_next_stage = () => {
					var stage = {};
					for ( var k in unstaged_objects ) {
						var o = unstaged_objects[ k ];
						var is_ok = true;
						for ( var dep of o.ModuleDeps ) {
							if ( !objects[ dep ] )
								throw new Error( '"' + k + '" depends on non-existent module "' + dep + '"' );
							if ( unstaged_objects[ dep ] ) {
								// depends on module not loaded yet, postpone
								is_ok = false;
								break;
							}
						}
						if ( is_ok ) {
							stage[ k ] = o;
							delete unstaged_objects[ k ];
						}
					}
					if ( Object.keys( stage ).length == 0 )
						throw new Error( 'unable to resolve module dependencies' );
					stages.push( stage );
					if ( Object.keys( unstaged_objects ).length == 0 )
						return init_modules(); // all stages built and dependencies resolved
					else
						return prepare_next_stage();
				}
				
				prepare_next_stage();
			}
			
			var toload = Object.keys( classes ).length;
			for ( var k in classes ) {
				this.LoadClass( k, classes[ k ] )
					.then( ( kv ) => {
						objects[ kv[ 0 ] ] = kv[ 1 ];
						if ( !--toload )
							return prepare_stages();
					})
					.catch( fail )
				;
			}
			
		});
	}
	
	LoadClass( name, namespace ) {
		return new Promise( ( next, fail ) => {
			try {
				var object = new ( this.Require( namespace ) )();
				return next( [ name, object ] );
			} catch ( e ) {
				this.Error( e );
			}
		});
	}

	Require( namespace ) {
		return require( '../' + namespace );
	}
	
}

module.exports = Loader;
