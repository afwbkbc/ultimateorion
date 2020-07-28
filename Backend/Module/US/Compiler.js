class Compiler extends require( '../../_Base' ) {
	
	constructor() {
		super( module.filename );
		
		this.Stages = [ 'Parser' ];
		
		this.USObject = require( './USObject' );

		this.Handlers = {};
		let stage_path = 'Backend/Module/US/Stage';
		for ( let i in this.Stages ) {
			let handler_type = this.Stages[ i ];
			this.Stages[ i ] = require( './Stage/' + this.Stages[ i ] );
			this.Handlers[ handler_type ] = {};
			let dir = this.H.Fs.GetFiles( stage_path + '/' + handler_type );
			for ( let file_name of dir ) {
				var ext = this.H.Fs.GetExtension( file_name );
				if ( ext === 'js' && file_name[ 0 ] !== '_' ) {
					this.Handlers[ handler_type ][ file_name.substring( 0, file_name.length - ext.length - 1 ) ] = new ( require( './Stage/' + handler_type + '/' + file_name ) );
				}
			}
		}
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
				if ( ext === 'us' ) {
					var sources_key = file === 'main.us'
						? '' // special key for entry point
						: path + '/' + file.substring( 0, file.length - ext.length - 1 )
					;
					if ( typeof( sources[ sources_key ] ) !== 'undefined' )
						throw new Error( 'sources key "' + sources_key + '" already exists' );
					sources[ sources_key ] = new this.USObject( this, sources_key, this.H.Fs.ReadFile( full_file_path ).toString() );
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
		var us_objects = this.ReadSources( this.H.Fs.GetRootPath() + '/Backend/' + path );
		
		// compile core first
		if ( !us_objects[ '' ] )
			throw new Error( 'main.us not found' );
		us_objects[ '' ].Compile();
		
		// compile others
		for ( var k in us_objects ) {
			if ( k !== '' ) {
				us_objects[ k ].Compile();
			}
		}
		
	}
	
}

module.exports = Compiler;
