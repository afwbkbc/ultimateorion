var engine = new ( require( './Backend/Engine' ) );

var error_handler = ( e ) => {
	console.log( 'ERROR' );
	process.Exit( 1 );
}

try {

	engine.Init()
		.then( () => {
			console.log( 'init done' );
			
			engine.Run();
		})
		.catch( error_handler )
	;

} catch ( e ) {
	error_handler( e );
}
