class Repository extends require( './_Base' ) {

	constructor( repository_id ) {
		super( module.filename );
		
		this.RepositoryId = repository_id;
		this.RepositoryModel = this.Model( 'EntityRepository' );
		this.EntityManager = this.Manager( 'Repository' );
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
			
			this.FindModel( entity.Id )
				.then( ( db_entity ) => {
					if ( db_entity ) // already in repository
						return next();
					db_entity = new this.RepositoryModel({
						EntityId: entity.Id,
						EntityRepositoryId: this.RepositoryId,
					});
					db_entity.Save()
						.then( next )
						.catch( fail )
					;
				})
				.catch( fail )
			;
			
		});
	}
	
	FindModel( entity_id ) {
		return new Promise( ( next, fail ) => {
			this.RepositoryModel.FindOne({
				EntityId: entity_id,
				EntityRepositoryId: this.RepositoryId,
			})
				.then( next )
				.catch( fail )
			;
		});
	}
	
	FindAll() {
		return new Promise( ( next, fail ) => {
			this.RepositoryModel.Find({
				EntityRepositoryId: this.RepositoryId,
			})
				.then( ( db_entities ) => {
					
					var promises = [];
					for ( var k in db_entities )
						promises.push( this.EntityManager.Load( db_entities[ k ].EntityId ) );
					
					var entities = {};
					
					Promise.all( promises )
						.then( next )
						.catch( fail )
					;
					
				})
				.catch( fail )
			;
			
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
