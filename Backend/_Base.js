const FS = require( 'fs' );

// handlers

var error_handler = ( e ) => {
	console.log( 'FATAL ERROR', e );
	process.exit( 1 );
}

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
// link helpers to each other, assign handlers
for ( var k in helpers ) {
	helpers[ k ].H = {};
	helpers[ k ].Error = error_handler;
	for ( var kk in helpers ) {
		if ( k != kk ) // don't assign to itself
			helpers[ k ].H[ kk ] = helpers[ kk ];
	}
}
// init helpers
for ( var k in helpers )
	try {
		helpers[ k ].Init();
	} catch ( e ) {
		error_handler( e );
	}
// assign other stuff ( that is available after initialization )
if ( typeof( helpers.Config ) !== 'undefined' )
	for ( var k in helpers )
		helpers[ k ].Config = helpers.Config.GetConfig( helpers[ k ].constructor.name );

class _Base {
	
	constructor( fname ) {
		if ( typeof( fname ) === 'undefined' )
			throw new Error( 'script filename must be specified, please add super( module.filename ); to constructor' );
		
		this.H = helpers; // helpers
		this.NS = this.H.Fs.PathToNamespace( fname );
		this.Classname = this.constructor.name;
		this.Error = error_handler;
		this.Config = this.H.Config.GetConfig( this.Classname );
	}

}

module.exports = _Base;
