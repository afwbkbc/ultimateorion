class RepositoryManager extends require( './_Module' ) {

	constructor() {
		super( module.filename );

		this.Repository = require( '../Repository' );
	}
	
	Get( repository_id, options ) {
		return new Promise( ( next, fail ) => {
			//console.log( 'GETREPOSITORY', repository_id, options );
			this.CacheScope( options && options.caller ? 'REPOSITORY_' + options.caller : null, 'REPOSITORY_' + repository_id, ( next, fail ) => {
				var repository = new this.Repository( repository_id );
				repository.Create( options )
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
			
			var manager = this.H.Util.GetManagerByEntityId( entity_type );
			if ( !manager )
				return fail( new Error( 'no manager for entity "' + entity_id + '"' ) );
			
			// dispatch to manager
			manager.Load( entity_id, options )
				.then( next )
				.catch( fail )
			;
			
		});
	}
}

module.exports = RepositoryManager;
