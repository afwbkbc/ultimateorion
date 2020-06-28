class BaseModel extends require( '../_Base' ) {

	constructor( filename ) {
		super( filename );
		
	}
	
}

var basemodel = new BaseModel( module.filename ); // for helpers

module.exports = ( filename, schema ) => {
	
	var model_name = basemodel.H.Fs.PathToName( filename ).replace( 'Backend/Model/', '' );
	
	class Model extends BaseModel {
		constructor( data ) {
			super( filename );
			
			this.schema = schema;
			
			if ( data )
				for ( var k in data )
					this[ k ] = data[ k ];
		}
		
		Save() {
			return new Promise( ( next, fail ) => {
				
				var data = {};
				for ( var k in this.schema )
					if ( this[ k ] ) {
						// todo: validation?
						data[ k ] = this[ k ];
					}
				
				this.E.M.Sql.Save({
					table: model_name,
					data: data,
				})
					.then( ( data ) => {
						if ( data.id )
							this.ID = data.id;
						return next();
					})
					.catch( fail )
				;
			});
		}

		
	};
	  
	Model.schema = schema;
	
	// handy static methods
	Model.Find = ( query ) => {
		return new Promise( ( next, fail ) => {
			
			basemodel.E.M.Sql.Query({
				table: model_name,
				query: query,
			})
				.then( ( results ) => {
					var models = [];
					for ( var k in results )
						models.push( new Model( results[ k ] ) );
					return next( models );
				})
				.catch( fail )
			;
			
		});
	};
	Model.FindOne = ( query ) => {
		return new Promise( ( next, fail ) => {
			Model.Find( query )
				.then( ( models ) => {
					var result;
					if ( !models.length )
						result = null;
					else if ( models.length > 1 )
						return fail( new Error( 'more than 1 result found' ) );
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
