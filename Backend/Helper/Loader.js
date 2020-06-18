class Loader extends require( './_Helper' ) {
	
	constructor() {
		super( module.filename );
		//console.log( 'Fs loaded' );
	}
	
	LoadClasses( namespace ) {
		return new Promise( ( next, fail ) => {
			
			var classes = this.H.Fs.GetClasses( namespace );
			var toload = Object.keys( classes ).length;
			var objects = {};
			for( var k in classes ) {
				this.LoadClass( k, classes[ k ] )
					.then( ( kv ) => {
						( objects[ kv[ 0 ] ] = kv[ 1 ] ).Init()
							.then( () => {
								toload--;
								if ( !toload ) {
									
									next( objects );
								}
							})
							.catch( this.Error )
						;
					})
					.catch( this.Error )
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
