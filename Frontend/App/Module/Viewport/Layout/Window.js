window.App.Viewport.Extend({
	
	Render: function( ctx, element ) {
		var a = element.data.attributes;
		if ( a.Style == 'game-universe' ) {
			ctx.fillStyle = 'black';
			ctx.fillRect( 0, 0, 1920, 1080 );
		}
		else if ( a.HasBackground ) {
			ctx.fillStyle = 'rgba( 0, 0, 0, 0.5 )';
			ctx.fillRect( 0, 0, 1920, 1080 );
		}
	},
	
	OnAddChild: function( ctx, element, child ) {
		if ( child.data.attributes.Style == 'window-closebutton' )
			element.is_closeable = true; // hack?
	},
	
})