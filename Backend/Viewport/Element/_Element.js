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
	
	MakeRenderPayload() {
		return {
			id: this.Id,
			element: this.ElementType,
			attributes: this.Attributes,
		};
	}
	
	MakeUnrenderPayload() {
		return {
			id: this.Id,
		};
	}
	
	RenderToConnection( connection ) {
		connection.Send( 'render', this.MakeRenderPayload() );
	}
	
	UnrenderToConnection( connection ) {
		connection.Send( 'unrender', this.MakeUnrenderPayload() );
	}
	
	RenderToSession( session ) {
		session.Send( 'render', this.MakeRenderPayload() );
	}
	
	UnrenderToSession( session ) {
		session.Send( 'unrender', this.MakeUnrenderPayload() );
	}
	
	Show() {
		if ( !this.IsVisible ) {
			this.IsVisible = true;
			this.RenderToSession( this.Viewport.Session );
		}
	}
	
	Hide() {
		if ( this.IsVisible ) {
			this.IsVisible = false;
			this.UnrenderToSession( this.Viewport.Session );
		}
	}
}

module.exports = _Element;
