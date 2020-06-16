class TestModule extends require( './_Module' ) {

	constructor() {
		super( module.filename );
	}
	
}

module.exports = TestModule;
