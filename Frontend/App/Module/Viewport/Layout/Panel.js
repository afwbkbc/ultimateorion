window.App.Viewport.Extend({
	
	Render: function( ctx, element ) {
		var a = element.data.attributes;
		var c = element.coords;
		ctx.strokeStyle = 'aqua';
		ctx.strokeRect( c[0], c[1], a.Width, a.Height );
		ctx.fillStyle = element.bgstyle ? element.bgstyle : 'rgba( 0, 0, 0, 0.5 )';
		ctx.fillRect( c[0] + 1, c[1] + 1, a.Width - 2, a.Height - 2 );
	},
	
})