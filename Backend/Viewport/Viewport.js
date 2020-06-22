const Md5 = require( 'md5' );

class Viewport extends require( './_ElementBase' ) {

	constructor( filename, session ) {
		super( filename );
		
		this.Session = session;
		this.Viewport = this; // will be copied to all children
		this.AllElements = {}; // all children included
	}
	
	Destroy() {
		this.OnDestroyRecursive();
	}
	
	RegisterElement( element ) {
		var id;
		do {
			id = Md5( Math.random() );
		} while ( typeof( this.AllElements[ id ] ) !== 'undefined' );
		this.AllElements[ id ] = element;
		element.Id = id;
		//console.log( 'REGISTER', element.Id );
	}
	
	UnregisterElement( element ) {
		if ( typeof( this.AllElements[ element.Id ] ) === 'undefined' )
			throw new Error( 'element to be unregistered ( "' + element.Id + '" ) not found' );
		//console.log( 'UNREGISTER', element.Id );
		delete this.AllElements[ element.Id ];
	}
	
	GetElementById( id ) {
		if ( typeof( this.AllElements[ id ] ) === 'undefined' )
			throw new Error( 'element "' + id + '" not found' );
		return this.AllElements[ id ];
	}
	
	HandleEvent( event ) {
		var element = this.GetElementById( event.element );
		element.Trigger( event.event, event );
	}
	
}

module.exports = Viewport;
