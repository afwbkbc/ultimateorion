class BaseModel extends require( '../_Base' ) {

	constructor( filename ) {
		super( filename );
		
	}
	
}

var basemodel = new BaseModel( module.filename ); // for helpers

module.exports = ( filename, schema ) => {
	
	var model_name = basemodel.H.Fs.PathToName( filename ).replace( 'Backend/Model/', '' );
	
	// internal methods
	var sanitize_query = ( query ) => {
		
		if ( typeof( query ) === 'number' )
			query = { ID: query }; // assume it's search by ID
		
		for ( var k in query ) {
			if ( k == 'ID' )
				continue; // always allowed and no processing needed
			
			var s = schema[ k ];
			var v = query[ k ];
			
			// safety check
			if ( !s )
				throw new Error( 'query field "' + k + '" not defined in schema' );
			
			// handle relations
			if ( s.type == 'manytoone' ) {
				// search by ID of related model
				if ( !v.ID )
					throw new Error( 'non-object "' + k + '" used in relation query' );
				query[ k + 'ID' ] = v.ID;
				delete query[ k ];
			}
		}
		
		
		return query;
	}
	
	var sanitize_result = ( result, relations_to_fetch ) => {
		return new Promise( ( next, fail ) => {
			
			var relations = [];
			
			for ( var k in result ) {
				if ( k === 'ID' )
					continue; // always allowed and no processing needed
				
				var s = schema[ k ];
				var v = result[ k ];
				
				if ( k.substring( k.length - 2 ) === 'ID' ) { // possible manytoone relation
					var kr = k.substring( 0, k.length - 2 );
					if ( schema[ kr ] && schema[ kr ].type == 'manytoone' && relations_to_fetch.indexOf( kr ) >= 0 ) {
						// it's manytoone relation and is required
						relations.push( [ kr, v ] );
					}
				}
				
				if ( !s ) { // don't return unexpected data
					delete result[ k ];
					continue;
				}
				
				
			}
			
			// fetch required relations before returning
			var relation_idx = 0;
			var process = () => {
				if ( relation_idx >= relations.length )
					return next( result );
				var relation = relations[ relation_idx ];
				basemodel.E.M.Sql.Models[ relation[ 0 ] ].FindOne( relation[ 1 ] )
					.then( ( model ) => {
						if ( !model )
							return fail( new Error( 'related model "' + relation[ 0 ] + ':' + relation[ 1 ] + '" does not exist' ) );
						result[ relation[ 0 ] ] = model;
						relation_idx++;
						process();
					})
					.catch( fail )
				;
			}
			process();
		});
		
	}
	
	var sanitize_results = ( results, relations_to_fetch ) => {
		return new Promise( ( next, fail ) => {
			if ( !relations_to_fetch )
				relations_to_fetch = [];
			var result_idx = 0;
			var process = () => {
				if ( result_idx >= results.length )
					return next( results );
				sanitize_result( results[ result_idx ], relations_to_fetch )
					.then( ( result ) => {
						results[ result_idx ] = result;
						result_idx++;
						process();
					})
					.catch( fail )
				;
			}
			process();
		});
	}
	
	class Model extends BaseModel {
		constructor( data ) {
			super( filename );
			
			this.Classname = model_name;
			
			this.schema = schema;
			
			if ( data )
				for ( var k in data )
					this[ k ] = data[ k ];
		}
		
		Save( parameters ) {
			return new Promise( ( next, fail ) => {
				
				var data = {};
				if ( this.ID )
					data.ID = this.ID;
				for ( var k in this.schema )
					if ( this[ k ] !== null ) {
						// todo: validation?
						data[ k ] = this[ k ];
					}
				
				data = sanitize_query( data );
				
				if ( !parameters )
					parameters = {};
				parameters.table = model_name;
				parameters.data = data;
				
				this.Module( 'Sql' ).Save( parameters )
					.then( ( data ) => {
						if ( data.ID )
							this.ID = data.ID;
						return next();
					})
					.catch( fail )
				;
			});
		}

		Delete( parameters ) {
			return new Promise( ( next, fail ) => {
				
				if ( !this.ID )
					return fail( new Error( 'can\'t delete object without ID' ) );
				
				if ( !parameters )
					parameters = {};
				parameters.table = model_name;
				parameters.query = {
					ID: this.ID,
				};
				
				this.Module( 'Sql' ).Delete( parameters )
					.then( next )
					.catch( fail )
				;
			});
		}
		
	};
	  
	Model.schema = schema;

	// handy static methods
	Model.FindRaw = ( parameters, relations_to_fetch ) => {
		return new Promise( ( next, fail ) => {
			
			parameters.table = model_name;
			parameters.query = sanitize_query( parameters.query );
			
			basemodel.E.M.Sql.Query( parameters )
				.then( ( results ) => {
					sanitize_results( results, relations_to_fetch )
						.then( ( results ) => {
							var models = [];
							for ( var k in results )
								models.push( new Model( results[ k ] ) );
							return next( models );
						})
						.catch( fail )
					;
				})
				.catch( fail )
			;
			
		});
	};
	Model.Find = ( query, relations_to_fetch ) => {
		return Model.FindRaw({
			query: query,
		}, relations_to_fetch );
	}
	Model.FindOne = ( query, relations_to_fetch ) => {
		return new Promise( ( next, fail ) => {
			Model.Find( query, relations_to_fetch )
				.then( ( models ) => {
					var result;
					if ( !models.length )
						result = null;
					else if ( models.length > 1 ) {
						return fail( new Error( 'more than 1 result found' ) );
					}
					else
						result = models[ 0 ];
					return next( result );
				})
				.catch( fail )
			;
		});
	}
	
	return Model;
}
