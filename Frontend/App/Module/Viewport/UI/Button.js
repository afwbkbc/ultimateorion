window.App.Viewport.Extend({
	
	OnClick: function( ctx, element ) {
		window.App.Connection.Send({
			action: 'viewport_event',
			data: {
				event: 'click',
				element: element.data.id,
			},
		});
	},

});
