class Sql extends require( '../_Module' ) {

	constructor() {
		super( module.filename );
		
		this.Mysql = require( 'mysql' ); 
	}
	
	Init() {
		return new Promise( ( next, fail ) => {
			
			// init connection
			this.Sql = this.Mysql.createPool({
				host: this.Config.Host,
				database: this.Config.Database,
				user: this.Config.Username,
				password: this.Config.Password,
			});
			
			// load models
			this.Models = {};
			var models = this.H.Fs.GetClasses( 'Backend/Model' );
			for ( var k in models )
				this.Models[ k ] = this.H.Loader.Require( models[ k ] );
			
			this.UpdateSchema()
				.then( next )
				.catch( fail )
			;
			
		});
	}
	
	UpdateSchema() {
		return new Promise( ( next, fail ) => {
			
			// read existing database schema
			this.GetSchema()
				.then( ( existing_schema ) => {
					
					// read schemas from all models
					var schemas = {};
					for ( var k in this.Models )
						schemas[ k ] = this.Models[ k ].schema;
					
					var relations = []; // relations need to be made in the end so save them here first
					
					// generate queries
					var queries = [];
					for ( var table in this.Models ) {
						var existing_table = existing_schema[ table.toLowerCase() ];
						var model = this.Models[ table ];
						var schema = model.schema;
						if ( !existing_table )
							queries.push( 'CREATE TABLE `' + table + '` ( `ID` INT(4) NOT NULL AUTO_INCREMENT PRIMARY KEY ) CHARACTER SET utf8 COLLATE utf8_unicode_ci' );
						for ( var column in schema ) {
							var field = schema[ column ];
							
							if ( !existing_table || existing_table.fields.indexOf( column ) < 0 ) {
								var query = 'ALTER TABLE `' + table + '` ADD COLUMN `' + column + '` ';
								
								switch ( field.type ) {
									case 'int': query += 'INT(' + ( field.size ? field.size : 4 ) + ')'; break;
									case 'string': query += 'VARCHAR(' + ( field.size ? field.size : 64 ) + ')'; break;
									case 'datetime': query += 'DATETIME'; break;
									case 'manytoone':
										relations.push({
											relation: field.type,
											table: table,
											target: column,
										});
										query = null;
										break;
									default: console.log( field ); return fail( 'unknown schema type "' + field.type + '"' );
								}
								
								if ( query ) {
									if ( !field.nullable )
										query += ' NOT NULL';
									if ( field.autoincrement )
										query += ' AUTO_INCREMENT';
									queries.push( query );
								}
								
								if ( field.index ) {
									if ( !existing_table || !existing_table.indexes[ column ] ) {
										queries.push( 'CREATE ' + ( field.index == 'unique' ? 'UNIQUE ' : '' ) + 'INDEX `' + column + '` ON `' + table + '` ( `' + column + '` )' );
									}
								}
							}
						}
					}
					
					// add relations
					for ( var k in relations ) {
						var relation = relations[ k ];
						switch ( relation.relation ) {
							case 'manytoone':
								var column = relation.target + 'ID';
								if ( !existing_table || existing_table.fields.indexOf( column ) < 0 ) {
									queries.push( 'ALTER TABLE `' + table + '` ADD COLUMN `' + column + '` INT( 4 ) NOT NULL' );
									queries.push( 'ALTER TABLE `' + table + '` ADD FOREIGN KEY ( `' + column + '` ) REFERENCES `' + relation.target + '` ( `ID` )' );
								}
								break;
							default: return fail( 'unsupported relation "' + relation.relation + '"' );
						}
					}
					
					// execute queries
					var query_idx = 0;
					var execute_query = () => {
						if ( query_idx >= queries.length )
							return next();
						var query = queries[ query_idx ];
						console.log( '[SQL] ' + query );
						this.Sql.query( query, [], ( err, rows ) => {
							if ( err )
								return fail( err );
							query_idx++;
							execute_query();
						});
					};
					execute_query();
					
				})
				.catch( fail )
			;
		});
	}
	
