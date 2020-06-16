class Config extends require( './_Helper' ) {

	constructor() {
		super( module.filename );
		
		this.ConfigPath = 'config.json';
	}
	
	Init() {
		var path = this.H.Fs.GetRootPath() + '/' + this.ConfigPath;
		
		if ( !this.H.Fs.IsFile( path ) )
			throw new Error( 'config.json missing, shutting down' );
		
		try {
			this.AllConfig = JSON.parse( this.H.Fs.ReadFile( path ) );
		} catch ( e ) {
			throw new Error( 'config.json corrupted or invalid' );
		}
	}
	
	GetConfig( name ) {
		var config = ( typeof( this.AllConfig[ name ] ) !== 'undefined' ) ? this.AllConfig[ name ] : {};
		if ( typeof( this.AllConfig[ 'Common' ] ) !== 'undefined' )
			config = Object.assign( config, this.AllConfig[ 'Common' ] );
		return config;
	}
}

module.exports = Config;
