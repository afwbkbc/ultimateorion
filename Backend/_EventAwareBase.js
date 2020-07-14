class EventAwareBase extends require( './_Base' ) {
	
	constructor( fname ) {
		super( fname );
		
		this.Events = {};
		this.Listeners = [];
		this.TriggerRepositories = [];
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
		setTimeout( () => {
			if ( !data )
				data = {};
			if ( this.Events[ eventtype ] ) {
				for ( var k in this.Events[ eventtype ] ) {
					if ( this.Events[ eventtype ][ k ].apply( this, [ data, event ? event : {} ] ) === false )
						break;
				}
			}
			var listeners = [ ...this.Listeners ];
			for ( var k in listeners )
				listeners[ k ].Trigger( eventtype, data, event );
			for ( var k in this.TriggerRepositories )
				this.TriggerRepositories[ k ].TriggerEvent( this, eventtype, data, event );
			
			if ( eventtype != '*' ) {
				// also trigger for '*' listeners
				data.Event = eventtype; // pass triggered event type
				this.Trigger( '*', data, event );
			}
		}, 0 ); // avoid running events in the middle of current code execution
	}
	
	CreateListener() {
		return new ( require( './Listener' ) )( this );
	}
	
	CreateListenerPool() {
		return new ( require( './ListenerPool' ) )( this );
	}
	
	AttachListener( listener ) {
		if ( this.Listeners.indexOf( listener ) < 0 ) {
			this.Listeners.push( listener );
			if ( this.OnListen )
				this.OnListen( listener );
			//console.log( '+LISTENER', this.Id, this.Listeners.length - 1 );
		}
	}
	
	DetachListener( listener ) {
		var pos = this.Listeners.indexOf( listener );
		if ( pos >= 0 ) {
			this.Listeners.splice( pos, 1 );
			//console.log( '-LISTENER', this.Id, pos );
		}
	}
	
}

module.exports = EventAwareBase;
