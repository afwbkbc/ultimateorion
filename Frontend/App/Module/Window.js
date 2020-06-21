window.App.Extend({

	Callbacks: {},
	
	Init: function( next ) {
		
		// handle tab focus/blur
		this.IsFocused = document.hasFocus();

		var that = this;
		window.onfocus = function() {
		    that.IsFocused = true;
		    that.Trigger( 'focus' );
		    
		};
		window.onblur = function() {
		    that.IsFocused = false;
		    that.Trigger( 'blur' );
		};
		
		return next();
	},
	
	On: function( event, callback ) {
		if ( !this.Callbacks[ event ] )
			this.Callbacks[ event ] = [];
		this.Callbacks[ event ].push( callback );
	},
	
	Trigger: function( event ) {
		if ( this.Callbacks[ event ] )
			for ( var k in this.Callbacks[ event ] )
				this.Callbacks[ event ][ k ]();
	},
	
});
