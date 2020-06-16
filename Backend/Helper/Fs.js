class Fs extends require( './_Helper' ) {
	
	constructor() {
		super();
		
		this.Fs = require( 'fs' );
		this.Path = require( 'path' );
		this.Cache = {};
	}
	
	ReadFile( path ) {
		if ( typeof( this.Cache[ path ] ) === 'undefined' )
			this.Cache[ path ] = this.Fs.readFileSync( path );
		return this.Cache[ path ];
	}
	
	IsFile( path ) {
		return this.Fs.existsSync( path ) && this.Fs.lstatSync( path ).isFile();
	}
	
	// returns array of namespaces to classes found in directory ( no recursion except for Dir/Script.js cases )
	GetClasses( namespace ) {
		var classes = {};
		var path = './' + namespace;
		var files = this.Fs.readdirSync( path );
		for ( var k in files ) {
			var destpath = null;
			var destkey = files[ k ];
			var v = path + '/' + files[ k ];
			if ( this.Fs.lstatSync( v ).isDirectory() ) {
				if ( this.Fs.existsSync( v + '/' + files[ k ] + '.js' ) )
					destpath = ( v + '/' + files[ k ] ).substring( 2 ); // strip "./"
			}
			else if ( v.substring( v.length - 3 ) === '.js' ) {
				if ( files[ k ][ 0 ] !== '_' ) { // abstract class
					destpath = v.substring( 2, v.length - 3 ); // strip "./" and ".js"
					destkey = destkey.substring( 0, destkey.length - 3 ); // strip ".js"
				}
			}
			if ( destpath ) {
				if ( typeof( classes[ destkey ] ) !== 'undefined' )
					throw new Error( 'duplicate class on path "' + destkey + '"' );
				classes[ destkey ] = destpath.replace( 'Backend/', '' );
			}
		}
		return classes;
	}
	
	// returns absolute path of Backend dir
	GetRootPath() {
		return this.Path.dirname( process.argv[ 1 ] );
	}
	
	// converts filesystem path to namespace
	PathToNamespace( path ) {
		return this.Path.dirname( path )
			.replace( this.GetRootPath(), '' )
			.replace( /\\/g, '/' )
			.substring( 1 ) // remove leading slash
		;
	}	
}

module.exports = Fs;
