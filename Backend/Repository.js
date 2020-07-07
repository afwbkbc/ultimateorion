class Repository extends require( './_Base' ) {

	constructor( repository_id ) {
		super( module.filename );
		
		this.RepositoryId = repository_id;
	}
	
	Create() {
		return new Promise( ( next, fail ) => {
			console.log( 'R[ ' + this.RepositoryId + ' ].Create()' );
			
			return next();
		});
	}
	
	Insert( entity ) {
		return new Promise( ( next, fail ) => {
			console.log( 'R[ ' + this.RepositoryId + ' ].Insert( ' + entity.Id + ' )' );
			
			return next();
		});
	}
	
	Remove( entity ) {
		return new Promise( ( next, fail ) => {
			console.log( 'R[ ' + this.RepositoryId + ' ].Remove( ' + entity.Id + ' )' );
			
			return next();
		});
	}
	
	Destroy() {
		return new Promise( ( next, fail ) => {
			console.log( 'R[ ' + this.RepositoryId + ' ].Destroy()' );
			
			return next();
		});
	}
	
}

module.exports = Repository;
