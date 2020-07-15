window.App.Extend({
	
	config: {
		background: {
			dimensions: {
				width: 4320,
				height: 1080,
			},
			fadein: {
				interval: 20,
				step: 0.05,
			},
			scroll: {
				interval: 50,
				step: 1,
			},
		},
	},
	
	loops: {},
	
	Init: function( next ) {
		this.el = {
			background: document.getElementById( 'viewport' ),
		};
		
		next();
		
	},
	
	Run: function() {
		
		var that = this;
		
		// setup starting coordinates
		var bg_x = Math.floor( Math.random() * this.config.background.dimensions.width ); // fully random
		var bg_y = this.config.background.dimensions.height / 2;
		this.el.background.style[ 'background-position' ] = bg_x + 'px ' + bg_y + 'px';
		
		// dont waste cpu for nothing
		this.el.background.style.opacity = '1';
		return;
		
		// background fade-in
		that.el.background.style.opacity = 0; // just in case
		this.loops.fadein = setInterval( function() {
			var opacity = window.getComputedStyle( that.el.background ).getPropertyValue( 'opacity' );
			if ( opacity >= 1 ) {
				that.el.background.style.opacity = 1;
				clearInterval( that.loops.fadein );
				delete that.loops.fadein;
				return;
			}
			that.el.background.style.opacity = +opacity + that.config.background.fadein.step;
		}, this.config.background.fadein.interval );
		
		// scroll animation
		this.loops.scroll = setInterval( function() {
			if ( !window.App.Window.IsFocused )
				return;
			var position = window.getComputedStyle( that.el.background ).getPropertyValue( 'background-position' ).replace( /px/g, '' );
			var splitpos = position.indexOf( ' ' );
			var left = +position.substring( 0, splitpos );
			var top = +position.substring( splitpos + 1 );
			
			left -= that.config.background.scroll.step;
			if ( left < 0 )
				left += that.config.background.dimensions.width;
			
			that.el.background.style[ 'background-position' ] = left + 'px ' + top + 'px';
		}, this.config.background.scroll.interval );
		
	},
	
});
