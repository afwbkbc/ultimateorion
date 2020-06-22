window.App.Viewport.Extend({
	
	Render: function( ctx, element ) {
		var a = element.data.attributes;
		ctx.fillStyle = a.Color;
		ctx.fillRect( element.coords[ 0 ], element.coords[ 1 ], a.Width, a.Height );
	},
	
});
