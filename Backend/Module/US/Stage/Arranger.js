/*
 * transforms array of primitives into array of recursive statements
 */

class Arranger extends require( './_Stage' ) {
	
	CreateError( message ) {
		return new Error( this.GetFileName() + ':' + this.Element.line_num_from + ':' + this.Element.line_pos_from + ' : ' + message );
	}
	
	Process( source ) {
	
		this.Result = [];
		
		for ( this.ElementIdx in source ) {
			this.Element = source[ this.ElementIdx ];
			
			let handler = this.Handlers[ this.Element.handler ];
			if ( !this.handler )
				throw this.CreateError( 'unsupported source element "' + this.Element.handler + '"' );
			
			let result = handler.Process( this.Element, this.ElementIdx );
			
			console.log( 'R', result );
			
			break; // tmp
		}
		
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
		
		return this.Result;
	}
}

module.exports = Arranger;
