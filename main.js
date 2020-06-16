var engine = new ( require( './Backend/Engine' ) );

engine.Init()
	.then( () => {
		console.log( 'init done' );
		
		engine.Run();
	})
;
