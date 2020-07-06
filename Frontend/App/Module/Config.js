window.App.Extend({
	
	Init: function( next ) {
		
		var that = this;
		
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if ( this.readyState == 4 ) {
				if ( this.status == 200 ) {
					var config = JSON.parse( this.responseText );
					for ( var k in config )
						that[ k ] = config[ k ];
					next();
				}
				else
					console.log( 'WARNING', 'config.json fetch failed', this );
			}
		};
		xhttp.open( 'GET', '/config.json', true );
		xhttp.send();
		  
	},
	
});
