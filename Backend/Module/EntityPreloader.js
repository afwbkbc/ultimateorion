class EntityPreloader extends require( './_Module' ) {
	
	constructor() {
		super( module.filename );
		
		this.DependsOn( [ 'Sql', 'ObjectCache' ] );
	}
	
	Init() {
		return new Promise( ( next, fail ) => {
			if ( !this.Config.Enabled )
				return next(); // disabled
			
			this.Model( 'Entity' ).Find()
				.then( ( db_entities ) => {
					
					var preload_repositories = () => {
						this.Model( 'EntityRepository' ).FindRaw({
							group: 'EntityRepositoryId', // need only one record of each repository type
						})
							.then( ( results ) => {
								if ( results.length == 0 )
									return next(); // no repositories to preload
								
								var preload_next_repository = () => {
									var repository_id = results.splice( 0, 1 )[ 0 ].EntityRepositoryId;
									this.Manager( 'Repository' ).Get( repository_id )
										.then( () => {
											if ( results.length > 0 )
												return preload_next_repository();
											else
												return next(); // all done
										})
										.catch( fail )
									;
								}
								preload_next_repository();
								
							})
							.catch( fail )
						;
						
					}
					
					if ( db_entities.length == 0 )
						return preload_repositories(); // no entities to preload
					
					var promises = [];
					
					var preload_next_entity = () => {
						var db_entity = db_entities.splice( 0, 1 )[ 0 ];
						
						var manager = this.H.Util.GetManagerByEntityId( db_entity.EntityId );
						if ( !manager )
							return fail( new Error( 'no manager for entity "' + db_entity.EntityId + '"' ) );
						
						manager.Load( db_entity.EntityId, {
							db_entity: db_entity,
						})
							.then( () => {
								if ( db_entities.length > 0 )
									return preload_next_entity();
								else
									return preload_repositories();
							})
							.catch( fail )
						;
					}
					preload_next_entity();
					
				;

				})
				.catch( fail )
			;
			
			
		});
	}
}

module.exports = EntityPreloader;
