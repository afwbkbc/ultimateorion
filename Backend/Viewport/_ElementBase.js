class _ElementBase extends require( '../_EventAwareBase' ) {
	
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
		var element = new ( this.H.Loader.Require( 'Viewport/Element/' + namespace ) )();
		this.Viewport.RegisterElement( element );
		element.Attach( this, namespace );
		if ( attributes )
			element.SetAttributes( attributes );
		element.SetAttributes({
			anchors: anchors,
			offsets: offsets,
		});
		this.Elements[ element.Id ] = element;
		element.Render( this.GetSession() );
		if ( element.Prepare )
			element.Prepare();
		setTimeout( () => {
			element.Trigger( 'prepare', {}, {} );
		}, 0 ); // needs to be executed a bit later to wait for handler to be added ( needs more testing )
		return element;
	}
	
	RemoveElement( element ) {
		//console.log( this.Elements );
		if ( typeof( this.Elements[ element.Id ] ) === 'undefined' )
			throw new Error( 'Element id #' + element.Id + ' not found' );
		element.OnDestroyRecursive();
		delete this.Elements[ element.Id ];
	}
	
	OnDestroyRecursive() {
		if ( this.Listeners )
			for ( var k in this.Listeners )
				this.Listeners[ k ].Detach();
		if ( this.OnDestroy )
			this.OnDestroy();
		for ( var k in this.Elements )
			this.RemoveElement( this.Elements[ k ] );
		this.Threads.Kill();
		if ( this.Viewport != this )
			this.Viewport.UnregisterElement( this );
		if ( this.Unrender )
			this.Unrender( this.Viewport.Session );
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
	
	Listen( listenable ) {
		var listener = listenable.CreateListener();
		this.Listeners.push( listener );
		setTimeout( () => { // allow for .On() calls to be applied first
			listener.Attach();
		}, 1 );
		return listener;
	}

	Log( text, data ) {
		if ( this.Viewport && this.Viewport.Session )
			return super.Log( this.Viewport.Session.Id, text, data );
	}
	
	Trigger( eventtype, data, event ) {
		if ( !eventtype )
			return;
		if ( !data )
			data = {};
		if ( this.Id )
			data.ElementId = this.Id;
		return super.Trigger( eventtype, data, event );
	}
	
	// override if needed
	Prepare() {}
}

module.exports = _ElementBase;
