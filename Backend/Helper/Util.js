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
	
}

module.exports = Util;
