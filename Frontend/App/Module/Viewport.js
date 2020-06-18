window.App.Extend({

	RenderElement: function( element ) {
		//console.log( 'RENDER', element );
		
		this.Ctx.font = "60px Verdana";
		this.Ctx.textAlign = 'center';
		this.Ctx.fillStyle = 'red';
		this.Ctx.fillText("Hello World", 1000, 500);
	},
	
	Init: function( next ) {
		this.Canvas = document.getElementById( 'viewport' );
		this.Ctx = this.Canvas.getContext( '2d' );
		this.Elements = {};
		
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
		};
		fix_aspect_ratio();
		window.onresize = fix_aspect_ratio;

		// fps counter
		var show_fps = true;
		
		if ( show_fps ) {
			this.Frames = 0;
			this.LastFrames = 0;
			this.FpsInterval = setInterval( function() {
				that.LastFrames = that.Frames;
				that.Frames = 0;
			}, 1000 );
		}
		
		var desired_fps = 60;
		
		// main loop
		var fps_ms = 1000/desired_fps;
		this.RenderInterval = setInterval( function() {
			if ( window.App.Window.IsFocused && window.App.Connection.IsConnected ) {
				that.Render();
				if ( show_fps ) {
					that.Ctx.font = "30px Verdana";
					that.Ctx.textAlign = 'top left';
					that.Ctx.fillStyle = 'white';
					that.Ctx.fillText( 'FPS: ' + that.LastFrames, 100, 100 );
				
					that.Frames++;
				}
			}
		}, fps_ms );
		
		return next();
	},
	
	Clear: function() {
		this.Ctx.clearRect( 0, 0, this.Canvas.width, this.Canvas.height );
	},
	
	AddElement: function( data ) {
		if ( this.Elements[ data.id ] ) {
			console.log( 'WARNING', 'duplicate element to be inserted', data );
			return;
		}
		this.Elements[ data.id ] = data;
	},
	
	RemoveElement: function( data ) {
		if ( !this.Elements[ data.id ] ) {
			console.log( 'WARNING', 'element to be removed does not exist', data );
			return;
		}
		delete this.Elements[ data.id ];
	},
	
	Render: function() {
		this.Clear();
		for ( var k in this.Elements )
			this.RenderElement( this.Elements[ k ] );
	},
	
});
