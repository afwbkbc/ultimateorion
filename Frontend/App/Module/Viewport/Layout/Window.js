window.App.Viewport.Extend({
	
	Render: function( ctx, element ) {
		ctx.fillStyle = 'rgb( 0, 0, 0, 0.5 )';
		ctx.fillRect( 0, 0, 1920, 1080 );
	},
	
})