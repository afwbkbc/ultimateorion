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
			this.Config = JSON.parse( this.H.Fs.ReadFile( path ) );
		} catch ( e ) {
			throw new Error( 'config.json corrupted or invalid' );
		}
	}
	
	GetModuleConfig( name ) {
		return ( typeof( this.Config[ name ] ) !== 'undefined' ) ? this.Config[ name ] : {};
	}
}

module.exports = Config;
