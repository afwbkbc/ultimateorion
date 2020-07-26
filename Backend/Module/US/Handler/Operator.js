class Operator extends require( './_Handler' ) {

	constructor() {
		super();
		
		this.TriggerOn = '+-=/*%';
		this.ContinueOn = this.TriggerOn;
		
	}
	
}

module.exports = Operator;
