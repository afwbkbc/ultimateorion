var engine = new ( require( './Backend/Engine' ) );

var error_handler = ( e ) => {
	console.log( 'ERROR', e );
	process.exit( 1 );
}

try {

	engine.Init()
		.then( () => {
			
			engine.Run();
		})
		.catch( error_handler )
	;

} catch ( e ) {
	error_handler( e );
}
