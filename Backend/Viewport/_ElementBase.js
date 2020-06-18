const Md5 = require( 'md5' );

class _ElementBase extends require( '../_Base' ) {
	
	constructor( filename ) {
		super( filename );

		this.Elements = {};
		this.Threads = this.H.Threads.CreatePool();
		
	}
	
	GetSession() {
		if ( this.Session )
			return this.Session;
		if ( this.Parent )
			return this.Parent.GetSession();
		throw new Error( 'unable to find session for element' );
	}
	
	/*
	 * anchors: [ outer_anchor_point, inner_anchor_point ], possible types: "LT, CT, RT, LC, CC, RC, LB, CB, RB"
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
		if ( element.Prepare )
			element.Prepare();
		element.Render( this.GetSession() );
		return element;
	}
	
	RemoveElement( element ) {
		if ( typeof( this.Elements[ element.Id ] ) === 'undefined' )
			throw new Error( 'Element id #' + element.Id + ' not found' );
		element.OnDestroyRecursive();
		delete this.Elements[ element.Id ];
	}
	
	OnDestroyRecursive() {
		for ( var k in this.Elements )
			this.RemoveElement( this.Elements[ k ] );
		this.Threads.Kill();
		if ( this.OnDestroy )
			this.OnDestroy();
	}
	
	RenderRecursive( target ) {
		if ( this.Render )
			this.Render( target );
		for ( var k in this.Elements )
			this.Elements[ k ].RenderRecursive( target );
	}

	UnrenderRecursive( target ) {
		for ( var k in this.Elements )
			this.Elements[ k ].UnrenderRecursive( target );
		if ( this.Unrender )
			this.Unrender( target );
	}

	Show() {
		if ( !this.IsVisible ) {
			this.IsVisible = true;
			this.RenderRecursive( this.Viewport.Session );
		}
	}
	
	Hide() {
		if ( this.IsVisible ) {
			this.IsVisible = false;
			this.UnrenderRecursive( this.Viewport.Session );
		}
	}
	
}

module.exports = _ElementBase;
