window.App.Extend({

	
	Init: function( next ) {
		this.Canvas = document.getElementById( 'viewport' );
		this.Ctx = this.Canvas.getContext( '2d' );
		
		
		// maintain aspect ratio
		var aspect_ratio = this.Canvas.width / this.Canvas.height;
		var that = this;
		var fix_aspect_ratio = function() {
			var current_aspect_ratio = window.innerWidth / window.innerHeight;
			if ( current_aspect_ratio > aspect_ratio ) {
				that.Canvas.style.height = window.innerHeight + 'px';
				that.Canvas.style.width = window.innerHeight * aspect_ratio + 'px';
			}
			else {
				that.Canvas.style.width = window.innerWidth + 'px';
				that.Canvas.style.height = window.innerWidth / aspect_ratio + 'px';
			}
			that.Canvas.style.left = ( window.innerWidth - that.Canvas.style.width.replace( 'px', '' ) ) / 2 + 'px';
			that.Canvas.style.top = ( window.innerHeight - that.Canvas.style.height.replace( 'px', '' ) ) / 2 + 'px';
			console.log( 'fix', aspect_ratio, current_aspect_ratio );
		};
		fix_aspect_ratio();
		window.onresize = fix_aspect_ratio;
		
		return next();
	},
	
	Clear: function() {
		this.Ctx.clearRect( 0, 0, this.Canvas.width, this.Canvas.height );
	},
	
	RenderElement( data ) {
		console.log( 'RENDER', data );
		
		this.Ctx.font = "60px Verdana";
		this.Ctx.textAlign = 'center';
		this.Ctx.fillStyle = 'red';
		this.Ctx.fillText("Hello World", 1000, 500);
	}
	
});
