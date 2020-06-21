window.App.Extend({

	GetRandomHash: function () {
		var length = 32;
	    var characters = '0123456789abcdef';
	    var randomString = '';
	    for ( var i = 0; i < length; i++ )
	        randomString += characters[ Math.floor( Math.random() * characters.length ) ];
	    return randomString;
	}
	
});
