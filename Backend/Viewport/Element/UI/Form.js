class Form extends require( '../Layout/Panel' ) {
	
	constructor( filename ) {
		super( filename ? filename : module.filename );
		
		this.Fields = {};
		this.CurrentTopOffset = 0;
		
		this.SetAttributes({
			FieldHeight: 170,
			FieldMargin: 10,
			FieldPadding: 10,
			InputHeight: 80,
			InputIndent: 100,
		});
	}

	AddInput( name, label, attributes ) {
		var f = {
			Panel: this.AddElement( 'Layout/Panel', [ 'CT', 'CT' ], [ 0, this.Attributes.FieldMargin + this.CurrentTopOffset ], {
				Width: this.Attributes.Width - this.Attributes.FieldMargin * 2,
				Height: this.Attributes.FieldHeight,
			})
		};
		f.Label = f.Panel.AddElement( 'UI/Label', [ 'LT', 'LT' ], [ this.Attributes.FieldPadding, this.Attributes.FieldPadding ], {
			Text: label + ':',
		});
		f.Input = f.Panel.AddElement( 'UI/Input', [ 'RB', 'RB' ], [ -this.Attributes.FieldPadding, -this.Attributes.FieldPadding ], Object.assign( attributes ? attributes : {}, {
			Name: name,
			Width: this.Attributes.Width - this.Attributes.FieldMargin * 2 - this.Attributes.FieldPadding * 2 - this.Attributes.InputIndent,
			Height: this.Attributes.InputHeight,
			MaxLength: 13,
		}));
		
		if ( !this.CurrentTopOffset ) // first input
			f.Input.Focus();
			
		this.Fields[ name ] = f;
		this.CurrentTopOffset += this.Attributes.FieldHeight + this.Attributes.FieldMargin;
	}
	
	AddSubmit( label, attributes ) {
		this.AddElement( 'UI/Button', [ 'CT', 'CT' ], [ 0, this.Attributes.FieldMargin * 2 + this.CurrentTopOffset ], Object.assign( attributes ? attributes : {}, {
			Label: label,
			Width: this.Attributes.Width - this.Attributes.FieldMargin * 2 - this.Attributes.FieldPadding * 2,
			Height: this.Attributes.InputHeight,
		}));
		
		this.CurrentTopOffset += this.Attributes.FieldHeight + this.Attributes.FieldMargin * 2;
	}
	
}

module.exports = Form;
