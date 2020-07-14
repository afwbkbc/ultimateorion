class ListenerPool extends require( './_EventAwareBase' ) {

	constructor( repository ) {
		super( module.filename );
		
		//console.log( 'LISTENERS INIT' );
		this.ChildListeners = {};
	}
	
	Dispatch( listenable, data, event ) {
		var eventtype = data.Event;
		data.Source = listenable;
		delete data.Event;
		this.Trigger( eventtype, data, event );
	}
	
	Add( listenable ) {
		if ( !this.ChildListeners[ listenable.Id ] ) {
			//console.log( 'LISTENER ADD', listenable.Id );
			var listener = listenable.CreateListener();
			listener.On( '*', ( data, event ) => {
				this.Dispatch( listenable, data, event );
			})
			this.ChildListeners[ listenable.Id ] = listener;
			listener.Attach();
		}
	}
	
	Remove( listenable ) {
		if ( this.ChildListeners[ listenable.Id ] ) {
			//console.log( 'LISTENER REMOVE', listenable.Id );
			this.ChildListeners[ listenable.Id ].Detach();
			delete this.ChildListeners[ listenable.Id ];
		}
	}
	
	Destroy() {
		//console.log( 'LISTENERS DESTROY' );
		for ( var k in this.ChildListeners )
			this.ChildListeners[ k ].Detach();
		this.ChildListeners = {};
	}
}

module.exports = ListenerPool;
