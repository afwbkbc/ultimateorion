window.App.Viewport.Extend({

	exported_methods: [ 'Submit' ],
	
	Submit: function() {
		var that = this;
		if ( this.is_submitting )
			return; // still waiting result for previous click
		this.is_submitting = true;
		window.App.Connection.Send({
			action: 'viewport_event',
			data: {
				event: 'submit',
				element: this.data.id,
			},
		}, function( event ) {
			if ( event.action )
				window.App.EventHandler.Handle( event );
			delete that.is_submitting;
		});
	},

});
