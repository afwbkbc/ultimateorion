const Md5 = require( 'md5' );

class Viewport extends require( './_ElementBase' ) {

	constructor( filename, session ) {
		super( filename );
		
		this.Session = session;
		this.Viewport = this; // will be copied to all children
		this.AllElements = {}; // all children included
		this.FocusedElement = null;
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
	}
	
	UnregisterElement( element ) {
		if ( typeof( this.AllElements[ element.Id ] ) === 'undefined' )
			throw new Error( 'element to be unregistered ( "' + element.Id + '" ) not found' );
		//console.log( 'UNREGISTER', element.Id );
		delete this.AllElements[ element.Id ];
	}
	
	FocusElement( element ) {
		if ( !element.IsFocused ) {
			if( this.FocusedElement )
				this.BlurElement( element );
			element.IsFocused = true;
		}
	}
	
	BlurElement( element ) {
		if ( element.IsFocused ) {
			element.IsFocused = false;
			if ( this.FocusedElement && this.FocusedElement.Id == element.Id )
				this.FocusedElement = null;
		}
	}
	
	GetElementById( id ) {
		if ( typeof( this.AllElements[ id ] ) === 'undefined' )
			throw new Error( 'element "' + id + '" not found' );
		return this.AllElements[ id ];
	}
	
	HandleEvent( event ) {
		var element = this.GetElementById( event.element );
		
		switch ( event.event ) {
			case 'focus': {
				this.FocusElement( element );
				break;
			}
			case 'blur': {
				this.BlurElement( element );
				break;
			}
		}
		
		element.Trigger( event.event, event ); // element-specific handlers
	}
	
}

module.exports = Viewport;
