class Element extends require( '../../_Base' ) {
	
	constructor( filename ) {
		super( filename );

		this.Attributes = {};
		this.IsVisible = true;
		
		// set defaults
		this.SetAttributes({
			Style: 'default',
		});
	}
	
	Attach( viewport, id, element_type ) {
		this.Viewport = viewport;
		this.Id = id;
		this.ElementType = element_type;
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

module.exports = Element;
