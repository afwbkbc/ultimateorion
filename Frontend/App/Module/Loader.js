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
				interval: 30,
				step: 1,
			},
		},
		icon: {
			opacity: 0.5,
		}
	},
	
	Init: function( next ) {
		this.el = {
			background: document.getElementById( 'loader' ),
			icon: document.getElementById( 'loader-icon' ),
		};
		this.loops = {};
		
		this.Start(); // start loader early to show fancy stuff until remaining modules load
		
		next();
	},
	
	Start: function() {
		
		if ( this.running )
			return;
		
		var that = this;
		
		// setup starting coordinates
		var bg_x = Math.floor( Math.random() * this.config.background.dimensions.width ); // fully random
		var bg_y = this.config.background.dimensions.height / 2;
		this.el.background.style[ 'background-position' ] = bg_x + 'px ' + bg_y + 'px';
		
		// background fade-in
		that.el.background.style.opacity = 0; // just in case
		this.loops.fadein = setInterval( function() {
			var opacity = window.getComputedStyle( that.el.background ).getPropertyValue( 'opacity' );
			if ( opacity >= 1 ) {
				that.el.background.style.opacity = 1;
				clearInterval( that.loops.fadein );
				delete that.loops.fadein;
				// show loader icon
				that.el.icon.style.opacity = that.config.icon.opacity;
				return;
			}
			that.el.background.style.opacity = +opacity + that.config.background.fadein.step;
		}, this.config.background.fadein.interval );
		
		// scroll animation
		this.loops.scroll = setInterval( function() {
			var position = window.getComputedStyle( that.el.background ).getPropertyValue( 'background-position' ).replace( /px/g, '' );
			var splitpos = position.indexOf( ' ' );
			var left = +position.substring( 0, splitpos );
			var top = +position.substring( splitpos + 1 );
			
			left -= that.config.background.scroll.step;
			if ( left < 0 )
				left += that.config.background.dimensions.width;
			
			that.el.background.style[ 'background-position' ] = left + 'px ' + top + 'px';
		}, this.config.background.scroll.interval );
		
		this.running = true;
	},
	
	Stop: function() {
		
		if ( !this.running )
			return;
		
		for ( var k in this.loops )
			clearInterval( this.loops[ k ] );
		this.loops = {};
		
		that.el.background.style.opacity = 0;
		that.el.icon.style.opacity = 0;
		
		this.running = false;
	}
	
});
