const Md5 = require( 'md5' );

class Viewport extends require( '../_Base' ) {

	constructor( filename, session ) {
		super( filename );
		
		this.Session = session;
		this.Elements = {};
	}
	
	/*
	 * anchors: [ inner_anchor_point, outer_anchor_point ], possible types: "LT, CT, RT, LC, CC, RC, LB, CB, RB"
	 * offsets: [ left_offset, top_offset ]
	 */
	
	AddElement( namespace, anchors, offsets, attributes ) {
		var id;
		do {
			id = Md5( Math.random() );
		} while ( typeof( this.Elements ) === 'undefined' );
		var element = new ( this.H.Loader.Require( 'Viewport/Element/' + namespace ) )();
		element.Attach( this, id, namespace );
		if ( attributes )
			element.SetAttributes( attributes );
		element.SetAttributes({
			anchors: anchors,
			offsets: offsets,
		});
		this.Elements[ id ] = element;
		element.RenderToSession( this.Session );
		return element;
	}
	
	RemoveElement( element ) {
		if ( typeof( this.Elements[ element.id ] ) === 'undefined' )
			throw new Error( 'Element id not found', element.id );
		if ( typeof( element.OnDestroy() ) === 'function' )
			element.OnDestroy();
		delete this.Elements[ element.id ];
	}
	
	OnDestroy() {
		for ( var k in this.Elements )
			this.DestroyElement( this.Elements[ k ] );
	}
	
	RenderToConnection( connection ) {
		for ( var k in this.Elements )
			this.Elements[ k ].RenderToConnection( connection );
	}
}

module.exports = Viewport;
