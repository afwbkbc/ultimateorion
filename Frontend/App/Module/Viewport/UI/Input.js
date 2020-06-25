window.App.Viewport.Extend({

	behavior: {
		clickable: true,
		focusable: true,
		typeable: true,
	},
	
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
			}, 300 );
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
	
	OnKeyPress: function( ctx, element, e ) {
		var a = element.data.attributes;
		if ( e.key == 'Backspace' ) {
			if ( !a.Value.length )
				return false;
			a.Value = a.Value.substring( 0, a.Value.length - 1 );
		}
		else if ( e.key.length == 1 ) {// character
			if ( a.Value.length >= a.MaxLength )
				return false;
			a.Value += e.key;
		}
		else
			return false;
		this.UpdateLabel( ctx, element );
		window.App.Viewport.SendEvent({
			element: element.data.id,
			event: 'input',
			value: a.Value,
		});
		return true;
	},
	
	UpdateLabel: function( ctx, element ) {
		if ( element.label ) {
			element.label.data.attributes.Text = 
				( element.data.attributes.masked ? '*'.repeat( element.data.attributes.Value.length ) : element.data.attributes.Value ) +
				( element.blinkcursorvisible ? '▍' : ' ' );
			window.App.Viewport.Redraw();
		}
	},
	
});
