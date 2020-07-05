const Md5 = require( 'md5' );

class Viewport extends require( './_ElementBase' ) {

	constructor( filename, session ) {
		super( filename );
		
		this.Session = session;
		this.Viewport = this; // will be copied to all children
		this.AllElements = {}; // all children included
		this.FocusedElement = null;
		this.DisabledLayers = []; // needed for DisableLayer() / RestoreLayer() calls, i.e. for ShowWindow
	}
	
	// override if needed
	Init() {
		
	}
	
	Pack() {
		return {};
	}
	
	Unpack( data ) {
		
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
	
	DisableLayer() {
		var disabled_elements = [];
		for ( var k in this.Elements ) {
			var el = this.Elements[ k ];
			if ( el.IsEnabled ) {
				el.Disable();
				disabled_elements.push( el );
			}
		}
		this.DisabledLayers.push( disabled_elements );
	}
	
	RestoreLayer() {
		if ( !this.DisabledLayers.length )
			throw new Error( 'no layer to restore in RestoreLayer()' );
		var disabled_elements = this.DisabledLayers.pop();
		for ( var k in disabled_elements )
			disabled_elements[ k ].Enable();
	}
	
	ShowWindow( namespace, attributes ) {
		this.DisableLayer();
		var window = this.AddElement( namespace, [ 'CC', 'CC' ], [ 0, 0 ], attributes ? attributes : {} )
			.On( 'close', () => {
				this.RestoreLayer();
			})
		;
		return window;
	}
	
}

module.exports = Viewport;
