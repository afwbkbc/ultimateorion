window.App = {
	
	config: {
		modules: [
			'Config',
			'HomeBackground',
			'Loader',
			'Session',
			'Window',
			'Connection',
			'Viewport',
			'EventHandler',
		],
	},
		
	LoadModules: function( next ) {
		this.modules_to_load = Object.keys( this.config.modules ).length;
		this.on_all_modules_loaded = next;
		for ( var k in this.config.modules )
			this.LoadModule( this.config.modules[ k ] );
	},
	
	Init: function( next ) {
		var toinit = Object.keys( this.config.modules ).length;
		
		var that = this;
		var onmoduleloaded = function() {
			toinit--;
			if ( toinit < 0 ) {
				console.log( 'unexpected module init' );
				return;
			}
			if ( !toinit ) {
				console.log( 'all modules initialized' );
				next();
			}
		}
		
		for ( var k in this.config.modules ) {
			var m = this[ this.config.modules[ k ] ];
			if ( m.Init )
				m.Init( onmoduleloaded );
			else
				onmoduleloaded();
		}
	},
	
	Run: function() {
		for ( var k in this.config.modules ) {
			var m = this[ this.config.modules[ k ] ];
			if ( m.Run )
				m.Run();
		}
		console.log( 'modules started' );
	},
	
	Error: function( message, data ) {
		if ( typeof( data ) === 'undefined' )
			console.log( 'ERROR', message );
		else
			console.log( 'ERROR', message, data );
	},
	
	Extend: function( module ) {
		this.modules_to_load--;
		if ( this.modules_to_load < 0 ) {
			console.log( 'WARNING', 'unexpected Extend() call', module );
			return;
		}
		var that = this;
		var name = document.currentScript.getAttribute( 'data-path' );
		
		that[ name ] = module;
		
		if ( !this.modules_to_load ) {
			if ( this.on_all_modules_loaded )
				this.on_all_modules_loaded();
		}
	},
	
	LoadModule: function( path ) {
		var script = document.createElement( 'script' );
		script.setAttribute( 'src', '/App/Module/' + path + '.js' );
		script.setAttribute( 'data-path', path );
		document.head.appendChild( script );
	}
	
};

var app = window.App;
app.LoadModules( function() {
	app.Init( function() {
		app.Run();
	});
});
