class EventAwareBase extends require( './_Base' ) {
	
	constructor( fname ) {
		super( fname );
		
		this.Events = {};
	}

	On( eventtype, callback ) {
		if ( !this.Events[ eventtype ] )
			this.Events[ eventtype ] = [];
		this.Events[ eventtype ].push( callback );
		return this;
	}
	
	Off( eventtype, callback ) {
		if ( this.Events[ eventtype ] ) {
			var pos = this.Events[ eventtype ].indexOf( callback );
			if ( pos >= 0 )
				this.Events[ eventtype ].splice( pos, 1 );
		}
		return this;
	}
	
	Trigger( eventtype, data, event ) {
		if ( this.Events[ eventtype ] )
			for ( var k in this.Events[ eventtype ] ) {
				if ( this.Events[ eventtype ][ k ].apply( this, [ data ? data : {}, event ? event : {} ] ) === false )
					break;
			}
		for ( var k in this.Listeners )
			this.Listeners[ k ].Trigger( eventtype, data, event );
	}
	
	CreateListener() {
		return new ( require( './Listener' ) )( this );
	}
	
	AttachListener( listener ) {
		if ( this.Listeners.indexOf( listener ) < 0 )
			this.Listeners.push( listener );
	}
	
	DetachListener( listener ) {
		var pos = this.Listeners.indexOf( listener );
		if ( pos >= 0 )
			this.Listeners.splice( pos, 1 );
	}
	
}

module.exports = EventAwareBase;
