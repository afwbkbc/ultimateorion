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
	
}

module.exports = RepositoryManager;
