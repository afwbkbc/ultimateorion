class Http extends require( '../_Module' ) {

	constructor() {
		super( module.filename );
		
		this.Http = require( 'http' );
		this.Https = require( 'https' );
		this.Ws = require( 'ws' );
		this.Connection = require( './Connection' );
		
		this.FrontendPath = this.H.Fs.GetRootPath() + '/Frontend';
		this.ConnectionPool = {};
		this.NextConnectionId = 0;
	}
	
	Run() {
		this.Server.listen( this.Config.Port );
	}
	
	Init() {
		return new Promise( ( next, fail ) => {
			
			this.ConfigJson = JSON.stringify({
				UseSSL: this.Config.UseSSL,
			});
			
			if ( this.Config.UseSSL )
				this.Server = this.Https.createServer({
					cert: this.H.Fs.ReadFile( this.H.Fs.GetRootPath() + '/SSL/cert.pem' ),
					key: this.H.Fs.ReadFile( this.H.Fs.GetRootPath() + '/SSL/key.pem' ),
				});
			else
				this.Server = this.Http.createServer();
			
			this.WsServer = new this.Ws.Server({
				server: this.Server,
			});
			
			this.Server.on( 'error', ( a, b, c ) => {
				console.log( 'HTTPS ERROR', a, b, c );
			});

			this.Server.on( 'request', ( req, res ) => {
				
				//console.log( req );
				//process.exit( 1 );
				
				var filepath, status, contenttype;
				switch ( req.url ) {
					case '/config.json' :
						// special case - send frontend config
						res.setHeader( 'Content-Type', 'application/json' );
						res.writeHead( 200 );
						res.end( this.ConfigJson );
						return;
					case '/index.html' :
					case '/error.html' :
						filepath = '/error.html';
						status = 404;
						break;
					case '/DevGallery' :
						// generate file list with links to images
						var content = '<!DOCTYPE html><head><title>UltimateOrion Development Gallery</title></head><body><h1>UltimateOrion Development Gallery</h1>';
						content += '<a href="/">..</a><br/>';
						var files = this.H.Fs.GetFiles( './Frontend/DevGallery' );
						for ( var k in files ) {
							var f = files[ k ];
							content += '<a href="/DevGallery/' + f + '">' + f + '</a><br/>';
						}
						content += '</body></html>';
						res.setHeader( 'Content-Type', 'text/html' );
						res.writeHead( 200 );
						res.end( content );
						return;
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
						contenttype = 'text/html; charset=utf-8';
						break;
					case '.css':
						contenttype = 'text/css';
						break;
					case '.js':
						contenttype = 'text/javascript';
						break;
					case '.png':
						contenttype = 'image/png';
						break;
					case '.jpg':
					case '.jpeg':
						contenttype = 'image/jpeg';
						break;
					case '.gif':
						contenttype = 'image/gif';
						break;
					default:
						contenttype = 'text/plain';
				}
				
				res.setHeader( 'Content-Type', contenttype );
				res.writeHead( status );
				res.end( this.H.Fs.ReadFile( this.FrontendPath + filepath ) );
				
			});
			
			this.WsServer.on( 'connection', ( ws, req ) => {
				
				var ws_id = ++this.NextConnectionId;
				if ( typeof( this.ConnectionPool[ ws_id ] ) !== 'undefined' ) {
					// something's very wrong
					throw new Error( 'ConnectionPool collision at #' + ws_id );
				}
				
				this.ConnectionPool[ ws_id ] = new this.Connection( this, ws_id, ws, req );
				
			});
			
			return next();
		});
	}
	
	RemoveConnection( ws_id ) {
		if ( typeof( this.ConnectionPool[ ws_id ] ) === 'undefined' ) {
			// something's very wrong
			throw new Error( 'ConnectionPool connection #' + ws_id + ' does not exist' );
		}
		delete this.ConnectionPool[ ws_id ];
	}
	
}

module.exports = Http;
