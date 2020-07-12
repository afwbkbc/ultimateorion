class EntityPreloader extends require( './_Module' ) {
	
	constructor() {
		super( module.filename );
		
		this.DependsOn( [ 'Sql' ] );
	}
	
	Init() {
		return new Promise( ( next, fail ) => {
			if ( !this.Config.Enabled )
				return next(); // disabled
			
			//console.log( 'PRELOAD ALL' );
			
			
			return next();
		});
	}
}

module.exports = EntityPreloader;
