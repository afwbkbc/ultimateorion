class Block extends require( '../BlockElement' ) {

	constructor() {
		super( module.filename );
		
		this.SetAttributes({
			Expand: 'V',
			ElementWidth: 0,
			ElementHeight: 0,
			ElementMargin: 0,
		});
	}
	
	Prepare() {
		var exp = this.Attributes.Expand;
		if ( exp == 'V' ) {
			this.InnerWidth = 0;
			this.InnerHeight = this.Attributes.ElementMargin; // top margin
		}
		else
			throw new Error( 'unsupported expand type "' + exp + '"' );
		
		this.Background = this.AddElement( 'Layout/Panel', [ 'LT', 'LT' ], [ 0, 0 ], {} );
	}
	
	Append( namespace, attributes ) {
		
		var exp = this.Attributes.Expand;
		var xpos, ypos;
		
		// determine next free position
		if ( exp == 'V' ) {
			xpos = 0; // centered
			ypos = this.InnerHeight; // expanded
		}
		
		// determine position of insertion
		var anchors, coords;
		if ( exp == 'V' ) {
			// center horizontally, expand down
			anchors = [ 'CT', 'CT' ];
			coords = [ 0, ypos ];
		}
		
		// add element
		if ( !attributes.Width )
			attributes.Width = this.Attributes.ElementWidth;
		if ( !attributes.Height )
			attributes.Height = this.Attributes.ElementHeight;
		var element = this.AddElement( namespace, anchors, coords, attributes );
		
		// resize if needed
		var final_width, final_height;
		if ( exp == 'V' ) {
			final_width = xpos + element.GetWidth() + this.Attributes.ElementMargin * 2; // hmargins from both sides
			final_height = ypos + element.GetHeight() + this.Attributes.ElementMargin; // vmargin after
		}
		if ( this.InnerWidth < final_width ) {
			this.InnerWidth = final_width;
			this.SetAttribute( 'Width', final_width );
			this.Background.SetAttribute( 'Width', final_width );
		}
		if ( this.InnerHeight < final_height ) {
			this.InnerHeight = final_height;
			this.SetAttribute( 'Height', final_height );
			this.Background.SetAttribute( 'Height', final_height );
		}
		
		return element;
	}
	
	
}

module.exports = Block;
