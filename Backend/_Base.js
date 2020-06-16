const FS = require( 'fs' );

console.log( 'LOADED' );

// helper is collection of tools accessible from any other class anytime

// load helper classes
var helpers = {};
var files = FS.readdirSync( './Backend/Helper' );
for ( var k in files ) {
	var file = files[ k ];
	if ( file[ 0 ] == '_' )
		continue; // abstract class
	if ( file.substring( file.length - 3 ) !== '.js' )
		continue; // not a class
	helpers[ file.substring( 0, file.length - 3 ) ] = new ( require( './Helper/' + file ) )();
}


for ( var k in helpers ) {
	helpers[ k ].H = {};
	for ( var kk in helpers ) {
		if ( k != kk ) // don't assign to itself
			helpers[ k ].H[ kk ] = helpers[ kk ];
	}
}

class _Base {
	
	constructor( fname ) {
		if ( typeof( fname ) === 'undefined' )
			throw new Error( 'script filename must be specified' );
		
		this.H = helpers; // helpers
		
		this.NS = this.H.Fs.PathToNamespace( fname );
	}

}

module.exports = _Base;
