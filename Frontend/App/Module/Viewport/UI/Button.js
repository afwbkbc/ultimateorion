window.App.Viewport.Extend({

	behavior: {
		clickable: true,
	},
	
	Prepare: function( ctx, element ) {
		element.form = window.App.Viewport.GetClosest( element, 'UI/Form' );
	},
	
	OnClick: function( ctx, element ) {
		if ( element.data.attributes.Type == 'submit' && element.form )
			element.form.Submit(); // form will handle everything
		else {
			if ( element.is_clicked )
				return; // still waiting result for previous click
			element.is_clicked = true;
			window.App.Connection.Send({
				action: 'viewport_event',
				data: {
					event: 'click',
					element: element.data.id,
				},
			}, function( event ) {
				if ( event.action )
					window.App.EventHandler.Handle( event );
				delete element.is_clicked;
			});
		}
		return true;
	},

});
