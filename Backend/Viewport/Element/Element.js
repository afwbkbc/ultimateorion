class Element extends require( '../_ElementBase' ) {
	
	constructor( filename ) {
		super( filename );

		this.Attributes = {
			offsets: [ 0, 0 ],
			anchors: [ 'CC', 'CC' ],
		};
		this.IsVisible = true;
		this.IsRendered = {};
		
		// set defaults
		this.SetAttributes({
			Style: 'default',
		});
	}
	
	Attach( parent, id, element_type ) {
		this.Parent = parent;
		this.Id = id;
		this.ElementType = element_type;
		this.Viewport = this.GetViewport();
	}
	
	GetViewport() {
		if ( !this.Parent )
			return this;
		if ( !this.Parent.Parent )
			return this.Parent;
		return this.Parent.GetViewport();
	}
	
	SetAttributes( attributes ) {
		this.Attributes = Object.assign( this.Attributes, attributes );
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
}

module.exports = Element;
