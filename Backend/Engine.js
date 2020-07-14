class Engine extends require( './_Base' ) {
	
	constructor() {
		super( module.filename );
	}
	
	Init() {
		return new Promise( ( next, fail ) => {
			
			this.H.Loader.LoadModules( this.NS + '/Module' )
				.then( next )
				.catch( fail )
			;
			
		});
	}
	
	Run() {
		
		console.log( 'Engine started' );
		for ( var k in this.M )
			if ( this.M[ k ].Run )
				this.M[ k ].Run();
		
	}
	
}

module.exports = Engine;
