class Entity extends require( './_Base' ) {
	
	constructor( filename ) {
		super( filename );
		
	}
	
	Create() {
		return new Promise( ( next, fail ) => {
			console.log( '+ENTITY #' + this.Id );
			
			if ( this.OnCreate ) {
				this.OnCreate()
					.then( next )
					.catch( fail )
				;
			}
			else
				return next();
		});
	}
	
	Destroy() {
		return new Promise( ( next, fail ) => {
			console.log( '-ENTITY #' + this.Id );
			
			if ( this.OnDestroy ) {
				this.OnDestroy()
					.then( next )
					.catch( fail )
				;
			}
			else
				return next();
		});
	}

	// override these:
	
	// before saving to db
	Pack() {
		return new Promise( ( next, fail ) => {
			return next( {} );
		});
	}
	
	// after loading from db
	Unpack( data ) {
		return new Promise( ( next, fail ) => {
			return next( this );
		});
	}

	// shortcuts
	Save() {
		return this.EntityManager.Save( this );
	}
}

module.exports = Entity;
