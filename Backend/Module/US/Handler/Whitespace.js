class Whitespace extends require( './_Handler' ) {

	constructor() {
		super();
		
		this.TriggerOn = ' \t\r\n';
		this.ContinueOn = this.TriggerOn;
		
	}
	
}

module.exports = Whitespace;
