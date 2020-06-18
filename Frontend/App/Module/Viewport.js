var Elements = {
		
	'Test/TestBlock': {
		Render: function( ctx, element ) {
			var a = element.data.attributes;
			ctx.fillStyle = a.Color;
			ctx.fillRect( element.coords[ 1 ], element.coords[ 0 ], a.Width, a.Height );
		},
		GetBounds: function( ctx, element ) {
			var a = element.data.attributes;
			return [ 0, 0, a.Height, a.Width ];
		},
	},
		
	'UI/Label': {
		Render: function( ctx, element ) {
			ctx.font = "60px Verdana";
			ctx.textAlign = 'center';
			ctx.fillStyle = 'red';
			ctx.fillText("Hello World", 1000, 500);
		},
		GetBounds: function( ctx, element ) {
			return [ 50, 50 ];
		},
	},

};

window.App.Extend({

	RenderElement: function( element ) {
		Elements[ element.data.element ].Render( this.Ctx, element );
	},
	
	GetElementBounds: function( element ) {
		return Elements[ element.data.element ].GetBounds( this.Ctx, element );
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
		this.IsStateChanged = true;
		
		var fps_ms = 1000/desired_fps;
		this.RenderInterval = setInterval( function() {
			if ( window.App.Window.IsFocused && window.App.Connection.IsConnected && that.IsStateChanged ) {
				that.Render();
				if ( show_fps ) {
					that.Ctx.font = "30px Verdana";
					that.Ctx.textAlign = 'top left';
					that.Ctx.fillStyle = 'white';
					that.Ctx.fillText( 'FPS: ' + that.LastFrames, 100, 100 );
				
					that.Frames++;
				}
				that.IsStateChanged = false;
			}
		}, fps_ms );
		
		return next();
	},
	
	Clear: function() {
		for ( var k in this.Elements ) {
			delete this.Elements[ k ];
		}
		this.Elements = {};
		this.Ctx.clearRect( 0, 0, this.Canvas.width, this.Canvas.height );
	},
	
	/**
	 * area_bounds: [ top, left, bottom, right ]
	 */
	PositionElement: function( element, area_bounds ) {
		
		var a = element.data.attributes;
		var element_bounds = this.GetElementBounds( element );
		
		var source_point = [ 0, 0 ]; // [ top, left ]
		var dest_point = [ 0, 0 ]; // [ top, left ]
		
		switch( a.anchors[ 0 ][ 0 ] ) {
			case 'T': source_point[ 0 ] = area_bounds[ 0 ]; break;
			case 'C': source_point[ 0 ] = area_bounds[ 0 ] + ( area_bounds[ 2 ] - area_bounds[ 0 ] ) / 2; break;
			case 'B': source_point[ 0 ] = area_bounds[ 2 ]; break;
		};
		switch( a.anchors[ 0 ][ 1 ] ) {
			case 'L': source_point[ 1 ] = area_bounds[ 1 ]; break;
			case 'C': source_point[ 1 ] = area_bounds[ 1 ] + ( area_bounds[ 3 ] - area_bounds[ 1 ] ) / 2; break;
			case 'R': source_point[ 1 ] = area_bounds[ 3 ]; break;
		};
		switch( a.anchors[ 1 ][ 0 ] ) {
			case 'T': dest_point[ 0 ] = element_bounds[ 0 ]; break;
			case 'C': dest_point[ 0 ] = element_bounds[ 0 ] + ( element_bounds[ 2 ] - element_bounds[ 0 ] ) / 2; break;
			case 'B': dest_point[ 0 ] = element_bounds[ 2 ]; break;
		};
		switch( a.anchors[ 1 ][ 1 ] ) {
			case 'L': dest_point[ 1 ] = element_bounds[ 1 ]; break;
			case 'C': dest_point[ 1 ] = element_bounds[ 1 ] + ( element_bounds[ 3 ] - element_bounds[ 1 ] ) / 2; break;
			case 'R': dest_point[ 1 ] = element_bounds[ 3 ]; break;
		};
		
		element.coords = [ source_point[ 0 ] - dest_point[ 0 ] + a.offsets[ 0 ], source_point[ 1 ] - dest_point[ 1 ] + a.offsets[ 1 ] ];
	},
	
	AddElement: function( data ) {
		if ( this.Elements[ data.id ] ) {
			console.log( 'WARNING', 'duplicate element to be inserted', data );
			return;
		}
		if ( !Elements[ data.element ] ) {
			console.log( 'WARNING', 'unsuported element "' + data.element + '"' );
			return;
		}
		var element = {
			data: data,
		};
		this.PositionElement( element, [ 0, 0, this.Canvas.height, this.Canvas.width ] );
		this.Elements[ data.id ] = element;
		this.IsStateChanged = true;
	},
	
	RemoveElement: function( data ) {
		if ( !this.Elements[ data.id ] ) {
			console.log( 'WARNING', 'element to be removed does not exist', data );
			return;
		}
		delete this.Elements[ data.id ];
		this.IsStateChanged = true;
	},
	
	Render: function() {
		this.Ctx.clearRect( 0, 0, this.Canvas.width, this.Canvas.height );
		for ( var k in this.Elements )
			this.RenderElement( this.Elements[ k ] );
	},
	
});
