class Engine extends require( './_Base' ) {
	
	constructor() {
		super( module.filename );
	}
	
	Init() {
		return new Promise( ( next, fail ) => {
			
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
		
		console.log( 'RUN' );
		
	}
	
}

module.exports = Engine;
