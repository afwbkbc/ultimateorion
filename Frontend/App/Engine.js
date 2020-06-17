window.App = {
	
	config: {
		modules: [
			'Loader',
			'State',
			'EventHandler',
			'Connection',
		],
	},
		
	Init: function() {
		for ( var k in this.config.modules )
			this.LoadModule( this.config.modules[ k ] );
	},
	
	Error: function( message, data ) {
		if ( typeof( data ) === 'undefined' )
			console.log( 'ERROR', message );
		else
			console.log( 'ERROR', message, data );
	},
	
	Extend: function( module ) {
		var that = this;
		var name = document.currentScript.getAttribute( 'data-path' );
		var iscollision = function() {
			if ( typeof( that[ name ] ) !== 'undefined' ) {
				that.Error( 'module name collision ( "' + name + '")' );
				return true;
			}
		}
		if ( iscollision() )
			return;
		var finalfunc = function() {
			if ( iscollision() ) // check again in case of some race condition
				return;
			that[ name ] = module;
		}
		if ( typeof( module.Init ) === 'function' ) {
			module.Init( finalfunc );
		}
		else
			finalfunc();
	},
	
	LoadModule: function( path ) {
		var script = document.createElement( 'script' );
		script.setAttribute( 'src', '/App/Module/' + path + '.js' );
		script.setAttribute( 'data-path', path );
		document.head.appendChild( script );
	}
	
};

window.App.Init();