	GetSchema() {
		return new Promise( ( next, fail ) => {

			// read existing tables
			this.Sql.query( 'SHOW TABLES', [], ( err, table_rows ) => {
				if ( err )
					return fail( err );
				
				var schema = {};
				var finish = () => {
					return next( schema );
				}
				
				var tables = {};
				var table_idx = 0;
				var read_next_table = () => {
					if ( table_idx >= table_rows.length )
						return finish();
					var table_name = Object.values( table_rows[ table_idx ] )[ 0 ];
					this.Sql.query( 'EXPLAIN `' + table_name + '`', [], ( err, rows ) => {
						if ( err )
							return fail( err );
						
						var fields = [];
						try {
							for ( var k in rows )
								fields.push( rows[ k ].Field );
						} catch ( e ) {
							return fail( e );
						}
						
						this.Sql.query( 'SHOW INDEX FROM `' + table_name + '`', [], ( err, rows ) => {
							if ( err )
								return fail( err );
							
							var indexes = {};
							try {
								for ( var k in rows )
									indexes[ rows[ k ].Key_name ] = rows[ k ].Column_name;
							} catch ( e ) {
								return fail( e );
							}
							
							schema[ table_name ] = {
								fields: fields,
								indexes: indexes,
							}
							table_idx++;
							read_next_table();
						});
					});
				}
				read_next_table();
			});
			
		});
	}
	
	// finds item(s) in database
	Query( parameters ) {
		return new Promise( ( next, fail ) => {

			var where = '';
			var values = [];
			
			if ( parameters.query ) {
				for ( var k in parameters.query ) {
					var v = parameters.query[ k ];
					if ( !where.length )
						where += ' WHERE ';
					else
						where += ' AND ';
					if ( typeof( v ) === 'string' )
						v = [ k, '=', v ];
					
					var field;
					if ( v[ 0 ].indexOf( '`' ) < 0 )
						field = '`' + parameters.table + '`.`' + v[ 0 ] + '`';
					else
						field = v[ 0 ];
					
					where += field + ' ' + v[ 1 ] + ' ?';
					values.push( v[ 2 ] );
				}
			}
			
			var join_str = '';
			if ( parameters.joins ) {
				for ( var k in parameters.joins ) {
					var v = parameters.joins[ k ];
					join_str += ' LEFT JOIN `' + v + 's` ON `' + v + 's`.`id` = `' + parameters.table + '`.`' + v + '_id`';
				}
			}
			
			var query =
				'SELECT ' +
				'`' + parameters.table + '`.*' + ( parameters.extra_selects ? ', ' + parameters.extra_selects : '' ) +
				' FROM `' + parameters.table + '`' +
				join_str +
				where +
				( parameters.order ? ' ORDER BY ' + parameters.order : '' ) +
				( parameters.limit ? ' LIMIT ' + parameters.limit : '' )
			;
			
			this.Sql.query( query, values, (err, rows, fields) => {
				
				  if (err)
					  return fail( err );
				  
				  return next( rows );
			});
			
		});
	}
	
	// saves item to database
	Save( parameters ) {
		return new Promise( ( next, fail ) => {
		
			var data = parameters.data;
			
			var is_insert = typeof( data.id ) === 'undefined' || data.id === null;
			
			var fields = '';
			var values = [];
			
			for ( var k in data ) {
				
				if ( k == 'id' )
					continue; // don't update id
				
				var v = data[ k ];
				
				if ( is_insert ) {
					if ( !fields.length )
						fields += '( ';
					else
						fields += ', ';
					fields += '`' + k + '`';
				}
				else {
					if ( !fields.length )
						fields += 'SET ';
					else
						fields += ', ';
					fields += '`' + k + '` = ?';
				}
				
				values.push( v );
			}
			if ( is_insert )
				fields += ')';
			
			var query = ( is_insert
				? 'INSERT INTO'
				: 'UPDATE'
			) + ' `' + parameters.table + '` ' + fields;
			
			if ( is_insert ) {
				var fields2 = '';
				for ( var k in data ) {
					if ( k == 'id' )
						continue;
					if ( !fields2.length )
						fields2 += '( ';
					else
						fields2 += ', ';
					fields2 += '?';
				}
				fields2 += ' )';
				query += ' VALUES ' + fields2;
			}
			else {
				query += ' WHERE `id` = ? LIMIT 1';
				values.push( data.id );
			}
			
			this.Sql.query( query, values, function ( err, result ) {
				if (err)
					return fail( err );
				
				if ( is_insert ) {
					data.id = result.insertId;
				}
				return next( data );
			});
			
		});
	}
}

module.exports = Sql;
