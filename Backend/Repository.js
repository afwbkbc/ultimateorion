class Repository extends require( './_EventAwareBase' ) {

	constructor( repository_id ) {
		super( module.filename );
		
		this.RepositoryId = repository_id;
		this.RepositoryModel = this.Model( 'EntityRepository' );
		this.EntityManager = this.Manager( 'Repository' );
		this.Listeners = [];
		this.Entities = {};
	}
	
	Create( options ) {
		return new Promise( ( next, fail ) => {
			console.log( 'R[ ' + this.RepositoryId + ' ].Create()' );

			// load current state from db
			this.RepositoryModel.Find({
				EntityRepositoryId: this.RepositoryId,
			})
				.then( ( db_entities ) => {
					var promises = [];
					for ( var k in db_entities ) {
						var entity_id = db_entities[ k ].EntityId;
						if ( options && options.parameters && options.parameters.Entities && options.parameters.Entities[ entity_id ] )
							this.Entities[ entity_id ] = options.parameters.Entities[ entity_id ];
						else {
							promises.push( this.EntityManager.Load( entity_id, {
								caller: this.RepositoryId,
								parameters: {
									Repository: this,
								},
							}));
						}
					}
					
					// fetch later to avoid deadlock 
					Promise.all( promises )
						.then( ( entities ) => {
							for ( var k in entities ) {
								var entity = entities[ k ];
								if ( entity ) {
									this.Entities[ entity.Id ] = entity;
									this.Trigger( 'add', {
										Entity: entity,
									});
								}
							}
						})
						.catch( fail )
					;
					
					return next();
					
				})
				.catch( fail )
			;
		});
	}
	
	Insert( entity ) {
		return new Promise( ( next, fail ) => {
			
			if ( this.Entities[ entity.Id ] )
				return next(); // already in repository

			console.log( 'R[ ' + this.RepositoryId + ' ].Insert( ' + entity.Id + ' )' );
			
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
	
	TriggerEvent( entity, eventtype, data, event ) {
		this.Trigger( 'event', {
			Entity: entity,
			EventType: eventtype,
			Data: data,
			Event: event,
		});
	}
	
	GetEntities() {
		return this.Entities;
	}
	
	Remove( entity ) {
		return new Promise( ( next, fail ) => {
			
			if ( !this.Entities[ entity.Id ] )
				return next(); // not in repository
			
			console.log( 'R[ ' + this.RepositoryId + ' ].Remove( ' + entity.Id + ' )' );
			
			delete this.Entities[ entity.Id ];
			this.Trigger( 'remove', {
				Entity: entity,
			});
			
			this.RepositoryModel.FindOne({
				EntityId: entity.Id,
				EntityRepositoryId: this.RepositoryId,
			})
				.then( ( db_entity ) => {
					
					if ( !db_entity )
						return next(); // nothing to delete
					
					db_entity.Delete()
						.then( next )
						.catch( fail )
					;
				})
				.catch( fail )
			;
			
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
