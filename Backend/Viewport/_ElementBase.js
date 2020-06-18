const Md5 = require( 'md5' );

class _ElementBase extends require( '../_Base' ) {
	
	constructor( filename ) {
		super( filename );

		this.Elements = {};
	}
	
	GetSession() {
		if ( this.Session )
			return this.Session;
		if ( this.Parent )
			return this.Parent.GetSession();
		throw new Error( 'unable to find session for element' );
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
		element.RenderToSession( this.GetSession() );
		return element;
	}
	
	RemoveElement( element ) {
		if ( typeof( this.Elements[ element.id ] ) === 'undefined' )
			throw new Error( 'Element id not found', element.id );
		element.OnDestroyRecursive();
		delete this.Elements[ element.id ];
	}
	
	OnDestroyRecursive() {
		for ( var k in this.Elements )
			this.RemoveElement( this.Elements[ k ] );
		if ( this.OnDestroy )
			this.OnDestroy();
	}
	
	RenderToConnectionRecursive( connection ) {
		if ( this.RenderToConnection )
			this.RenderToConnection( connection );
		for ( var k in this.Elements )
			this.Elements[ k ].RenderToConnectionRecursive( connection );
	}

}

module.exports = _ElementBase;
