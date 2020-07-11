window.App.Extend({

	config: {
		modules: [
			'Layout/Window',
			'Layout/Panel',
			'UI/Label',
			'Test/TestBlock',
			'UI/Button',
			'UI/Input',
			'UI/Form',
		],
	},
	
	SendEvent: function( data ) {
		window.App.Connection.Send({
			action: 'viewport_event',
			data: data ? data : {},
		});
	},
	
	FocusElement: function( element, omit_event ) {
		if ( element.focused )
			return; // already focused
		if ( !this.IsElementEnabled( element ) )
			return; // can't focus disabled element
		var data = element.data;
		if ( this.FocusedElement )
			this.BlurElement( this.FocusedElement );
		element.focused = true;
		this.FocusedElement = element;
		if ( !omit_event )
			this.SendEvent({
				element: element.data.id,
				event: 'focus',
			});
		if ( this[ data.element ] && this[ data.element ].OnFocus )
			this[ data.element ].OnFocus( this.Ctx, element );
	},
	
	BlurElement: function( element, omit_event ) {
		if ( !element.focused )
			return;
		var data = element.data;
		element.focused = false;
		if ( this[ data.element ] && this[ data.element ].OnBlur )
			this[ data.element ].OnBlur( this.Ctx, element );
		if ( this.FocusedElement.data.id == element.data.id )
			this.FocusedElement = null;
		if ( !omit_event )
			this.SendEvent({
				element: element.data.id,
				event: 'blur',
			});
	},
	
	HoverElement: function( element/*, omit_event*/ ) {
		if ( element.hovered )
			return; // already hovered
		if ( !this.IsElementEnabled( element ) )
			return; // can't hover on disabled element
		var data = element.data;
		if ( this.HoveredElement )
			this.UnhoverElement( this.HoveredElement );
		element.hovered = true;
		this.HoveredElement = element;
		/*if ( !omit_event )
			this.SendEvent({
				element: element.data.id,
				event: 'focus',
			});*/
		if ( this[ data.element ] && this[ data.element ].OnHover )
			this[ data.element ].OnHover( this.Ctx, element );
	},
	
	UnhoverElement: function( element/*, omit_event*/ ) {
		if ( !element.hovered )
			return;
		var data = element.data;
		if ( this[ data.element ] && this[ data.element ].OnUnhover )
			this[ data.element ].OnUnhover( this.Ctx, element );
		element.hovered = false;
		if ( this.HoveredElement.data.id == element.data.id )
			this.HoveredElement = null;
		/*if ( !omit_event )
			this.SendEvent({
				element: element.data.id,
				event: 'blur',
			});*/
	},
	
	IsElementEnabled: function( element ) {
		if ( !element.enabled )
			return false;
		if ( element.parent )
			return this.IsElementEnabled( element.parent );
		return true;
	},
	
	EnableElement: function( element, omit_event ) {
		if ( !element.enabled ) {
			element.enabled = true;
			if ( !omit_event ) {
				console.log( 'NOT IMPLEMENTED', 'EnableElement event' );
			}
			this.HandleMouseMove();
		}
	},
	
	DisableElement: function( element, omit_event ) {
		if ( element.enabled ) {
			if ( element.focused )
				this.BlurElement( element, omit_event );
			element.enabled = false;
			// if child was focused - blur it
			if ( this.FocusedElement && !this.IsElementEnabled( this.FocusedElement ) )
				this.BlurElement( this.FocusedElement );
			if ( !omit_event ) {
				console.log( 'NOT IMPLEMENTED', 'DisableElement event' );
			}
			this.HandleMouseMove();
		}
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
	
	TranslateCoords: function( e ) { // from event coords to canvas coords
		return [ e.layerX * this.XCoordMod, e.layerY * this.YCoordMod ];
	},
	
	HandleMouseMove: function( e ) {
		if ( e )
			this.LastMouseMoveEvent = e;
		else
			e = this.LastMouseMoveEvent;
		if ( !e )
			return;
		var clickzone = this.GetClickzone( this.TranslateCoords( e ) );
		if ( clickzone ) {
			this.Canvas.style.cursor = 'pointer';
			this.HoverElement( clickzone.element );
		}
		else {
			if ( this.HoveredElement )
				this.UnhoverElement( this.HoveredElement );
			this.Canvas.style.cursor = 'default';
		}
	},
	
	Init: function( next ) {
		this.Canvas = document.getElementById( 'viewport' );
		this.Ctx = this.Canvas.getContext( '2d' );
		this.Elements = {};
		this.Layers = [];
		this.Clickzones = {};
		this.TabOrder = [];
		this.NextClickzoneId = 0;
		this.FocusedElement = null;
		this.HoveredElement = null;
		this.DefaultButtons = []; // stack
		this.Windows = []; // stack
		
		this.FpsLimit = 60; // TODO: per-user settings
		this.TrackStats = [ 'NetIn', 'NetOut', 'Frames', 'Redraws', 'RenderCalls' ];
		
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
			this.TrackData = {};
			for ( var k in this.TrackStats ) {
				var v = this.TrackStats[ k ];
				this.TrackData[ v ] = [ 0, 0 ];
			}
		}
		
		this.IsStateChanged = true;
		
		// mouse events
		
		this.Canvas.onmousedown = function( e ) {
			var clickzone = that.GetClickzone( that.TranslateCoords( e ) );
			if ( that.FocusedElement && ( !clickzone || ( that.FocusedElement.data.id != clickzone.element.data.id ) ) )
				that.BlurElement( that.FocusedElement );
			if ( clickzone ) {
				if ( clickzone.OnClick )
					clickzone.OnClick( that.Ctx, clickzone.element );
				if ( clickzone.OnFocus )
					that.FocusElement( clickzone.element );
				else if ( that.FocusedElement )
					that.BlurElement( that.FocusedElement );
			}
			return false;
		}
		
		this.Canvas.onmousemove = function( e ) {
			that.HandleMouseMove( e );
			return false;
		}
		
		window.onkeydown = function( e ) {
			var el = that.FocusedElement;
			if ( el && el.behavior.typeable && that.IsElementEnabled( el ) ) {
				var defs = that[ el.data.element ];
				if ( defs.OnKeyPress )
					if ( defs.OnKeyPress( that.Ctx, el, e ) === false )
						return false;
			}
			
			// special cases
			if ( e.key == 'Tab' ) {
				if ( that.TabOrder.length > 0 ) {
					var tabindex;
					if ( that.TabOrder.length == 1 )
						tabindex = 0;
					else if ( el ) {
						tabindex = that.TabOrder.indexOf( el.data.id );
						if ( tabindex < 0 )
							tabindex = 0;
						tabindex++;
						if ( tabindex >= that.TabOrder.length )
							tabindex = 0;
					}
					else
						tabindex = 0;
					
					var elid = that.TabOrder[ tabindex ];
					that.FocusElement( that.Elements[ elid ] );
				}
				return false;
			}
			else if ( e.key == 'Escape' ) {
				if ( that.Windows.length > 0 ) {
					var el = that.Windows[ that.Windows.length - 1 ];
					if ( el.is_closeable ) { // only closeable windows can be closed
						if ( !el.closing ) { // to prevent event spam
							el.closing = true;
							that.SendEvent({
								element: el.data.id,
								event: 'close',
							});
						}
					}
				}
				return false;
			}
			else if ( e.key == 'Enter' ) {
				if ( that.DefaultButtons.length ) {
					var el = that.Elements[ that.DefaultButtons[ that.DefaultButtons.length - 1 ] ];
					if ( el && that[ el.data.element ].OnClick )
						that[ el.data.element ].OnClick( that.Ctx, el );
					return false;
				}
			}
			
			return true;
		}
		
		return next();
	},
	
	GetClickzone: function( coords ) {
		for ( var k = this.NextClickzoneId ; k >= 0 ; k-- ) {
			var clickzone = this.Clickzones[ k ];
			if ( clickzone ) {
				var a = clickzone.area;
				if ( coords[ 0 ] >= a[ 0 ] && coords[ 1 ] >= a[ 1 ] && coords[ 0 ] <= a[ 2 ] && coords[ 1 ] <= a[ 3 ] ) {
					//console.log( 'CLICKZONE', clickzone.area );
					if ( this.IsElementEnabled( clickzone.element ) )
						return clickzone;
				}
			}
		}
		return null;
	},
	
	Run: function() {
		var that = this;
		
		if ( this.TrackStats ) {
			this.FpsInterval = setInterval( function() {
				for ( var k in that.TrackStats ) {
					var v = that.TrackStats[ k ];
					that.TrackData[ v ][ 1 ] = that.TrackData[ v ][ 0 ];
					that.TrackData[ v ][ 0 ] = 0;
				}
				if ( !that.IsStateChanged ) {
					// redraw just to display stats
					that.TrackData.Redraws[ 0 ]--; // this is "fake" redraw so don't count it
					that.Redraw();
				}
			}, 1000 );
		}
		
		if ( that.TrackStats ) {
			var format_bytes = function( bytes ) {
				if ( bytes < 1024 )
					return bytes + 'B';
				if ( bytes < 1024 * 1024 )
					return Math.round( bytes / 1024 ) + 'KB';
				return Math.round( bytes / 1024 / 1024 ) + 'MB';
			}
		}
		
		// main loop
		var fps_ms = Math.floor( 1000 / this.FpsLimit );
		this.RenderLoop = setInterval( function() {
			if ( window.App.Window.IsFocused && window.App.Connection.IsConnected && that.IsStateChanged ) {
				that.Render();
				if ( that.TrackStats ) {
					
					that.Ctx.font = "30px Verdana";
					that.Ctx.textAlign = 'top left';
					that.Ctx.fillStyle = 'rgba( 0, 155, 128, 0.5 )';
					
					// network
					that.Ctx.fillText( 'Network: ' + format_bytes( that.TrackData.NetIn[ 1 ] + that.TrackData.NetOut[ 1 ] ) + '/s ( in: ' + format_bytes( that.TrackData.NetIn[ 1 ] ) + '/s ; out: ' + format_bytes( that.TrackData.NetOut[ 1 ] ) + '/s )', 40, 0 );
					
					// renderer
					that.Ctx.fillText( 'FPS: ' + that.TrackData.Frames[ 1 ] + ' / ~' + that.FpsLimit, 1000, 0 );
					that.Ctx.fillText( 'Redraws/s: ' + that.TrackData.Redraws[ 1 ], 1300, 0 );
					that.Ctx.fillText( 'Rendercalls/s: ' + that.TrackData.RenderCalls[ 1 ], 1600, 0 );
				
				}
				that.IsStateChanged = false;
				if ( that.TrackStats )
					that.TrackData.Redraws[ 0 ]++;
			}
			if ( that.TrackStats )
				that.TrackData.Frames[ 0 ]++;
		}, fps_ms );
	},
	
	Clear: function() {
		for ( var k in this.Elements )
			this.RemoveElement( this.Elements[ k ].data );
		this.Elements = {};
		this.Layers = [];
		this.FocusedElement = null;
		this.Ctx.clearRect( 0, 0, this.Canvas.width, this.Canvas.height );
	},
	
	Redraw: function() {
		this.IsStateChanged = true;
	},
	
	PositionElement: function( element, is_recursive ) {
		var bounds;

		if ( element.parent ) {
			bounds = this.GetElementBounds( element.parent );
			bounds[ 0 ] += element.parent.coords[ 0 ];
			bounds[ 1 ] += element.parent.coords[ 1 ];
			bounds[ 2 ] += element.parent.coords[ 0 ];
			bounds[ 3 ] += element.parent.coords[ 1 ];
		}
		else
			bounds = [ 0, 0, this.Canvas.width, this.Canvas.height ];
		
		var a = element.data.attributes;
		var element_bounds = this.GetElementBounds( element );
		
		var source_point = [ 0, 0 ]; // [ left, top ]
		var dest_point = [ 0, 0 ]; // [ left, top ]
		
		switch( a.anchors[ 0 ][ 0 ] ) {
			case 'L': source_point[ 0 ] = bounds[ 0 ]; break;
			case 'C': source_point[ 0 ] = bounds[ 0 ] + ( bounds[ 2 ] - bounds[ 0 ] ) / 2; break;
			case 'R': source_point[ 0 ] = bounds[ 2 ]; break;
		};
		switch( a.anchors[ 0 ][ 1 ] ) {
			case 'T': source_point[ 1 ] = bounds[ 1 ]; break;
			case 'C': source_point[ 1 ] = bounds[ 1 ] + ( bounds[ 3 ] - bounds[ 1 ] ) / 2; break;
			case 'B': source_point[ 1 ] = bounds[ 3 ]; break;
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
		
		// update clickzone if needed
		if ( element.clickzone ) {
			this.RemoveClickzone( element );
			this.AddClickzoneIfNeeded( element );
		}
		
		if ( is_recursive ) {
			for ( var k in element.children )
				this.PositionElement( element.children[ k ], true );
		}
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
			layer: data.attributes.ZIndex ? data.attributes.ZIndex : 0,
		};
		
		if ( element.data.parent_id ) {
			var parent = this.Elements[ element.data.parent_id ];
			if ( parent ) {
				element.layer += parent.layer;
				element.parent = parent;
				if ( !parent.children )
					parent.children = {};
				parent.children[ element.data.id ] = element;
				if ( this[ parent.data.element ] && this[ parent.data.element ].OnAddChild )
					this[ parent.data.element ].OnAddChild( this.Ctx, parent, element );
			}
			else
				console.log( 'WARNING', 'parent element not found', element );
		}
		this.PositionElement( element );
		if ( data.attributes.DefaultButton )
			this.DefaultButtons.push( element.data.id );
		if ( this[ data.element ] ) {
			element.behavior = this[ data.element ].behavior ? this[ data.element ].behavior : {};
			this.AddClickzoneIfNeeded( element );
			this.AddToTabOrderIfNeeded( element );
			if ( data.element == 'UI/Form' ) {
				if ( this[ data.element ].exported_methods ) {
					for ( var k in this[ data.element ].exported_methods ) {
						var method_name = this[ data.element ].exported_methods;
						element[ method_name ] = this[ data.element ][ method_name ];
					}
				}
			}
			if ( this[ data.element ].Prepare )
				this[ data.element ].Prepare( this.Ctx, element );
		}
		this.Elements[ data.id ] = element;
		while ( this.Layers.length <= element.layer )
			this.Layers.push( {} );
		this.Layers[ element.layer ][ data.id ] = element;
		element.enabled = element.data.enabled;
		if ( !element.enabled ) {
			element.focused = false;
		}
		element.hovered = false;
		if ( element.data.focused )
			this.FocusElement( element, true );
		if ( data.element == 'Layout/Window' )
			this.Windows.push( element );
		this.Redraw();
		if ( this.TrackStats )
			this.TrackData.RenderCalls[ 0 ]++;
		this.HandleMouseMove();
	},
	
	RemoveElement: function( data ) {
		var element = this.Elements[ data.id ];
		if ( !element ) {
			console.log( 'WARNING', 'element to be removed does not exist', data );
			return;
		}
		data = element.data;
		if ( data.element == 'Layout/Window' ) {
			for ( var i = this.Windows.length - 1 ; i >= 0 ; i-- ) {
				if ( this.Windows[ i ].data.id == data.id ) {
					this.Windows.splice( i, 1 );
					break;
				}
			}
		}
		if ( element.clickzone )
			this.RemoveClickzone( element );
		var tabindex = this.TabOrder.indexOf( element.data.id );
		if ( tabindex >= 0 )
			this.TabOrder.splice( tabindex, 1 );
		var defaultindex = this.DefaultButtons.indexOf( element.data.id );
		if ( defaultindex >= 0 )
			this.DefaultButtons.splice( defaultindex, 1 );
		if ( this.FocusedElement == element.data.id )
			this.FocusedElement = null;
		if ( this.parent )
			delete this.parent.children[ data.id ];
		if ( this.children )
			for ( var k in this.children )
				delete this.children[ k ].parent;
		delete this.Elements[ data.id ];
		delete this.Layers[ element.layer ][ data.id ];
		this.Redraw();
		if ( this.TrackStats )
			this.TrackData.RenderCalls[ 0 ]++;
		this.HandleMouseMove();
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
				case 'attributes':
					var is_reposition_needed = false;
					var a = el.data.attributes;
					for ( var k in value ) {
						a[ k ] = value[ k ];
						if ( [ 'Width', 'Height' ].indexOf( k ) >= 0 )
							is_reposition_needed = true;
					}
					if ( is_reposition_needed )
						this.PositionElement( el, true );
					break;
				case 'enabled':
					if ( value )
						this.EnableElement( el, true );
					else
						this.DisableElement( el, true );
					break;
				case 'focused':
					if ( value )
						this.FocusElement( el, true );
					else
						this.BlurElement( el, true );
					break;
				default:
					console.log( 'WARNING', 'unsupported element change "' + change + '"' );
			}
		}
		if ( this.TrackStats )
			this.TrackData.RenderCalls[ 0 ]++;
	},
	
	Render: function() {
		this.Ctx.clearRect( 0, 0, this.Canvas.width, this.Canvas.height );
		for ( var l in this.Layers )
			for ( var k in this.Layers[ l ] )
				this.RenderElement( this.Layers[ l ][ k ] );
	},
	
	AddClickzoneIfNeeded: function( element ) {
		if ( !element.behavior.clickable )
			return;
		var clickzone_id = ++this.NextClickzoneId;
		var defs = this[ element.data.element ];
		var b = this.GetElementBounds( element );
		var c = element.coords;
		element.clickzone = {
			id: clickzone_id,
			area: [ c[ 0 ] + b[ 0 ], c[ 1 ] + b[ 1 ], c[ 0 ] + b[ 2 ], c[ 1 ] + b[ 3 ] ],
			element: element,
		};
		if ( element.behavior.clickable )
			element.clickzone.OnClick = this[ element.data.element].OnClick;
		if ( element.behavior.focusable )
			element.clickzone.OnFocus = this[ element.data.element].OnFocus;
		this.Clickzones[ clickzone_id ] = element.clickzone;
	},
	
	AddToTabOrderIfNeeded: function( element ) {
		if ( !element.behavior.focusable )
			return;
		this.TabOrder.push( element.data.id );
	},
	
	RemoveClickzone: function( element ) {
		delete this.Clickzones[ element.clickzone.id ];
		delete element.clickzone;
	},
	
	GetClosest: function( element, target_element_type ) {
		var parent = element.parent;
		while ( parent ) {
			if ( parent.data.element == target_element_type ) {
				return parent;
				break;
			}
			parent = parent.parent;
		}
		return null;
	}
	
});
