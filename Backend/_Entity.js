class Entity extends require( './_Base' ) {
	
	constructor( filename, parameters ) {
		super( filename );
		
	}
	
	Create() {
		console.log( '+ENTITY #' + this.Id );
		
		if ( this.OnCreate )
			this.OnCreate();
	}
	
	Destroy() {
		console.log( '-ENTITY #' + this.Id );
		
		/*if ( this.SessionTimeout )
			clearTimeout( this.SessionTimeout );*/
		
		if ( this.OnDestroy )
			this.OnDestroy();
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
	
}

module.exports = Entity;
