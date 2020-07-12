class Util extends require( './_Helper' ) {
	
	constructor() {
		super( module.filename );
		
	}
	
	DeepMerge( obj1, obj2 ) {
		for ( var k in obj2 ) {
			var dst = obj1[ k ];
			var src = obj2[ k ];
			if ( typeof( dst ) === 'object' && typeof( src ) === 'object' && !dst.Classname && !src.Classname )
				obj1[ k ] = this.DeepMerge( dst, src );
			else
				obj1[ k ] = src;
		}
		return obj1; 
	}
	
	GetEntityTypeById( entity_id ) {
		var entity_type = entity_id;
		var pos;
		
		// cut off part after _
		if ( ( pos = entity_type.indexOf( '_' ) ) >= 0 )
			entity_type = entity_type.substring( 0, pos );
		
		// cut off part before / if it's present
		if ( ( pos = entity_type.indexOf( '/' ) ) >= 0 )
			entity_type = entity_type.substring( pos + 1 );
		
		return entity_type;
	}

	GetManagerByEntityId( entity_id ) {
		var entity_type = this.GetEntityTypeById( entity_id );
		
		var manager = this.E.M[ entity_type + 'Manager' ];

		return manager;
	}
}

module.exports = Util;
