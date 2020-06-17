const Md5 = require( 'md5' );

class Viewport extends require( '../_Base' ) {

	constructor( session ) {
		super( module.filename );
		
		this.Session = session;
		this.Elements = {};
	}
	
	CreateElement( namespace, x, y, a, attributes ) {
		var id;
		do {
			id = Md5( Math.random() );
		} while ( typeof( this.Elements ) === 'undefined' );
		var element = new ( this.H.Loader.Require( 'Viewport/Element/' + namespace ) )( this, id );
		if ( attributes )
			element.SetAttributes( attributes );
		element.SetAttributes({
			X: x,
			Y: y,
		});
		this.Elements[ id ] = element;
		element.RenderToSession( this.Session );
		return element;
	}
	
	DestroyElement( element ) {
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
		for ( var k in this.Element )
			this.Element.RenderToConnection( connection );
	}
}

module.exports = Viewport;
