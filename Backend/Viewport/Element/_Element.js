class _Element extends require( '../_ElementBase' ) {
	
	constructor( filename ) {
		super( filename );

		this.Attributes = {};
		this.IsVisible = true;
		
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
	}
	
	Unrender( target ) {
		target.Send( 'unrender', {
			id: this.Id,
		});
	}
	
}

module.exports = _Element;
