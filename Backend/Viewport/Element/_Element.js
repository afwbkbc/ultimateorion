class Element extends require( '../../_Base' ) {
	
	constructor( filename ) {
		super( filename );

		this.Attributes = {};
		
		// set defaults
		this.SetAttributes({
			Anchor: 'center',
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
	
	RenderToConnection( connection ) {
		connection.Send( 'render', this.MakeRenderPayload() );
	}
	
	RenderToSession( session ) {
		session.Send( 'render', this.MakeRenderPayload() );
	}
}

module.exports = Element;
