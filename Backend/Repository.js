class Repository extends require( './_EventAwareBase' ) {

	constructor( repository_id ) {
		super( module.filename );
		
		this.RepositoryId = repository_id;
		this.RepositoryModel = this.Model( 'EntityRepository' );
		this.EntityManager = this.Manager( 'Repository' );
		this.Listeners = [];
		this.Entities = {};
	}
	
	Create() {
		return new Promise( ( next, fail ) => {
			console.log( 'R[ ' + this.RepositoryId + ' ].Create()' );

			// load current state from db
			this.RepositoryModel.Find({
				EntityRepositoryId: this.RepositoryId,
			})
				.then( ( db_entities ) => {
					
					var promises = [];
					for ( var k in db_entities )
						promises.push( this.EntityManager.Load( db_entities[ k ].EntityId ) );
					
					Promise.all( promises )
						.then( ( entities ) => {
							for ( var k in entities ) {
								var entity = entities[ k ];
								if ( entity )
									this.Entities[ entity.Id ] = entity;
							}
							return next();
						})
						.catch( fail )
					;
					
				})
				.catch( fail )
			;
		});
	}
	
	Insert( entity ) {
		return new Promise( ( next, fail ) => {
			console.log( 'R[ ' + this.RepositoryId + ' ].Insert( ' + entity.Id + ' )' );
			
			if ( this.Entities[ entity.Id ] )
				return next(); // already in repository

			var db_entity = new this.RepositoryModel({
				EntityId: entity.Id,
				EntityRepositoryId: this.RepositoryId,
			});
			db_entity.Save()
				.then( () => {
					this.Entities[ entity.Id ] = entity;
					this.Trigger( 'add', {
						Entity: entity,
					});
					return next();
				})
				.catch( fail )
			;
		});
	}
	
	GetEntities() {
		return this.Entities;
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

	OnListen( listener ) {
		var entities = this.GetEntities();
		for ( var k in entities ) {
			var entity = entities[ k ];
			if ( entity ) {
				listener.Trigger( 'add', {
					Entity: entities[ k ],
				});
			}
		}
	}
	
}

module.exports = Repository;
