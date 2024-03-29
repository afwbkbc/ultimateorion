const Md5 = require( 'md5' );

class Viewport extends require( './_ElementBase' ) {

	constructor( filename, session ) {
		super( filename );
		
		this.Session = session;
		this.Viewport = this; // will be copied to all children
		this.AllElements = {}; // all children included
		this.FocusedElement = null;
		this.DisabledLayers = []; // needed for DisableLayer() / RestoreLayer() calls, i.e. for ShowWindow
		
		this.MaxZIndexPerWindow = 100; // in scope of window z-index is capped at this value. For each ShowWindow stack, though, every window gets z-index increased by this value over previous window
		
		this.CurrentWindowZIndex = 0;
	}
	
	// override if needed
	Init() {
		this.Log( this.Session.Id, 'Viewport created', {
			Viewport: this.Classname,
		});
	}
	
	Pack() {
		return {}; // TODO
	}
	
	Unpack( data ) {
		// TODO
	}
	
	Destroy() {
		this.OnDestroyRecursive();
		this.Log( this.Session.Id, 'Viewport destroyed', {
			Viewport: this.Classname,
		});
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
		if ( !id || typeof( this.AllElements[ id ] ) === 'undefined' )
			return null;
		return this.AllElements[ id ];
	}
	
	Trigger( event, data ) {
		if ( !data )
			data = {};
		data.event = event;
		this.HandleEvent({
			data: {
				data: data,
			},
		});
	}
	
	HandleEvent( event ) {
		var data = event.data.data;
		var element = this.GetElementById( data.element );
		
		switch ( data.event ) {
			case 'focus': {
				if ( element )
					this.FocusElement( element );
				break;
			}
			case 'blur': {
				if ( element )
					this.BlurElement( element );
				break;
			}
			case 'toggle_debug_console': {
				if ( this.Config.Debug ) {
					if ( this.DebugConsole ) {
						this.DebugConsole.Close();
						delete this.DebugConsole;
					}
					else
						this.DebugConsole = this.ShowWindow( 'Window/DebugConsole' );
				}
				break;
			}
			case 'debug_push': {
				if ( this.DebugConsole )
					this.DebugConsole.PushMessage( data );
				break;
			}
			case 'debug_pop': {
				if ( this.DebugConsole )
					this.DebugConsole.PopMessage();
				break;
			}
		}

		if ( element )
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
		this.CurrentWindowZIndex += this.MaxZIndexPerWindow;
		if ( !attributes )
			attributes = {};
		attributes.ZIndexFromViewport = this.CurrentWindowZIndex;
		var window = this.AddElement( namespace, [ 'CC', 'CC' ], [ 0, 0 ], attributes )
			.On( 'close', () => {
				this.CurrentWindowZIndex -= this.MaxZIndexPerWindow;
				this.RestoreLayer();
			})
		;
		return window;
	}
	
}

module.exports = Viewport;
