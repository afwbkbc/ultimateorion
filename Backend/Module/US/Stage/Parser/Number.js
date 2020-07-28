class Number extends require( './_Handler' ) {

	constructor() {
		super();
		
		this.TriggerOn = '1234567890';
		this.ContinueOn = this.TriggerOn + '.';
		
	}
	
}

module.exports = Number;
