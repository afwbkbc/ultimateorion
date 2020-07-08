class RepositoryManager extends require( './_Module' ) {

	constructor() {
		super( module.filename );

		this.Repository = require( '../Repository' );
	}
	
	Get( repository_id ) {
		return new Promise( ( next, fail ) => {
			this.CacheScope( 'REPOSITORY_' + repository_id, ( next, fail ) => {
				var repository = new this.Repository( repository_id );
				repository.Create()
					.then( () => {
						return next( repository );
					})
					.catch( fail )
				;
			})
				.then( next )
				.catch( fail )
			;
		});
	}

	Load( entity_id, options ) {
		return new Promise( ( next, fail ) => {
			
			// determine manager type for entity and dispatch to it
			
			var pos;
			var entity_type = entity_id;
			
			// cut off part after _
			if ( ( pos = entity_type.indexOf( '_' ) ) >= 0 )
				entity_type = entity_type.substring( 0, pos );
			
			// cut off part before / if it's present
			if ( ( pos = entity_type.indexOf( '/' ) ) >= 0 )
				entity_type = entity_type.substring( pos + 1 );
			
			var manager = this.Manager( entity_type );
			if ( !manager )
				return fail( new Error( 'no manager for entity type "' + entity_type + '"' ) );
			
			// dispatch to manager
			manager.Load( entity_id, options )
				.then( next )
				.catch( fail )
			;
			
		});
	}
}

module.exports = RepositoryManager;
