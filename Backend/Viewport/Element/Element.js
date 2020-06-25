	class Element extends require( '../_ElementBase' ) {
	
	constructor( filename ) {
		super( filename );

		this.Attributes = {
			offsets: [ 0, 0 ],
			anchors: [ 'CC', 'CC' ],
		};
		this.IsVisible = true;
		this.IsFocused = false;
		this.IsEnabled = true;
		this.IsRendered = {};
		this.Events = {};
		
		// set defaults
		this.SetAttributes({
			Style: 'default',
		});

		this.On( 'focus', () => {
			this.IsFocused = true;
		});
		this.On( 'blur', () => {
			this.IsFocused = false;
		});
	}
	
	Attach( parent, element_type ) {
		this.Parent = parent;
		this.ElementType = element_type;
		this.Viewport = this.Parent.Viewport;
	}
	
	SetAttributes( attributes ) {
		this.Attributes = Object.assign( this.Attributes, attributes );
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
			attributes: this.Attributes,
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
	
	On( event, callback ) {
		if ( !this.Events[ event ] )
			this.Events[ event ] = [];
		this.Events[ event ].push( callback );
	}
	
	Trigger( event, data ) {
		if ( this.Events[ event ] )
			for ( var k in this.Events[ event ] )
				this.Events[ event ][ k ].apply( this, [ data ? data : {} ] );
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
}

module.exports = Element;
