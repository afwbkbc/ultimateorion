window.App.Extend({
	
	config: {
		icon: {
			opacity: 0.5,
		}
	},
	
	Init: function( next ) {
		this.el = {
			icon: document.getElementById( 'loader-icon' ),
		};
		
		this.Start(); // start loader early to show fancy stuff until remaining modules load
		
		next();
	},
	
	Start: function() {
		
		if ( this.running )
			return;
		
		// show loader icon
		this.el.icon.style.opacity = this.config.icon.opacity;
		
		this.running = true;
	},
	
	Stop: function() {
		
		if ( !this.running )
			return;
		
		this.el.icon.style.opacity = 0;
		
		this.running = false;
	}
	
});
