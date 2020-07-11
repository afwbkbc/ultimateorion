class Block extends require( '../BlockElement' ) {

	constructor() {
		super( module.filename );
		
		this.SetCoreClass( module.filename );
		
		this.SetAttributes({
			Expand: 'V',
			ElementWidth: 0,
			ElementHeight: 0,
			ElementMargin: 0,
			ElementHasBorder: false,
		});
		
		this.ManagedElements = [];
	}
	
	Prepare() {
		super.Prepare();
		
		var exp = this.Attributes.Expand;
		if ( exp == 'V' ) {
			this.InnerWidth = 0;
			this.InnerHeight = this.Attributes.ElementMargin; // top margin
		}
		else
			throw new Error( 'unsupported expand type "' + exp + '"' );
		
		this.Background = this.AddElement( 'Layout/Panel', [ 'LT', 'LT' ], [ 0, 0 ], {
			HasBorder: this.Attributes.HasBorder,
		});
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
			attributes.Width = this.Attributes.ElementWidth - this.Attributes.ElementMargin * 2;
		if ( !attributes.Height )
			attributes.Height = this.Attributes.ElementHeight;
		attributes.HasBorder = this.Attributes.ElementHasBorder;
		var element = this.AddElement( namespace, anchors, coords, attributes );
		
		// resize if needed
		var updated_attributes = {};
		var final_width, final_height;
		if ( exp == 'V' ) {
			final_width = xpos + element.GetWidth() + this.Attributes.ElementMargin * 2; // hmargins from both sides
			final_height = ypos + element.GetHeight() + this.Attributes.ElementMargin; // vmargin after
		}
		if ( this.InnerWidth < final_width ) {
			this.InnerWidth = final_width;
			updated_attributes.Width = final_width;
		}
		if ( this.InnerHeight < final_height ) {
			this.InnerHeight = final_height;
			updated_attributes.Height = final_height;
		}
		if ( Object.keys( updated_attributes ).length > 0 ) {
			this.SetAttributes( updated_attributes, true );
			this.Background.SetAttributes( updated_attributes, true );
		}
		
		this.ManagedElements.push( element );
		
		return element;
	}
	
	Remove( element ) {
		var shifting_by = 0; // after removal we need to move all other elements up, then shrink and reposition self // TODO: 'H' extend
		for ( var k in this.ManagedElements ) {
			var el = this.ManagedElements[ k ];
			if ( shifting_by ) {
				var o = el.GetOffsets();
				el.SetOffsets( [ o[ 0 ], o[ 1 ] - shifting_by ] );
			}
			else if ( el.Id == element.Id ) {
				shifting_by = element.GetHeight() + this.Attributes.ElementMargin;
				this.RemoveElement( element );
				delete this.ManagedElements[ k ];
			}
		}
		if ( shifting_by ) {
			this.InnerHeight -= shifting_by;
			this.SetAttribute( 'Height', this.InnerHeight, true );
			this.Background.SetAttribute( 'Height', this.InnerHeight, true );
		}
		
	}
	
}

module.exports = Block;
