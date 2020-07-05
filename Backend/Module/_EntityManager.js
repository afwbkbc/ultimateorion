var entity_ids_in_progress = {}; // to prevent entity id race conditions

class EntityManager extends require( './_Module' ) {
	
	constructor( filename, namespace ) {
		super( filename );
		
		this.EntityModel = require( '../Model/Entity' );
		this.EntityName = namespace;
		this.EntityClass = require( '../' + namespace );
		this.EntityPool = {};
	}
	
	Run() {
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
		entity.Db = db;
		entity.Id = entity.Db.EntityId;
		return entity;
	}
	
	Create( options ) {
		return new Promise( ( next, fail ) => {
			
			this.GenerateUniqueModel()
				.then( ( model ) => {
					this.CacheScope( model.EntityId, ( next, fail ) => {
						return next( this.ConstructEntity( model ) );
					})
						.then( ( entity ) => {
							if ( options ) {
								if ( options.parameters ) {
									for ( var k in options.parameters )
										entity[ k ] = options.parameters[ k ];
								}
							}
							
							entity.Create()
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
	
	Load( entity_id ) {
		return new Promise( ( next, fail ) => {
			console.log( 'LOAD', entity_id );
			this.CacheScope( entity_id, ( next, fail ) => {
				this.EntityModel.FindOne({
					EntityId: entity_id,
				})
					.then( ( model ) => {
						if ( model ) {
							var entity = this.ConstructEntity( model );
							entity.UnpackNeeded = true;
							return next( entity );
						}
						else
							return next( null );
					})
					.catch( fail )
				;
			})
				.then( ( entity ) => {
					if ( !entity )
						return next( null );
					else if ( entity.UnpackNeeded ) {
						delete entity.UnpackNeeded;
						entity.Unpack( JSON.parse( entity.Db.Data ) )
							.then( ( entity ) => {
								if ( entity )
									return next( entity );
								else {
									// entity invalid, delete it and return 'not found'
									model.Delete()
										.then( () => {
											return next( null );
										})
										.catch( fail )
									;
								}
							})
							.catch( fail )
						;
					}
					else
						return next( entity );
				})
				.catch( fail )
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
	
	Delete( entity ) {
		return new Promise( ( next, fail ) => {
			entity.Destroy()
				.then( () => {
					entity.Db.Delete()
						.then( next )
						.catch( fail )
					;
				})
				.catch( fail )
			;
		});
	}

}

module.exports = EntityManager;
