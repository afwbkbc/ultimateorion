window.App.Viewport.Extend({
	
	Render: function( ctx, element ) {
			var a = element.data.attributes;
			var c = element.coords;
			ctx.font = a.FontSize + "px Monospace";
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';
			ctx.fillStyle = 'silver';
			ctx.fillText( a.Text, c[0], c[1] );
	},
	
	GetBounds: function( ctx, element ) {
		var a = element.data.attributes;
		ctx.font = a.FontSize + "px Monospace";
		var m = ctx.measureText( a.Text.trim().length ? a.Text : '▍' );
		return [ 0, 0, m.width, a.FontSize ];
	},
	
});
