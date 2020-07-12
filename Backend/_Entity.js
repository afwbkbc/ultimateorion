class Entity extends require( './_EventAwareBase' ) {
	
	constructor( filename ) {
		super( filename );
		
	}
	
	Create( options ) {
		return new Promise( ( next, fail ) => {
			//console.log( '+ENTITY #' + this.Id );

			this.OnInit()
				.then( () => {
					if ( this.OnCreate ) {
						this.OnCreate( options )
							.then( next )
							.catch( fail )
						;
					}
					else
						return next();
				})
				.catch( fail )
			;
			
		});
	}
	
	Destroy() {
		return new Promise( ( next, fail ) => {
			//console.log( '-ENTITY #' + this.Id );

			var deinit = () => {
				this.OnDeinit()
					.then( next )
					.catch( fail )
				;
			}
			
			if ( this.OnDestroy ) {
				this.OnDestroy()
					.then( deinit )
					.catch( fail )
				;
			}
			else
				return deinit();
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
	// additional initialization
	OnInit( options ) {
		return new Promise( ( next, fail ) => {
			return next();
		})
	}
	// additional deinitialization
	OnDeinit() {
		return new Promise( ( next, fail ) => {
			return next();
		})
	}

	// shortcuts
	Save() {
		return this.EntityManager.Save( this );
	}
	
	Delete() {
		return this.EntityManager.Delete( this );
	}
	
}

module.exports = Entity;
