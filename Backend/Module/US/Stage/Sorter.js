/*
 * transforms array of primitives into ordered ( by operation priority ) array of primitives ( scopes are recursive )
 */

class Sorter extends require( './_Stage' ) {
	
	/*CreateError( message, pos_back_by ) {
		return new Error( ( this.Namespace ? ( this.Namespace + '.us' ) : '<core>' ) + ':' + this.LineNum + ':' + ( this.LinePos - ( pos_back_by ? pos_back_by : 0 ) ) + ' : ' + message );
	}*/
	
	Process( source ) {
	
		const handlers_preference = [
			'Identifier',
			'Delimiter',
		];
		
		//console.log( 'PROCESS', source );
		
		/*return source.sort( ( a, b ) => {
			let pa, pb;
			if ( ( pa = handlers_preference.indexOf( a.handler ) ) < 0 )
				throw new Error( 'no handler preference for "' + a.handler + '"' );
			if ( ( pb = handlers_preference.indexOf( b.handler ) ) < 0 )
				throw new Error( 'no handler preference for "' + b.handler + '"' );
			if ( pa > pb )
			
			//console.log( 'CMP', pa, pb );
			//process.exit();
		});*/
		
		
	}
}

module.exports = Sorter;
