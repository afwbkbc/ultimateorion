class Source {
	
	constructor( compiler, namespace, code ) {
		this.Compiler = compiler;
		this.Namespace = namespace;
		this.Code = code;
	}
	
	Compile() {
		
		let parser = new ( require( './Parser' ) )( this.Compiler );
		let parsed_data = parser.Parse( this.Namespace, this.Code );
		
/*		var lines = [];
		
		// test reconstruct
		for ( let k in parsed_data ) {
			var d = parsed_data[ k ];
			while ( d.line_num_to > lines.length )
				lines.push( ' '.repeat( 200 ) );
			if ( d.line_num_from === d.line_num_to ) {
				for ( let i = d.line_pos_from ; i <= d.line_pos_to ; i++ ) {
					let l = lines[ d.line_num_from - 1 ];
					let idx = i - 1;
					//lines[ d.line_num_from - 1 ][ d.line_pos_from + i - 1 ] = d.source[ i ];
					lines[ d.line_num_from - 1 ] = l.substring( 0, idx ) + d.source[ i - d.line_pos_from ] + l.substring( idx + 1 );
				}
			}
			//console.log( d );break;
		}
		for ( let l of lines ) {
			console.log( l );
		}*/
		
		//for ( let k in parsed_data ) {
			//console.log( 'all done', parsed_data[ k ] );
		//}
		
		//console.log( 'COMPILE', this.Namespace, this.Code );
		
	}
}

module.exports = Source;
