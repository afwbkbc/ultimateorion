window.App.Viewport.Extend({
	
	Render: function( ctx, element ) {
		if ( element.data.attributes.HasBackground ) {
			ctx.fillStyle = 'rgb( 0, 0, 0, 0.5 )';
			ctx.fillRect( 0, 0, 1920, 1080 );
		}
	},
	
	OnAddChild: function( ctx, element, child ) {
		if ( child.data.attributes.Style == 'window-closebutton' )
			element.is_closeable = true; // hack?
	},
	
})