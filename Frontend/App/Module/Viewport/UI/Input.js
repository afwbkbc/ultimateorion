window.App.Viewport.Extend({

	Prepare: function( ctx, element ) {
		element.blinkinterval = null;
		element.label = null;
	},
	
	OnAddChild: function( ctx, element, child ) {
		if ( child.data.element == 'UI/Label' ) {
			element.label = child;
			this.UpdateLabel( ctx, element );
		}
	},
	
	OnFocus: function( ctx, element ) {
		element.blinkcursorvisible = true;
		var that = this;
		this.UpdateLabel( ctx, element );
		if ( !element.blinkinterval ) {
			element.blinkinterval = setInterval( function() {
				element.blinkcursorvisible = !element.blinkcursorvisible;
				that.UpdateLabel( ctx, element );
			}, 500 );
		}
	},

	OnBlur: function( ctx, element ) {
		if ( element.blinkinterval ) {
			clearInterval( element.blinkinterval );
			element.blinkinterval = null;
		}
		element.blinkcursorvisible = false;
		this.UpdateLabel( ctx, element );
	},
	
	UpdateLabel: function( ctx, element ) {
		if ( element.label ) {
			element.label.data.attributes.Text = element.data.attributes.Value + ( element.blinkcursorvisible ? '▍' : ' ' );
			window.App.Viewport.Redraw();
		}
	},
	
});
