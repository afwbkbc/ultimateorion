window.App.Extend({

	config: {
		modules: [
			'Layout/Panel',
			'UI/Label',
			'Test/TestBlock',
			'UI/Button',
		],
	},
			
	RenderElement: function( element ) {
		if ( this[ element.data.element ] && this[ element.data.element ].Render )
			this[ element.data.element ].Render( this.Ctx, element );
	},
	
	GetElementBounds: function( element ) {
		if ( this[ element.data.element ] && this[ element.data.element ].GetBounds )
			return this[ element.data.element ].GetBounds( this.Ctx, element );
		else if ( this.IsBlockElement( element.data ) ) {
			var a = element.data.attributes;
			return [ 0, 0, a.Width, a.Height ];
		}
		else {
			console.log( 'WARNING', 'no bounds for element', element );
			return [ 0, 0, 0, 0 ];
		}
	},
	
	Init: function( next ) {
		this.Canvas = document.getElementById( 'viewport' );
		this.Ctx = this.Canvas.getContext( '2d' );
		this.Elements = {};
		this.Clickzones = {};
		this.NextClickzoneId = 0;
		
		this.FpsLimit = 60;
		this.TrackStats = true;
		
		var that = this;
		
		// maintain aspect ratio
		var aspect_ratio = this.Canvas.width / this.Canvas.height;
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

		// inner->outer coord transform modifiers
		var recalculate_io_transform_modifiers = function() {
			that.XCoordMod = that.Canvas.width / that.Canvas.style.width.replace( 'px', '' );
			that.YCoordMod = that.Canvas.height / that.Canvas.style.height.replace( 'px', '' );
		}
		
		var onresize = function() {
			fix_aspect_ratio();
			recalculate_io_transform_modifiers();
		}
		window.onresize = onresize;
		onresize();

		if ( this.TrackStats ) {
			this.Frames = 0;
			this.LastFrames = 0;
			this.Redraws = 0;
			this.LastRedraws = 0;
			this.RenderCalls = 0;
			this.LastRenderCalls = 0;
		}
		
		this.IsStateChanged = true;
		
		// mouse events
		this.Canvas.onmousedown = function( e ) {
			var c = [ e.layerX * that.XCoordMod, e.layerY * that.YCoordMod ];
			// TODO: optimize
			for ( var k = that.NextClickzoneId ; k >= 0 ; k-- ) {
				var clickzone = that.Clickzones[ k ];
				if ( clickzone && clickzone.onclick ) {
					var a = clickzone.area;
					if ( c[ 0 ] >= a[ 0 ] && c[ 1 ] >= a[ 1 ] && c[ 0 ] <= a[ 2 ] && c[ 1 ] <= a[ 3 ] ) {
						clickzone.onclick( that.Ctx, clickzone.element );
						break;
					}
				}
			}
			return false;
		}
		
		return next();
	},
	
	Run: function() {
		var that = this;
		
		if ( this.TrackStats ) {
			this.FpsInterval = setInterval( function() {
				that.LastFrames = that.Frames;
				that.Frames = 0;
				that.LastRedraws = that.Redraws;
				that.Redraws = 0;
				that.LastRenderCalls = that.RenderCalls;
				that.RenderCalls = 0;
			}, 1000 );
		}
		
		// main loop
		var fps_ms = Math.floor( 1000 / this.FpsLimit );
		this.RenderLoop = setInterval( function() {
			if ( window.App.Window.IsFocused && window.App.Connection.IsConnected && that.IsStateChanged ) {
				that.Render();
				if ( that.TrackStats && that.LastFrames > 0 ) {
					that.Ctx.font = "30px Verdana";
					that.Ctx.textAlign = 'top left';
					that.Ctx.fillStyle = 'white';
					that.Ctx.fillText( 'FPS: ' + that.LastFrames + ' / ~' + that.FpsLimit, 100, 100 );
					that.Ctx.fillText( 'Redraws/s: ' + that.LastRedraws, 100, 130 );
					that.Ctx.fillText( 'Rendercalls/s: ' + that.LastRenderCalls, 100, 160 );
				
				}
				that.IsStateChanged = false;
				that.Redraws++;
			}
			that.Frames++;
		}, fps_ms );
	},
	
	Clear: function() {
		for ( var k in this.Elements )
			this.RemoveElement( this.Elements[ k ].data );
		this.Elements = {};
		this.Ctx.clearRect( 0, 0, this.Canvas.width, this.Canvas.height );
	},
	
	Redraw: function() {
		this.IsStateChanged = true;
	},
	
	/**
	 * area_bounds: [ left, top, right, bottom ]
	 */
	PositionElement: function( element, area_bounds ) {
		
		var a = element.data.attributes;
		var element_bounds = this.GetElementBounds( element );
		
		var source_point = [ 0, 0 ]; // [ left, top ]
		var dest_point = [ 0, 0 ]; // [ left, top ]
		
		switch( a.anchors[ 0 ][ 0 ] ) {
			case 'L': source_point[ 0 ] = area_bounds[ 0 ]; break;
			case 'C': source_point[ 0 ] = area_bounds[ 0 ] + ( area_bounds[ 2 ] - area_bounds[ 0 ] ) / 2; break;
			case 'R': source_point[ 0 ] = area_bounds[ 2 ]; break;
		};
		switch( a.anchors[ 0 ][ 1 ] ) {
			case 'T': source_point[ 1 ] = area_bounds[ 1 ]; break;
			case 'C': source_point[ 1 ] = area_bounds[ 1 ] + ( area_bounds[ 3 ] - area_bounds[ 1 ] ) / 2; break;
			case 'B': source_point[ 1 ] = area_bounds[ 3 ]; break;
		};
		switch( a.anchors[ 1 ][ 0 ] ) {
			case 'L': dest_point[ 0 ] = element_bounds[ 0 ]; break;
			case 'C': dest_point[ 0 ] = element_bounds[ 0 ] + ( element_bounds[ 2 ] - element_bounds[ 0 ] ) / 2; break;
			case 'R': dest_point[ 0 ] = element_bounds[ 2 ]; break;
		};
		switch( a.anchors[ 1 ][ 1 ] ) {
			case 'T': dest_point[ 1 ] = element_bounds[ 1 ]; break;
			case 'C': dest_point[ 1 ] = element_bounds[ 1 ] + ( element_bounds[ 3 ] - element_bounds[ 1 ] ) / 2; break;
			case 'B': dest_point[ 1 ] = element_bounds[ 3 ]; break;
		};
		
		element.coords = [ source_point[ 0 ] - dest_point[ 0 ] + a.offsets[ 0 ], source_point[ 1 ] - dest_point[ 1 ] + a.offsets[ 1 ] ];
	},
	
	IsBlockElement: function( data ) {
		return (
			( typeof( data.attributes.Width ) !== 'undefined' ) &&
			( typeof( data.attributes.Height ) !== 'undefined' )
		);
	},
	
	AddElement: function( data ) {
		if ( this.Elements[ data.id ] ) {
			console.log( 'WARNING', 'duplicate element to be inserted', data );
			return;
		}
		if ( ( !this[ data.element ] || !this[ data.element ].GetBounds ) && !this.IsBlockElement( data ) ) {
			console.log( 'WARNING', 'unsupported non-block element "' + data.element + '"' );
			return;
		}
		
		var element = {
			data: data,
		};
		var bounds = [ 0, 0, this.Canvas.width, this.Canvas.height ];
		if ( element.data.parent_id ) {
			var parent = this.Elements[ element.data.parent_id ];
			if ( parent ) {
				bounds = this.GetElementBounds( parent );
				bounds[ 0 ] += parent.coords[ 0 ];
				bounds[ 1 ] += parent.coords[ 1 ];
				bounds[ 2 ] += parent.coords[ 0 ];
				bounds[ 3 ] += parent.coords[ 1 ];
			}
			else
				console.log( 'WARNING', 'parent element not found', element );
		}
		this.PositionElement( element, bounds );
		if ( this[ data.element ] ) {
			if ( this[ data.element ].OnClick )
				this.AddClickzone( element );
		}
		this.Elements[ data.id ] = element;
		this.Redraw();
		if ( this.TrackStats )
			this.RenderCalls++;
	},
	
	RemoveElement: function( data ) {
		var element = this.Elements[ data.id ];
		if ( !element ) {
			console.log( 'WARNING', 'element to be removed does not exist', data );
			return;
		}
		if ( element.clickzone )
			this.RemoveClickzone( element );
		delete this.Elements[ data.id ];
		this.Redraw();
		if ( this.TrackStats )
			this.RenderCalls++;
	},
	
	ChangeElement: function( data ) {
		var el = this.Elements[ data.id ];
		if ( !el ) {
			console.log( 'WARNING', 'element to be changed does not exist', data );
			return;
		}
		for ( var change in data.changes ) {
			var value = data.changes[ change ];
			switch ( change ) {
				case 'offsets':
					var offsets = el.data.attributes.offsets;
					var diff = [ offsets[ 0 ] - value[ 0 ], offsets[ 1 ] - value[ 1 ] ];
					el.data.attributes.offsets = value;
					el.coords[ 0 ] -= diff[ 0 ];
					el.coords[ 1 ] -= diff[ 1 ];
					this.Redraw();
					break;
				default:
					console.log( 'WARNING', 'unsupported element change "' + change + '"' );
			}
		}
		if ( this.TrackStats )
			this.RenderCalls++;
	},
	
	Render: function() {
		this.Ctx.clearRect( 0, 0, this.Canvas.width, this.Canvas.height );
		for ( var k in this.Elements )
			this.RenderElement( this.Elements[ k ] );
	},
	
	AddClickzone: function( element ) {
		var clickzone_id = ++this.NextClickzoneId;
		var defs = this[ element.data.element ];
		var b = this.GetElementBounds( element );
		var c = element.coords;
		element.clickzone = {
			id: clickzone_id,
			area: [ c[ 0 ] + b[ 0 ], c[ 1 ] + b[ 1 ], c[ 0 ] + b[ 2 ], c[ 1 ] + b[ 3 ] ],
			element: element,
			onclick: defs.OnClick ? defs.OnClick : null,
		};
		this.Clickzones[ clickzone_id ] = element.clickzone;
	},
	
	RemoveClickzone: function( element ) {
		delete this.Clickzones[ element.clickzone.id ];
		delete element.clickzone;
	},
	
});
