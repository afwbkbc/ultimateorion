class _Helper {
	
	// dummy method to be overridden if needed
	Init() {
		return new Promise( ( next, fail ) => {
			return next();
		});
	}
	
}

module.exports = _Helper;
