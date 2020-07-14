var entity_ids_in_progress = {}; // to prevent entity id race conditions

class BaseEntityManager extends require( './_Module' ) {
	
	constructor( filename, namespace ) {
		super( filename );
		
		this.DependsOn( [ 'Crypto' ] );
		
		this.EntityModel = require( '../Model/Entity' );
		this.EntityName = namespace;
		this.EntityClass = require( '../' + namespace );
		this.EntityPool = {};
	}
	
	Init() {
		return new Promise( ( next, fail ) => {
			
			this.Crypto = this.Module( 'Crypto' );

			return next();
		});
	}
	
	GenerateUniqueModel() {
		return new Promise( ( next, fail ) => {
			var entity_id;
			do {
				entity_id = this.EntityName + '_' + this.Crypto.RandomMd5Hash();
			} while ( entity_ids_in_progress[ entity_id ] );
			entity_ids_in_progress[ entity_id ] = true;
			this.EntityModel.FindOne({
				EntityId: entity_id,
			})
				.then( ( model ) => {
					if ( model != null ) {
						// this one's taken, try another one
						delete entity_ids_in_progress[ entity_id ]
						return this.GenerateUniqueModel()
							.then( next )
							.catch( fail )
						;
					}
					// entity id is free, create model with it and return
					model = new this.EntityModel({
						EntityId: entity_id,
						Data: '',
					});
					model.Save()
						.then( () => {
							delete entity_ids_in_progress[ entity_id ];
							return next( model );
						})
						.catch( ( e ) => {
							delete entity_ids_in_progress[ entity_id ];
							return fail( e );
						})
					;
				})
				.catch( ( e ) => {
					delete entity_ids_in_progress[ entity_id ];
					return fail( e );
				})
			;
			
		});
	}
	
	ConstructEntity( db ) {
		var entity = new this.EntityClass();
		entity.EntityManager = this;
		if ( db ) {
			entity.Db = db;
			entity.Id = entity.Db.EntityId;
		}
		return entity;
	}
	
	Create( options ) {
		return new Promise( ( next, fail ) => {
			
			this.GenerateUniqueModel()
				.then( ( model ) => {
					this.CacheScope( options && options.caller ? options.caller : null, model.EntityId, ( next, fail ) => {
						return next( this.ConstructEntity( model ) );
					})
						.then( ( entity ) => {
							if ( options ) {
								if ( options.parameters ) {
									for ( var k in options.parameters )
										entity[ k ] = options.parameters[ k ];
								}
							}
							
							entity.Create( options )
								.then( () => {
									this.Save( entity )
										.then( () => {
											
											// entity created and saved to db
											
											return next( entity );
										})
										.catch( fail )
									;
								})
								.catch( fail )
							;
						})
						.catch( fail )
					;
				})
				.catch( fail )
			;
			
		});
	}
	
	Load( entity_id, options ) {
		return new Promise( ( next, fail ) => {
			//console.log( 'LOAD', entity_id, options && options.parameters ? Object.keys( options.parameters ) : null );
			this.CacheScope( options && options.caller ? options.caller : null, entity_id, ( next, fail ) => {
				
				var handle_db_entity = ( db_entity ) => {
					if ( db_entity ) {
						var entity = this.ConstructEntity( db_entity );
						if ( options ) {
							if ( options.parameters ) {
								for ( var k in options.parameters )
									entity[ k ] = options.parameters[ k ];
							}
						}
						//console.log( 'UNPACK', entity.Classname, Object.keys( entity ) );
						entity.Unpack( JSON.parse( entity.Db.Data ), options )
							.then( ( entity ) => {
								if ( !entity ) {
									// entity invalid, delete it and return 'not found'
									db_entity.Delete()
										.then( () => {
											return next( null );
										})
										.catch( fail )
									;
								}
								else {
									//console.log( 'UNPACK DONE' );
									entity.OnInit( options )
										.then( () => {
											return next( entity );
										})
										.catch( fail )
									;
								}
								
							})
							.catch( fail )
						;
					}
					else
						return next( null );
				};
				
				if ( options && options.db_entity ) // db record already provided
					return handle_db_entity( options.db_entity );
				
				// otherwise we need to fetch it from db
				this.EntityModel.FindOne({
					EntityId: entity_id,
				})
					.then( handle_db_entity )
					.catch( fail )
				;
			})
				.then( ( entity ) => {
					//console.log( 'FOUND', entity.Id );
					return next( entity );
				})
				.catch( ( e ) => {
					if ( e instanceof this.G.DeadlockError ) {
						if ( options && options.on_before_deadlock && options.on_after_deadlock ) {
							
							console.log( 'DEADLOCK', e.Target );
							// some information about object
							var obj = new this.G.DeferredEntity( e.Target ); // will be loaded later
							
							// prepare for handling object later
							options.on_before_deadlock( obj );
							
							// schedule handling of this object after current flow ends
							setTimeout( () => {
								options.on_after_deadlock( obj );
							}, 0 );
							
							//console.log( 'OBJ', obj );
							// break out from deadlock
							e.Next( obj );
							return next( obj );
						}
					}
					return fail( e );
				})
			;
		});
	}
	
	Save( entity ) {
		return new Promise( ( next, fail ) => {
			entity.Pack()
				.then( ( data ) => {
					entity.Db.Data = JSON.stringify( data );
					entity.Db.Save()
						.then( next )
						.catch( fail )
					;
				})
				.catch( fail )
			;
		});
	}
	
	Delete( entity, options ) {
		return new Promise( ( next, fail ) => {
			this.CacheRemove( entity.Id, ( next, fail ) => {
				entity.Destroy()
					.then( () => {
						//console.log( 'DELETE', entity.Classname, entity.Db.ID );
						if ( options && options.keep_in_db )
							return next();
						entity.Db.Delete()
							.then( next )
							.catch( fail )
						;
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

module.exports = BaseEntityManager;
