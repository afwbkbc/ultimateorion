class Compiler extends require( '../../_Base' ) {
	
	constructor() {
		super( module.filename );
		
		this.Source = require( './Source' );
	}
	
	ReadSources( base_path, path, sources ) {
		if ( !path )
			path = '';
		if ( !sources )
			sources = {};
		var full_path = base_path + path;
		var files = this.H.Fs.GetFiles( full_path );
		for ( var file of files ) {
			var full_file_path = full_path + '/' + file;
			if ( this.H.Fs.IsFile( full_file_path ) ) {
				var ext = this.H.Fs.GetExtension( file );
				if ( ext == 'us' ) {
					var sources_key = file == 'main.us'
						? '' // special key for entry point
						: path + '/' + file.substring( 0, file.length - ext.length - 1 )
					;
					if ( typeof( sources[ sources_key ] ) !== 'undefined' )
						throw new Error( 'sources key "' + sources_key + '" already exists' );
					sources[ sources_key ] = new this.Source( this, sources_key, this.H.Fs.ReadFile( full_file_path ).toString() );
				}
			}
			else { // is directory
				this.ReadSources( base_path, path + '/' + file, sources );
			}
		}
		return sources;
	}
	
	CompilePackage( path ) {
		
		// read all sources and arrange by their namespaces
		var sources = this.ReadSources( this.H.Fs.GetRootPath() + '/Backend/' + path );
		
		// compile into javascript code
		for ( var k in sources ) {
			sources[ k ].Compile();
		}
		
	}
	
}

module.exports = Compiler;