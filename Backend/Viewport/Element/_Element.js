class Element extends require( '../../_Base' ) {
	
	constructor( viewport, id, element_type ) {
		super( module.filename );

		this.Viewport = viewport;
		this.Id = id;
		this.ElementType = element_type;
		
		this.Attributes = {};
		
		this.SetAttributes({
			Anchor: 'center',
		});
	}
	
	SetAttributes( attributes ) {
		this.Attributes = Object.assign( this.Attributes, attributes );
	}
	
	RenderToConnection( connection ) {
		//var payload = this.Render();
		//connection.Send( 'render', )
	}
	
	RenderToSession( session ) {
		//var payload = this.Render();
		
	}
}

module.exports = Element;
