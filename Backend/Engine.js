class Engine extends require( './_Base' ) {
	
	constructor() {
		super( module.filename );
	}
	
	Init() {
		return new Promise( ( next, fail ) => {
			
			for ( var k in this.H )
				this.H.E = this;
			
			this.H.Loader.LoadClasses( this.NS + '/Module' )
				.then( ( modules ) => {
					
					// link to engine
					for( var k in modules )
						modules[ k ].E = this;
					
					this.M = modules;
					
					next();
				})
				.catch( this.Error )
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
