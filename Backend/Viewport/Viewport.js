const Md5 = require( 'md5' );

class Viewport extends require( './_ElementBase' ) {

	constructor( filename, session ) {
		super( filename );
		
		this.Session = session;
		this.Viewport = this; // will be copied to all children
		this.AllElements = {}; // all children included
		this.FocusedElement = null;
	}
	
	Serialize() {
		//console.log( 'S', this ); // TODO
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
			return null;
		return this.AllElements[ id ];
	}
	
	HandleEvent( event ) {
		var data = event.data.data;
		var element = this.GetElementById( data.element );
		if ( !element ) // deleted?
			return;
		
		switch ( data.event ) {
			case 'focus': {
				this.FocusElement( element );
				break;
			}
			case 'blur': {
				this.BlurElement( element );
				break;
			}
		}
		
		element.Trigger( data.event, data, event ); // element-specific handlers
	}
	
	DisableAll() {
		for ( var k in this.Elements )
			this.Elements[ k ].Disable();
	}
	
	EnableAll() {
		for ( var k in this.Elements )
			this.Elements[ k ].Enable();
	}
	
	ShowWindow( namespace ) {
		this.DisableAll();
		var window = this.AddElement( namespace, [ 'CC', 'CC' ], [ 0, 0 ], {} )
			.On( 'close', () => {
				this.EnableAll();
			})
		;
		return window;
	}
	
}

module.exports = Viewport;
