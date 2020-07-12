class Logger extends require( '../_Module' ) {

	constructor() {
		super( module.filename );
		
		this.Outputs = {};
		
		this.MaxMessages = 128;
	}
	
	Init() {
		return new Promise( ( next, fail ) => {
			
			return next();
		});
	}
	
	AttachSession( session ) {
		if ( !this.Outputs[ session.Id ] ) {
			//console.log( '+LOGGER ' + session.Id );
			this.Outputs[ session.Id ] = {
				Target: session,
				Messages: [],
			};
		}
	}
	
	DetachSession( session ) {
		if ( this.Outputs[ session.Id ] ) {
			this.Log( session.Id, 'Detached from Logger', {
				[ 'Session.Id' ]: session.Id,
			});
			delete this.Outputs[ session.Id ];
			//console.log( '-LOGGER ' + session.Id );
		}
	}
	
	Log( target_id, text, data ) {
		var output = this.Outputs[ target_id ];
		if ( output ) {
			var message = {
				Text: text,
				Data: data ? data : {},
				Timestamp: new Date(),
			};
			output.Messages.push( message );
			if ( output.Messages.length > this.MaxMessages )
				output.Messages.splice( 0, 1 );
			if ( output.Target.Viewport )
				output.Target.Viewport.Trigger( 'debug_log', message );
		}
	}
	
	GetMessages( target_id ) {
		var output = this.Outputs[ target_id ];
		return output ? output.Messages : [];
	}
}

module.exports = Logger;
