window.App.Viewport.Extend({
	
	Render: function( ctx, element ) {
			var a = element.data.attributes;
			var c = element.coords;
			ctx.font = "60px Verdana";
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';
			ctx.fillStyle = 'silver';
			ctx.fillText( a.Text, c[0], c[1] );
	},
	
	GetBounds: function( ctx, element ) {
		ctx.font = "60px Verdana";
		var m = ctx.measureText( element.data.attributes.Text );
		return [ 0, 0, m.width, m.actualBoundingBoxAscent + m.actualBoundingBoxDescent ];
	},
	
});
