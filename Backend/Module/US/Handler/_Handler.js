/*
 * IMPORTANT: handlers must not change their state after initialization, all state is to be kept in context which should be passed to every call
 */

class Handler {

	constructor() {
		
		this.Name = this.constructor.name;
		
		// override these if needed
		this.TriggerOn = null; // characters that will start this handler
		this.ContinueOn = null; // characters that are considered part of payload, should include TriggerOn in most cases. can also be function
		this.StopOn = null; // processing will continue until one of these is encountered. will continue after first character
		// if no ContinueOn and StopOn is provided - one char will be consumed and handler will exit
		
	}
	
	// override these if needed
	OnTriggered( character ) {} // should we trigger?
	OnProcess( context ) {} // fires after payload has been read
	
	// should we start on that character?
	Triggered( character ) {
		return this.TriggerOn.indexOf( character ) >= 0;
	}
	
	// initialize context
	Begin( context ) {
		context.Source = '';
		//console.log( 'HANDLER STARTED', this.Name );
	}
	
	// process context
	Process( context, character ) {
		
		let can_continue = ( this.ContinueOn !== null || this.StopOn !== null ); // no conditions -> can't continue
		
		let consume_needed = ( this.ContinueOn === null && this.StopOn === null ); // no conditions -> need to consume
		
		if ( this.ContinueOn ) {
			can_continue &= this.ContinueOn.indexOf( character ) >= 0;
		}
		if ( this.StopOn ) {
			can_continue &= ( this.StopOn.indexOf( character ) < 0 ) || ( context.Source.length === 0 ); // don't stop at first character if StopOn == TriggerOn
			consume_needed = true; // need to consume character we stopped with
		}
		
		if ( can_continue ) {
			context.Source += character;
			//console.log( 'PROCESS', this.Name, context.Source, character );
		}
		else {
			//console.log( 'READ DONE', this.Name, context.Source );
			if ( consume_needed ) {
				context.ConsumeNeeded = consume_needed;
				context.Source += character;
			}
			this.OnProcess( context );
		}
		return can_continue;
	}
	
	// cleanup context
	End( context ) {
		//console.log( 'HANDLER ENDED', this.Name );
	}
	
}

module.exports = Handler;
