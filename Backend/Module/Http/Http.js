class Http extends require( '../_Module' ) {

	constructor() {
		super( module.filename );
		
		this.Http = require( 'http' );
		this.Ws = require( 'ws' );
		this.Connection = require( './Connection' );
		
		this.FrontendPath = this.H.Fs.GetRootPath() + '/Frontend';
		this.ConnectionPool = {};
		this.NextConnectionId = 0;
	}
	
	Init() {
		return new Promise( ( next, fail ) => {
			
			this.Server = this.Http.createServer();
			this.WsServer = new this.Ws.Server({
				server: this.Server,
			});
			
			this.Server.on( 'request', ( req, res ) => {
				
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
			
			this.WsServer.on( 'connection', ( ws, req ) => {
				
				var ws_id = ++this.NextConnectionId;
				if ( typeof( this.ConnectionPool[ ws_id ] ) !== 'undefined' ) {
					// something's very wrong
					throw new Error( 'ConnectionPool collision at #' + ws_id );
				}
				
				this.ConnectionPool[ ws_id ] = new this.Connection( this, ws_id, ws, req );
				
			});
			
			this.Server.listen( this.Config.HttpPort );
			
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
