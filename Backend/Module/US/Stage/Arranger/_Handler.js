/*
 * IMPORTANT: handlers must not change their state after initialization, all state is to be kept in context which should be passed to every call
 */

class Handler {

	constructor() {
		
		this.Name = this.constructor.name;
		
	}
	
	
}

module.exports = Handler;
