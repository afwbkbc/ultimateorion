class Http extends require( '../_Module' ) {

	constructor() {
		super( module.filename );
		
		this.Http = require( 'http' );
		this.FrontendPath = this.H.Fs.GetRootPath() + '/Frontend';
	}
	
	Init() {
		return new Promise( ( next, fail ) => {
			
			this.Server = this.Http.createServer( ( req, res ) => {
				
				var filepath, status, contenttype;
				switch ( req.url ) {
					case '/index.html' :
					case '/error.html' :
						filepath = '/error.html';
						status = 404;
						break;
					case '/' :
						filepath = '/index.html';
						status = 200;
						break;
					default:
						filepath = req.url;
						status = 200;
				}
				if ( !this.H.Fs.IsFile( this.FrontendPath + filepath ) ) {
					filepath = '/error.html';
					status = 404;
					if ( !this.H.Fs.IsFile( this.FrontendPath + filepath ) ) { // no error file
						res.end( '' );
						return;
					}
				}
				var ext = this.H.Fs.GetExtension( filepath );
				switch ( ext ) {
					case '.html':
						contenttype = 'text/html';
						break;
					case '.css':
						contenttype = 'text/css';
						break;
					case '.js':
						contenttype = 'text/javascript';
						break;
					default:
						contenttype = 'text/plain';
				}
				
				res.setHeader( 'Content-Type', contenttype );
				res.writeHead( status );
				res.end( this.H.Fs.ReadFile( this.FrontendPath + filepath ) );
				
			});
			
			this.Server.listen( this.Config.HttpPort );
			
			return next();
		});
	}
	
}

module.exports = Http;
