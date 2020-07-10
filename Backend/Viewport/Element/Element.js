	class Element extends require( '../_ElementBase' ) {
	
	constructor( filename ) {
		super( filename );

		this.AttributesToSend = new Set(); // whitelist of attributes to be send to frontend
		this.Attributes = {};
		this.SendableAttributes = {};
		this.IsVisible = true;
		this.IsFocused = false;
		this.IsEnabled = true;
		this.IsRendered = false;
		
		// set defaults
		
		this.SendAttributes( [ 'Style', 'offsets', 'anchors' ] );
		
		this.SetAttributes({
			Style: 'default',
			offsets: [ 0, 0 ],
			anchors: [ 'CC', 'CC' ],
		});

		this.On( 'focus', () => {
			this.IsFocused = true;
		});
		this.On( 'blur', () => {
			this.IsFocused = false;
		});
	}
	
	SetCoreClass( filename ) {
		this.Class = this.H.Fs.PathToName( filename ).replace( 'Backend/Viewport/Element/', '' );
	}
	
	Attach( parent, element_type ) {
		this.Parent = parent;
		this.ElementType = this.Class ? this.Class : element_type;
		this.Viewport = this.Parent.Viewport;
	}
	
	SetAttributes( attributes, is_sync_needed ) {
		this.Attributes = Object.assign( this.Attributes, attributes );
		var attributes_to_send = {};
		
		/*for ( var k in attributes )
			if ( !this.AttributesToSend.has( k ) )
				console.log( 'SKIPATTRIBUTE', k, this.Classname );*/
		
		for ( var k of this.AttributesToSend ) {
			var a = attributes[ k ];
			if ( typeof( a ) !== 'undefined' ) {
				attributes_to_send[ k ] = a;
				this.SendableAttributes[ k ] = a;
			}
		}
		if ( is_sync_needed && this.IsRenderedRecursive() && this.Viewport && this.Viewport.Session && Object.keys( attributes_to_send ).length > 0 ) {
			this.RenderChange( this.Viewport.Session, {
				attributes: attributes_to_send,
			});
		}
	}
	
	SendAttributes( attributes ) {
		for ( var k in attributes )
			this.AttributesToSend.add( attributes[ k ] );
	}
	
	SetAttribute( key, value ) {
		var attrs = {};
		attrs[ key ] = value;
		this.SetAttributes( attrs );
	}
	
	IsVisibleRecursive() {
		if ( !this.IsVisible )
			return false;
		if ( this.Parent && this.Parent.IsVisibleRecursive )
			return this.Parent.IsVisibleRecursive();
		return true;
	}
	
	IsRenderedRecursive() {
		if ( !this.IsRendered )
			return false;
		if ( this.Parent && this.Parent.IsRenderedRecursive )
			return this.Parent.IsRenderedRecursive();
		return true;
	}
	
	Render( target ) {
		if ( !this.IsVisibleRecursive() )
			return;
		var payload = {
			id: this.Id,
			element: this.ElementType,
			attributes: this.SendableAttributes,
			focused: this.IsFocused,
			enabled: this.IsEnabled,
		};
		if ( this.Parent && this.Parent.Id )
			payload.parent_id = this.Parent.Id;
		target.Send( 'render', payload );
		this.IsRendered = true;
	}
	
	Unrender( target ) {
		if ( !this.IsRenderedRecursive() )
			return;
		target.Send( 'unrender', {
			id: this.Id,
		});
		this.IsRendered = false;
	}
	
	RenderChange( target, changes ) {
		target.Send( 'renderchange', {
			id: this.Id,
			changes: changes,
		});
	}
	
	GetOffsets() {
		return this.Attributes.offsets;
	}
	
	SetOffsets( offsets ) {
		if ( offsets[ 0 ] != this.Attributes.offsets[ 0 ] || offsets[ 1 ] != this.Attributes.offsets[ 1 ] ) {
			this.Attributes.offsets = offsets;
			this.RenderChange( this.GetSession(), {
				offsets: offsets,
			});
		}
	}
	
	Redraw() {
		var session = this.GetSession();
		this.Unrender( session );
		this.Render( session );
	}
	
	Focus() {
		if ( !this.IsFocused ) {
			this.Viewport.FocusElement( this );
			this.RenderChange( this.GetSession(), {
				focused: true,
			});
		}
	}
	
	Blur() {
		if ( this.IsFocused ) {
			this.RenderChange( this.GetSession(), {
				focused: false,
			});
			this.Viewport.BlurElement( this );
		}
	}
	
	Enable() {
		if ( !this.IsEnabled ) {
			this.IsEnabled = true;
			this.RenderChange( this.GetSession(), {
				enabled: true,
			});
		}
	}
	
	Disable() {
		if ( this.IsEnabled ) {
			this.IsEnabled = false;
			if ( this.IsFocused ) {
				this.IsFocused = false;
			}
			this.RenderChange( this.GetSession(), {
				enabled: false,
			});
		}
	}
	
	GetWidth() { // override when necessary
		return this.Attributes.Width ? this.Attributes.Width : 0;
	}
	
	GetHeight() { // override when necessary
		return this.Attributes.Height ? this.Attributes.Height : 0;
	}
	
	DisableWhile( promise ) {
		return new Promise( ( next, fail ) => {
			this.Disable();
			promise
				.then( ( result ) => {
					this.Enable();
					return next( result );
				})
				.catch( fail )
			;
		});
	}
}

module.exports = Element;
